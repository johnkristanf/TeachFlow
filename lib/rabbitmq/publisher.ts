import amqp, { Connection, Channel } from 'amqplib'

interface RabbitMQState {
    connection: Connection | null
    channel: Channel | null
    isConnected: boolean
    connectingPromise: Promise<{ connection: Connection; channel: Channel }> | null
}

// Global state for the RabbitMQ connection and channel
const rabbitMQState: RabbitMQState = {
    connection: null,
    channel: null,
    isConnected: false,
    connectingPromise: null, // To prevent multiple simultaneous connection attempts
}

const RABBITMQ_URL = process.env.RABBITMQ_URL

async function initRabbitMQ(): Promise<{ connection: Connection; channel: Channel }> {
    // If a connection attempt is already in progress, return that promise
    if (rabbitMQState.connectingPromise) {
        return rabbitMQState.connectingPromise
    }

    // If already connected, return the existing connection and channel
    if (rabbitMQState.isConnected && rabbitMQState.connection && rabbitMQState.channel) {
        console.log('Using existing RabbitMQ connection.')
        return { connection: rabbitMQState.connection, channel: rabbitMQState.channel }
    }

    // If not connected, establish a new connection
    rabbitMQState.connectingPromise = new Promise(async (resolve, reject) => {
        if (!RABBITMQ_URL) {
            throw new Error('RABBITMQ_URL is not defined in environment variables.')
        }
        console.log('Attempting to connect to RabbitMQ...')

        try {
            const channelModel = await amqp.connect(RABBITMQ_URL)
            const channel = await channelModel.createChannel()

            // Set up error handling and close listeners for the connection
            channelModel.on('error', (err) => {
                console.error('RabbitMQ connection error:', err)
                rabbitMQState.isConnected = false
                rabbitMQState.connection = null
                rabbitMQState.channel = null
                rabbitMQState.connectingPromise = null // Reset promise on error to allow re-connection
            })

            channelModel.connection.on('close', () => {
                console.log(
                    'RabbitMQ connection closed. Attempting to reconnect in 5 seconds...'
                )
                rabbitMQState.isConnected = false
                rabbitMQState.connection = null
                rabbitMQState.channel = null
                rabbitMQState.connectingPromise = null // Reset promise on close to allow re-connection
                // Optional: Implement a re-connection strategy here, e.g., setTimeout(initializeRabbitMQ, 5000);
            })

            rabbitMQState.connection = channelModel.connection
            rabbitMQState.channel = channel
            rabbitMQState.isConnected = true
            console.log('Successfully connected to RabbitMQ.')

            resolve({ connection: channelModel.connection, channel })
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error)
            rabbitMQState.isConnected = false
            rabbitMQState.connection = null
            rabbitMQState.channel = null
            rabbitMQState.connectingPromise = null // Reset promise on error
            reject(error)
        }
    })

    return rabbitMQState.connectingPromise
}

export async function publishToQueue(queue: string, message: any) {
    const { channel } = await initRabbitMQ()
    if (!channel) throw new Error('Failed to create channel')

    const dlxName = 'grading_dlx'
    const dlxRoutingKey = 'failed_grading'

    await channel.assertExchange(dlxName, 'topic', { durable: true })

    const dlqName = 'grading_dlq'
    await channel.assertQueue(dlqName, { durable: true })
    await channel.bindQueue(dlqName, dlxName, dlxRoutingKey)

    await channel.assertQueue(queue, {
        durable: true,
        arguments: {
            'x-dead-letter-exchange': dlxName,
            'x-dead-letter-routing-key': dlxRoutingKey,
        },
    })

    const messageBuffer = Buffer.from(JSON.stringify(message))

    channel.sendToQueue(queue, messageBuffer, {
        persistent: true,
    })
}

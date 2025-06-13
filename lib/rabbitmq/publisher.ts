import * as amqp from 'amqplib'

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost'
let connection: amqp.Connection | null = null
let channel: amqp.Channel | null = null

async function initRabbitMQ() {
    if (!connection) {
        connection = await amqp.connect(RABBITMQ_URL)
        channel = await connection.createChannel()
    }
    return { connection, channel }
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
    
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
    })
}

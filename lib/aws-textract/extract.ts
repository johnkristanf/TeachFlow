import {
    TextractClient,
    DetectDocumentTextCommand,
} from '@aws-sdk/client-textract'

const client = new TextractClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
})

export async function extractTextFromImage(imageBuffer: Buffer) {
    const command = new DetectDocumentTextCommand({
        Document: {
            Bytes: imageBuffer,
        },
    })

    console.log('Extract here ')

    try {
        const result = await client.send(command)
        console.log('Extract result: ', result)

        const lines =
            result?.Blocks?.filter((b) => b.BlockType === 'LINE')?.map(
                (b) => b.Text
            ) || []

        return lines.join('\n')
    } catch (err: any) {
        console.error('Textract error:', err)
        throw new Error('Failed to extract text from image')
    }
}

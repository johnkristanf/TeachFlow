import { ImageAnnotatorClient } from '@google-cloud/vision'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const vision = new ImageAnnotatorClient({
    // Option A: Use service account file
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
})

export async function extractTextFromImage(fileBuffer: Buffer): Promise<string> {
    try {
        const [result] = await vision.textDetection({
            image: { content: fileBuffer.toString('base64') },
        })

        const textAnnotations = result.textAnnotations

        if (textAnnotations && textAnnotations.length > 0) {
            // First annotation contains the full extracted text
            return textAnnotations[0].description || ''
        }

        return ''
    } catch (error) {
        console.error('Error extracting text from image:', error)
        throw new Error('Failed to extract text from image')
    }
}

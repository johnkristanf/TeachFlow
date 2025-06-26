// import pdf from 'pdf-parse'

// export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
//     const data = await pdf(buffer)
//     return data.text.trim()
// }

export async function extractTextFromPDF(file: File): Promise<string> {
    const apiKey = process.env.OCR_SPACE_API_KEY!
    const formData = new FormData()

    formData.append('file', file)
    formData.append('isOverlayRequired', 'false')
    formData.append('OCREngine', '2') // 1 = default, 2 = better
    formData.append('language', 'eng')
    formData.append('apikey', apiKey)

    const res = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
    })

    const json = await res.json()

    if (!json || json.IsErroredOnProcessing) {
        throw new Error(json?.ErrorMessage || 'OCR failed')
    }

    const parsedResults = json.ParsedResults?.map((r: any) => r.ParsedText).join('\n') ?? ''
    return parsedResults.trim()
}

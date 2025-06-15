export async function enchanceImage(buf: Buffer, file: File) {
    const apiForm = new FormData()
    apiForm.append('file', new Blob([buf]), file.name)

    const fastapiRes = await fetch('http://localhost:8000/enhance', {
        method: 'POST',
        body: apiForm,
    })

    if (!fastapiRes.ok) {
        console.error('Enhancement failed:', await fastapiRes.text())
        throw new Error('Fail to enchance Image')
    }

    // Step 2: Get enhanced image as Buffer
    const enhancedBlob = await fastapiRes.blob()
    const enhancedBuffer = Buffer.from(await enhancedBlob.arrayBuffer())

    return enhancedBuffer
}

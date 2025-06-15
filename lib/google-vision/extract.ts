
// const keyPath = path.resolve(process.cwd(), 'teachflow-vision-key.json')
// console.log('DEBUG: Resolved path to key file:', keyPath)


// async function debugVisionAPI() {
//     try {
//         // 1. Check if key file exists and is readable
//         if (!fs.existsSync(keyPath)) {
//             throw new Error(`Key file not found at: ${keyPath}`)
//         }
        
//         const keyContent = JSON.parse(fs.readFileSync(keyPath, 'utf8'))
//         console.log('✅ Key file found')
//         console.log('Project ID from key:', keyContent.project_id)
//         console.log('Client email:', keyContent.client_email)
        
//         // 2. Test authentication
//         const client = new ImageAnnotatorClient({
//             keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//         })
        
//         const [projectId] = await client.getProjectId()
//         console.log('✅ Authentication successful')
//         console.log('Authenticated project ID:', projectId)
        
//         // 3. Test a simple API call (this will fail if permissions are wrong)
//         const testImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64')
        
//         const [result] = await client.textDetection({
//             image: { content: testImage.toString('base64') }
//         })
        
//         console.log('✅ Vision API call successful')
//         console.log('API response received (empty image test)')
        
//     } catch (error: any) {
//         console.error('❌ Debug failed:', error.message)
        
//         if (error.code === 16) {
//             console.log('\n🔧 SOLUTION:')
//             console.log('1. Ensure Cloud Vision API is enabled')
//             console.log('2. Add "Cloud AI Service Agent" role to your service account')
//             console.log('   (Cloud Vision API Service Agent is deprecated)')
//             console.log('3. Alternative: Use "AI Platform Service Agent" or "Cloud Vision API Admin"')
//             console.log('4. Wait a few minutes for permissions to propagate')
//         }
//     }
// }
// debugVisionAPI()

// export async function extractTextFromImage(
//     imageBuffer: Buffer
// ): Promise<string> {
   
//     const vision = new ImageAnnotatorClient({
//         keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//     })

//     try {
//         const [result] = await vision.documentTextDetection({
//             image: { content: imageBuffer.toString('base64') },
//         })

//         const textAnnotations = result.textAnnotations

//         if (textAnnotations && textAnnotations.length > 0) {
//             return (
//                 result.fullTextAnnotation?.text ||
//                 textAnnotations[0].description ||
//                 ''
//             )
//         }

//         return ''
//     } catch (error) {
//         console.error('Error extracting text from image:', error)
//         throw new Error('Failed to extract text from image')
//     }
// }

// export async function enchanceImage(file: File) {
//     try {
//         const buffer = Buffer.from(await file.arrayBuffer())

//         const form = new FormData()
//         form.append('image', buffer, {
//             filename: file.name,
//             contentType: file.type,
//         })
//         form.append('scale', 2)

//         console.log('Form size:', form.getLengthSync(), 'bytes')

//         const res = await axios.post(
//             'https://api.developer.pixelcut.ai/v1/upscale',
//             form,
//             {
//                 headers: {
//                     Accept: 'application/json',
//                     'X-API-KEY': process.env.PIXELCUT_API_KEY!,
//                     ...form.getHeaders(), // Content-Type with boundary
//                 },
//                 maxContentLength: Infinity,
//                 maxBodyLength: Infinity,
//             }
//         )

//         console.log('Pixelcut API success:', res.data)
//         return res.data && res.data.result_url
//     } catch (err: any) {
//         console.error('Pixelcut API Error Response:', err.response?.data)
//         throw new Error(
//             `Pixelcut API Error: ${JSON.stringify(err.response?.data)}`
//         )
//     }
// }

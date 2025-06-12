import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
    const data = await req.json()
    const { topic, numSlides = 5, includeImages = true } = data

    try {
        const contentResponse = await openai.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert presentation designer. Create engaging presentations with creative topics and visual elements.`,
                },
                {
                    role: 'user',
                    content: `
                        Create a ${numSlides}-slide presentation about "${topic}".
                        
                        Return JSON with this structure:
                        {
                            "title": "Creative Presentation Title",
                            "subtitle": "Engaging subtitle",
                            "theme": "modern|corporate|creative|minimalist",
                            "colorScheme": {
                                "primary": "#hex",
                                "secondary": "#hex",
                                "accent": "#hex",
                                "background": "#hex"
                            },
                            "slides": [
                                {
                                    "id": 1,
                                    "type": "title|content|image|quote|comparison",
                                    "title": "Slide Title",
                                    "content": ["Point 1", "Point 2"],
                                    "imagePrompt": "Detailed image description for DALL-E",
                                    "layout": "center|left|right|split",
                                    "notes": "Speaker notes"
                                }
                            ]
                        }
                        
                        Make it creative and visually engaging. Include varied slide types.
                        For imagePrompt, provide detailed, creative descriptions for generating relevant images.
                    `,
                },
            ],
            temperature: 0.8,
            max_tokens: 3000,
        })

        const presentationData = JSON.parse(contentResponse.choices[0].message.content ?? '')
        console.log('presentationData: ', presentationData)

        if (includeImages) {
            const imagesPromises = presentationData.slides
                .filter((slide) => slide.imagePrompt)
                .map(async (slide) => {
                    try {
                        const imageResponse = await openai.images.generate({
                            model: 'dall-e-3',
                            prompt: `Professional presentation image: ${slide.imagePrompt}. Clean, modern style suitable for business presentation.`,
                            size: '1024x1024',
                            quality: 'standard',
                            n: 1,
                        })

                        console.log("imageResponse: ", imageResponse);
                        

                        return {
                            slideId: slide.id,
                            imageUrl: imageResponse.data && imageResponse.data[0].url,
                            prompt: slide.imagePrompt,
                        }
                    } catch (error) {
                        console.error(`Error generating image for slide ${slide.id}:`, error)
                        return null
                    }
                })

            const generatedImages = await Promise.all(imagesPromises)

            // Add image URLs to slides
            generatedImages.forEach((imageData) => {
                if (imageData) {
                    const slide = presentationData.slides.find((s) => s.id === imageData.slideId)
                    if (slide) {
                        slide.imageUrl = imageData.imageUrl
                    }
                }
            })
        }

        return NextResponse.json(presentationData, { status: 201 })
        
    } catch (error: any) {
        console.error('Error generating presentation:', error)
        return NextResponse.json(
            {
                message: 'Error generating presentation',
                error: error.message,
            },
            { status: 500 }
        )
    }
}

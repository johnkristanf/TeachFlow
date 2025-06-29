import { useEffect, useMemo, useState } from 'react'
import { Brain, Shapes, Target } from 'lucide-react'

export const FeaturesSection = () => {
    const [currentFeature, setCurrentFeature] = useState(0)

    const features = useMemo(
        () => [
            {
                icon: <Brain className="w-12 h-12" />,
                title: 'AI Essay Grading',
                description:
                    'Advanced AI analyzes essays for content, structure, grammar, and style with human-level accuracy',
                color: 'from-blue-500 to-cyan-500',
            },
            {
                icon: <Target className="w-12 h-12" />,
                title: 'Smart Rubric Builder',
                description:
                    'Create custom rubrics tailored to your curriculum with AI-powered suggestions and templates',
                color: 'from-indigo-500 to-purple-500',
            },
            {
                icon: <Shapes className="w-12 h-12" />,
                title: 'AI Quiz Generator',
                description:
                    'Transform your learning material into dynamic assessments. Our AI reads your PDFs or DOCX files and auto-generates Multiple Choice, Fill in the Blank, and True/False questions — tailored to your curriculum.',
                color: 'from-emerald-500 to-teal-400',
            },
        ],
        []
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])
    
    return (
        <section className="relative z-10 py-32 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Powerful Features
                        </span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Experience the next generation of educational technology with our
                        comprehensive AI grading suite
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`group relative bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                                currentFeature === index
                                    ? 'ring-2 ring-blue-500/50 shadow-2xl shadow-blue-500/20'
                                    : ''
                            }`}
                        >
                            <div
                                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                            >
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 rounded-3xl transition-all duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

import { ArrowRight } from 'lucide-react'
import React from 'react'

interface HeroSectionProps {
    onStartTrial: () => void
}

export const HeroSection = React.memo(({ onStartTrial }: HeroSectionProps) => {
    const demoVideoLink = 'https://drive.google.com/file/d/1ws3EGRflEWlI1MCTvmjPC6at5JfxDmig/view?usp=sharing';

    return (
        <section className="relative z-10 pt-20 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                AI-Powered
                            </span>
                            <br />
                            Teaching Assistant
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            A modern AI platform built to support educators and streamline their
                            daily tasks — helping transform the way teaching and learning happens.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={onStartTrial}
                            className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-2"
                        >
                            <span>Start Free Trial</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <a
                            href={demoVideoLink}
                            target="__blank"
                            className="border-2 border-white/20 hover:border-white/40 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                        >
                            Watch Demo
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
})

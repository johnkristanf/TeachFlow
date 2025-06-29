import { ArrowRight } from 'lucide-react'
import React from 'react'

interface CTASectionProps {
    onStartTrial: () => void
}

export const CTASection = React.memo(({ onStartTrial }: CTASectionProps) => {
    return (
        <section className="relative z-10 py-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-lg rounded-3xl p-12 border border-white/10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Transform Your
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Grading Process?
                        </span>
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of educators already using TeachFlow to save time and improve
                        student outcomes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center space-x-2"
                            onClick={onStartTrial}
                        >
                            <span>Start Your Free Trial</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
})

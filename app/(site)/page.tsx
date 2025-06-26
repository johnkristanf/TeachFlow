'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { ArrowRight, Brain, Shapes, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
    const [currentFeature, setCurrentFeature] = useState(0)
    const router = useRouter()

    const features = [
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
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
            {/* Hero Section */}
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
                                daily tasks — helping transform the way teaching and learning
                                happens.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => {
                                    router.push('/auth/signin')
                                }}
                                className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-2"
                            >
                                <span>Start Free Trial</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="border-2 border-white/20 hover:border-white/40 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                                Watch Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
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
                                <p className="text-gray-300 leading-relaxed">
                                    {feature.description}
                                </p>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 rounded-3xl transition-all duration-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
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
                            Join thousands of educators already using TeachFlow to save time and
                            improve student outcomes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center space-x-2"
                                onClick={() => {
                                    router.push('/auth/signin')
                                }}
                            >
                                <span>Start Your Free Trial</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 bg-black/20 backdrop-blur-lg border-t border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <Image
                                src={'/teachflow-logo.png'}
                                alt="TeachFlow Logo"
                                width={50}
                                height={50}
                                className="rounded-full"
                            />

                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                                TeachFlow
                            </span>
                        </div>
                        <div className="text-gray-400 text-center md:text-right">
                            <p>&copy; 2025 TeachFlow. All rights reserved.</p>
                            <p className="text-sm mt-1">Revolutionizing education through AI</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

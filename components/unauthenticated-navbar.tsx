'use client'
import React, { useState } from 'react'
import { X, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function UnAuthenticatedNavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const router = useRouter()

    const navLinks = [
        { name: 'Home', route: '/' },
        { name: 'Pricing', route: '/pricing' },
        { name: 'Contact Us', route: '/contact-us' },
    ]
    return (
        <header className="relative z-50 bg-black/20 backdrop-blur-lg ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
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

                    <nav className="hidden md:flex space-x-8">
                        {navLinks.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => {
                                    router.push(item.route)
                                }}
                                className="font-semibold hover:opacity-75 hover:cursor-pointer"
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={() => {
                                router.push('/auth/signin')
                            }}
                            className="font-semibold hover:text-white hover:cursor-pointer transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => {
                                router.push('/auth/register')
                            }}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                        >
                            Get Started
                        </button>
                    </div>

                    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-lg border-b border-white/10">
                    <div className="px-4 py-6 space-y-4">
                        {navLinks.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => {
                                    router.push(item.route)
                                }}
                            >
                                {item.name}
                            </button>
                        ))}
                        <div className="pt-4 space-y-2">
                            <button className="w-full text-left text-gray-300 hover:text-white hover:cursor-pointer transition-colors">
                                Sign In
                            </button>
                            <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 rounded-lg font-semibold">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

import Image from "next/image"

export const Footer = () => {
    return (
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
    )
}

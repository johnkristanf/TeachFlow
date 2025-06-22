import { CheckCircle } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="relative z-10 py-18">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Simple Pricing
                        </span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Choose the perfect plan for your educational needs. Start free and scale as
                        you grow.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Starter Plan */}
                    <div className="group relative bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-2">Starter</h3>
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                                Free
                            </div>
                            <p className="text-gray-300 mb-6">
                                Perfect for individual teachers getting started
                            </p>
                            <ul className="space-y-3 text-left mb-8">
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>Up to 25 essays/month</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>Basic rubric templates</span>
                                </li>
                            </ul>
                            <button className="w-full bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition-all duration-200">
                                Get Started Free
                            </button>
                        </div>
                    </div>

                    {/* Professional Plan */}
                    <div className="group relative bg-gradient-to-b from-blue-600/10 to-purple-600/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-blue-500/50 transform scale-105 shadow-2xl shadow-blue-500/20">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 rounded-full text-sm font-semibold">
                                Most Popular
                            </span>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-2">Professional</h3>
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                                $7.99
                            </div>
                            <p className="text-gray-300 text-sm mb-4">per month</p>
                            <p className="text-gray-300 mb-6">
                                Ideal for active educators and small departments
                            </p>
                            <ul className="space-y-3 text-left mb-8">
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>Up to 500 essays/month</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>Custom rubric builder</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>Advanced AI feedback</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>Analytics dashboard</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>Priority support</span>
                                </li>
                            </ul>
                            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105">
                                Start Free Trial
                            </button>
                        </div>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="group relative bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                                Custom
                            </div>
                            <p className="text-gray-300 mb-6">
                                For schools and large educational institutions
                            </p>
                            <ul className="space-y-3 text-left mb-8">
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>Unlimited essays</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>Advanced integrations</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>Custom AI training</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>Dedicated support</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>SLA guarantee</span>
                                </li>
                            </ul>
                            <button className="w-full bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition-all duration-200">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client'

import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { CTASection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
    const router = useRouter()

    const handleStartTrial = useCallback(() => {
        router.push('/auth/signin')
    }, [router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
            <HeroSection onStartTrial={handleStartTrial} />
            <FeaturesSection />
            <CTASection onStartTrial={handleStartTrial} />
            <Footer />
        </div>
    )
}

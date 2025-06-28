'use client'

import { PrimaryButton } from '@/components/ui/primary-button'

export default function VerifyRequestPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="max-w-md w-full space-y-3">
                <h2 className="text-center text-3xl font-extrabold text-white">Check your Email</h2>
                <p className="mt-2 text-center text-sm text-gray-200">
                    We've sent a magic link to your email address
                </p>
                <p className="mt-4 text-center text-sm text-gray-200">
                    Click the link in the email to sign in. You can close this window.
                </p>
                <div className="mt-6">
                    <PrimaryButton
                        onClick={() => window.history.back()}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium "
                    >
                        Back to sign in
                    </PrimaryButton>
                </div>
            </div>
        </div>
    )
}

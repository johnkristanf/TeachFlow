'use client'

import AvatarSection from '@/components/account/avatar-section'
import AccountProfile from '@/components/account/profile'
import { UserProfile } from '@/types/user'
import { useSession } from 'next-auth/react'
import { useCallback, useMemo } from 'react'

export default function AccountPage() {
    const { data: session, status, update } = useSession()
    const user = useMemo(() => session?.user, [session?.user])

    const refreshSession = useCallback(
        async () => {
            const result = await update({})
            console.log('Session update result: ', result)
            return result
        },
        [update]
    )

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex justify-center font-semibold">
                <p className="text-xl text-gray-500 mt-18">Loading User Data...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex justify-center font-semibold">
                <p className="text-xl text-gray-500 mt-18">Failed to Load User Profile</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div className="mb-8">
                    <h1 className="text-4xl text-blue-600 font-bold ">Account Settings</h1>
                    <p className="text-gray-600 mt-2">
                        Manage your account preferences and settings
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <div className="w-[95%] bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    {/* AVATAR SECTION */}
                    <AvatarSection user={user} refreshSession={refreshSession} />

                    {/* PROFILE */}
                    <AccountProfile user={user} refreshSession={refreshSession} />
                </div>
            </div>
        </div>
    )
}

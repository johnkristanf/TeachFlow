'use client'

import { Edit3 } from 'lucide-react'
import { User } from 'next-auth'
import { useState } from 'react'
import { PrimaryButton } from '../ui/primary-button'
import { useForm } from 'react-hook-form'
import { UserProfile } from '@/types/user'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UpdateSession } from 'next-auth/react'
import React from 'react'

interface AccountProfileProps {
    user: User
    refreshSession: UpdateSession
}

const AccountProfile: React.FC<AccountProfileProps> = React.memo(({ user, refreshSession }) => {
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserProfile>({
        defaultValues: {
            name: user.name ?? '',
            email: user.email ?? '',
            phone: user.phone ?? '',
            location: user.location ?? '',
        },
    })

    const userProfileUpdateMutation = useMutation({
        mutationFn: async (data: UserProfile) => {
            const res = await fetch(`/api/user`, {
                method: 'PUT',
                body: JSON.stringify(data),
                credentials: 'include',
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data?.error || 'Failed update user profile')
            }

            return res.json()
        },

        onSuccess: async (response) => {
            console.log('success response: ', response)

            setIsEditing(false);
            await refreshSession();
            toast.success(response.message);
        },

        onError: (error) => {
            console.error(error)
            toast.error(error.message)
        },
    })

    const onSubmit = (data: UserProfile) => {
        console.log('Updated Profile Data:', data)
        userProfileUpdateMutation.mutate(data)
    }

    const handleCancel = () => {
        setIsEditing(false)
        reset({
            name: user.name ?? '',
            email: user.email ?? '',
            phone: user.phone ?? '',
            location: user.location ?? '',
        })
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Edit3 className="w-4 h-4" />
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        {...register('name', { required: 'Full name is required' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />

                                    {errors.name && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-900">{user.name ? user.name : 'N/A'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            {isEditing ? (
                                <>
                                    <input
                                        type="email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />

                                    {errors.email && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-900">{user.email ? user.email : 'N/A'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone
                            </label>
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        {...register('phone')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </>
                            ) : (
                                <p className="text-gray-900">{user.phone ? user.phone : 'N/A'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        {...register('location')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </>
                            ) : (
                                <p className="text-gray-900">
                                    {user.location ? user.location : 'N/A'}
                                </p>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-6 flex justify-end gap-3">
                            <PrimaryButton
                                onClick={handleCancel}
                                variant="outline"
                                size="md"
                                color="black"
                            >
                                Cancel
                            </PrimaryButton>

                            <PrimaryButton type="submit" variant="outline" size="md">
                                Save Changes
                            </PrimaryButton>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
})

export default AccountProfile

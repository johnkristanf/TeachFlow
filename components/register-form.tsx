'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PrimaryButton } from './ui/primary-button'
import { signInWithCredentials } from '@/actions/auth'
import { useForm } from 'react-hook-form'
import { RegisterCredentials } from '@/types/user'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
    const router = useRouter()

    const handleSignInRedirect = () => {
        router.push('/auth/signin')
    }

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterCredentials>()

    const onSubmit = async (credentials: RegisterCredentials) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            })

            const data = await res.json()

            if (!res.ok && data.error) {
                throw new Error(data.error)
            }

            // auto-login
            const formData = new FormData()
            formData.append('email', data.email)
            formData.append('password', data.password)

            const result = await signInWithCredentials(formData)

            if (result) {
                toast.success('Registration successful! Logging you in...')
                router.push('/essays')
            }
        } catch (error) {
            console.error('Error registering user:', error)

            if (error instanceof Error) {
                if (error.message === 'user_already_exists') {
                    toast.warning('Email already exists, please register another.')
                    return
                }

                if (error.message === 'missing_fields') {
                    toast.warning('Missing fields, please provide each.')
                    return
                }

                toast.error('Registration failed, please try again.')
            }
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create Your Account</CardTitle>
                    <CardDescription>
                        Kindly provide your details to register and gain access.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6 mt-3">
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Name</Label>
                                    <Input
                                        id="name"
                                        type="name"
                                        placeholder="m@example.com"
                                        {...register('name', { required: 'Name is required' })}
                                    />

                                    {errors.name && (
                                        <p className="text-red-500 text-xs">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        {...register('email', { required: 'Email is required' })}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="email">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="m@example.com"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 8,
                                                message: 'Password must be at least 8 characters',
                                            },
                                        })}
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-xs">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <PrimaryButton
                                    type="submit"
                                    color="blue"
                                    variant="outline"
                                    disabled={isSubmitting}
                                    className={isSubmitting ? 'hover:!cursor-not-allowed' : ''}
                                >
                                    {isSubmitting ? 'Signing up...' : 'Sign Up'}
                                </PrimaryButton>

                                <div className="text-center">
                                    Already have an account?{' '}
                                    <span
                                        className="underline hover:cursor-pointer"
                                        onClick={handleSignInRedirect}
                                    >
                                        Sign In
                                    </span>
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-white  text-center text-xs text-balance ">
                By clicking continue, you agree to our{' '}
                <a href="#" className="underline">
                    Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="underline">
                    Privacy Policy
                </a>
                .
            </div>
        </div>
    )
}

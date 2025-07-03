'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PrimaryButton } from './ui/primary-button'
import { signInWithCredentials, signInWithGoogle } from '@/actions/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const router = useRouter()

    const handleRegisterRedirect = () => {
        router.push('/auth/register')
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsSubmitting(true)

        try {
            const formData = new FormData(event.currentTarget)
            const result = await signInWithCredentials(formData)

            if (result) {
                toast.success('Successfully signed in!')
                router.push('/essays')
            }   
        } catch (error) {
            console.error('Error in signing in user: ', error)
            toast.error(error instanceof Error ? error.message : 'Failed to sign in')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>Login with Google account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3 pt-1 pb-2 ">
                        {/* FACEBOOK OAUTH LOGIN */}
                        {/* <form action={signInWithFacebook}>
                                <Button
                                    type="submit"
                                    variant="outline"
                                    className="w-full hover:cursor-pointer p-8"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M14 13.5H16.5L17.5 10.5H14V8.5C14 7.25 14.5 6.5 16 6.5H17.5V3.5C17.133 3.467 15.667 3.333 14 3.5C11.5 3.5 10 5.167 10 7.75V10.5H7V13.5H10V22H13V13.5H14Z" />
                                    </svg>
                                    Signin with Facebook
                                </Button>
                            </form> */}

                        {/* GOOGLE OAUTH LOGIN */}
                        <form action={signInWithGoogle} method="POST">
                            <Button
                                type="submit"
                                variant="outline"
                                className="w-full hover:cursor-pointer"
                            >
                                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Signin with Google
                            </Button>
                        </form>
                    </div>

                    <form onSubmit={handleSubmit} method="POST">
                        <div className="grid gap-6 mt-3">
                            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                <span className="bg-card text-muted-foreground relative z-10 px-2">
                                    Or continue with
                                </span>
                            </div>
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="m@example.com"
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="email">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="m@example.com"
                                    />
                                </div>

                                <PrimaryButton
                                    type="submit"
                                    color="blue"
                                    variant="outline"
                                    disabled={isSubmitting}
                                    className={isSubmitting ? 'hover:!cursor-not-allowed' : ''}
                                >
                                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                                </PrimaryButton>

                                <div className="text-center">
                                    Don't have an account yet?{' '}
                                    <span
                                        className="underline hover:cursor-pointer"
                                        onClick={handleRegisterRedirect}
                                    >
                                        Sign Up
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

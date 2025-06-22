import { GalleryVerticalEnd } from 'lucide-react'

import { LoginForm } from '@/components/login-form'
import Image from 'next/image'

export default function LoginPage() {
    return (
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <Image
                            src={'/teachflow-logo.png'}
                            width={50}
                            height={50}
                            className='rounded-full'
                            alt="TeachFlow Logo"
                        />
                    </div>
                    <h1 className="text-white">TeachFlow</h1>
                </a>
                <LoginForm />
            </div>
        </div>
    )
}

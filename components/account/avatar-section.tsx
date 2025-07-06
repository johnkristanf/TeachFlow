import { useUploadThing } from '@/lib/uploadthing/components'
import { formatDateMonthYear } from '@/lib/utils'
import { Calendar, Camera } from 'lucide-react'
import { User } from 'next-auth'
import { UpdateSession } from 'next-auth/react'
import React, { useRef } from 'react'
import { toast } from 'sonner'

interface AvatarSectionProps {
    user: User
    refreshSession: UpdateSession
}

const AvatarSection: React.FC<AvatarSectionProps> = React.memo(({ user, refreshSession }) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { startUpload, isUploading } = useUploadThing('imageUploader', {
        onClientUploadComplete: async (res) => {
            console.log('Files: ', res)

            await refreshSession()
            toast.success('Avatar Uploaded Successfully')
        },
        onUploadError: (error: Error) => {
            console.error(`ERROR! ${error.message}`)
            toast.error(`ERROR! ${error.message}`)
        },
    })

    // OPEN FILE SYSTEM
    const handleCameraClick = () => {
        fileInputRef.current?.click()
    }

    // UPLOAD TO UPLOADTHING AFTER CHOOSING FILE
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            startUpload(Array.from(files))
        }
    }

    return (
        <div className="text-center mb-6">
            <div className="relative inline-block">
                <img
                    src={user?.image ? user?.image : '/user-icon.jpg'}
                    alt="User Avatar"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
                <button
                    onClick={handleCameraClick}
                    disabled={isUploading}
                    className={`
                        absolute bottom-0 right-0 
                        bg-blue-400 text-white rounded-full p-1 
                        hover:cursor-pointer hover:bg-blue-500 
                        disabled:bg-gray-400 disabled:cursor-not-allowed
                        transition-colors
                        ${isUploading ? 'animate-pulse' : ''}
                    `}
                >
                    <Camera className="w-4 h-4" />
                </button>

                {isUploading && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                )}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>
                    Joined{' '}
                    {user?.created_at ? formatDateMonthYear(user.created_at.toString()) : 'Unknown'}
                </span>
            </div>
        </div>
    )
})

export default AvatarSection

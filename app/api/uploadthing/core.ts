import { auth } from '@/auth'
import { updateUserAvatar } from '@/lib/queries/user/post'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

export const uploadFileRouter = {
    imageUploader: f({
        image: {
            maxFileSize: '16MB',
            maxFileCount: 1,
        },
    })
        .middleware(async ({ req }) => {
            const session = await auth()
            if (!session) throw new UploadThingError('Unauthorized')

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.user.id }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log('metadata:', metadata)
            console.log('file ', file)

            // UPDATE USER DB COLUMN image to file.ufsUrl WHERE metadata.userId
            try {
                await updateUserAvatar(metadata.userId!, file.ufsUrl)
            } catch (error) {
                if (error instanceof Error) {
                    throw new UploadThingError(`Error updating user avatar: ${error.message}`)
                }
            }

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return {
                uploadedBy: metadata.userId,
            }
        }),
} satisfies FileRouter

export type UploadFileRouter = typeof uploadFileRouter

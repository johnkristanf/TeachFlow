import { generateReactHelpers } from '@uploadthing/react'
import type { UploadFileRouter } from '@/app/api/uploadthing/core'

export const { useUploadThing } = generateReactHelpers<UploadFileRouter>()

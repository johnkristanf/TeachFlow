import { clsx, type ClassValue } from 'clsx'
import path from 'path'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const convertBase64ToFile = (base64String: string, index: number): File => {
    const byteCharacters = atob(base64String.split(',')[1])
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'image/jpeg' })
    const file = new File([blob], `captured-image-${index + 1}.jpg`, {
        type: 'image/jpeg',
    })

    return file
}

export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatArray = (items: any[]) => (items?.length ? items.join(', ') : 'None')

export const getFileExtension = (fileName: string) => path.extname(fileName).toLowerCase()

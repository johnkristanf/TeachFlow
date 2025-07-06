import { clsx, type ClassValue } from 'clsx'
import path from 'path'
import { twMerge } from 'tailwind-merge'

import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'

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

export const getGradingPerformanceLevels = (intensity: string) => {
    switch (intensity?.toLowerCase()) {
        case 'easy':
            return '3 levels: Excellent, Satisfactory, Needs Improvement'
        case 'strict':
            return '5 levels: Exceptional, Proficient, Developing, Beginning, Insufficient'
        default: // Normal
            return '4 levels: Excellent, Proficient, Developing, Beginning'
    }
}

export const numericTimeStamp = () => {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
    const year = String(now.getFullYear()).slice(-2) // Get last 2 digits of year
    const timestamp = `${day}${month}${year}`

    return timestamp
}

export const formatDateMonthYear = (dateString: string) => {
    const date = new Date(dateString)
    const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
    })

    return formatted
}

export const formatArray = (items: any[]) => (items?.length ? items.join(', ') : 'None')

export const getFileExtension = (fileName: string) => path.extname(fileName).toLowerCase()

export const handleDownloadQuizToDocx = async (set: any, index: number) => {
    const children: Paragraph[] = []

    children.push(
        new Paragraph({
            children: [new TextRun({ text: `Quiz Set ${index + 1}`, bold: true, size: 32 })],
            spacing: { after: 300 },
        })
    )

    // Multiple Choice
    if (set.multiple_choice?.length) {
        children.push(
            new Paragraph({
                children: [new TextRun({ text: 'Multiple Choice', bold: true })],
                spacing: { after: 200 },
            })
        )
        set.multiple_choice.forEach((q: any, i: number) => {
            children.push(new Paragraph(`Q${i + 1}: ${q.question}`))
            q.choices.forEach((choice: string, j: number) => {
                children.push(new Paragraph(`   ${String.fromCharCode(65 + j)}. ${choice}`))
            })
            children.push(new Paragraph(`Answer: ${q.answer}`))
        })
    }

    // Fill in the Blank
    if (set.fill_in_blank?.length) {
        children.push(
            new Paragraph({
                children: [new TextRun({ text: 'Fill in the Blank', bold: true })],
                spacing: { before: 400, after: 200 },
            })
        )
        set.fill_in_blank.forEach((q: any, i: number) => {
            children.push(new Paragraph(`Q${i + 1}: ${q.question}`))
            children.push(new Paragraph(`Answer: ${q.answer}`))
        })
    }

    // True or False
    if (set.true_or_false?.length) {
        children.push(
            new Paragraph({
                children: [new TextRun({ text: 'True or False', bold: true })],
                spacing: { before: 400, after: 200 },
            })
        )
        set.true_or_false.forEach((q: any, i: number) => {
            children.push(new Paragraph(`Q${i + 1}: ${q.question}`))
            children.push(new Paragraph(`Answer: ${q.answer ? 'True' : 'False'}`))
        })
    }

    const doc = new Document({ sections: [{ properties: {}, children }] })

    const timestamp = numericTimeStamp()
    const blob = await Packer.toBlob(doc)
    saveAs(blob, `quiz-set-${timestamp}.docx`)
}

export function cleanAIJSONResponse(content: string): string {
    // Remove markdown code blocks and clean up the response
    let cleaned = content.trim()

    // Remove ```json and ``` markers
    cleaned = cleaned.replace(/^```json\s*/i, '')
    cleaned = cleaned.replace(/\s*```$/, '')

    // Remove any remaining backticks at start/end
    cleaned = cleaned.replace(/^`+/, '').replace(/`+$/, '')

    return cleaned.trim()
}

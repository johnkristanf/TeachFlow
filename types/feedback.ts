export type FeedbackData = {
    rating: number
    liked: string
    bugs: string
    confusing?: string
    suggestions: string
    contact?: string
    easeOfUse: number
    wouldUseAgain: string
    willingToPay: string
    performance: 'fast' | 'acceptable' | 'slow'
}

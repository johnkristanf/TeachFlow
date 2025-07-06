export type RegisterCredentials = {
    name: string
    email: string
    password: string
}

export type User = {
    id: string
    name: string | null
    email: string | null
    password: string | null
}

export type UserProfile = {
    name: string
    email: string
    phone?: string
    location?: string
}

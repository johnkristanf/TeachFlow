// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string | undefined
            phone?: string | null
            location?: string | null
            provider?: string
            created_at?: Date
        } & DefaultSession['user']
    }

    interface User extends DefaultUser {
        phone?: string | null
        location?: string | null
        provider?: string
        created_at?: Date
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id: string | undefined
        phone?: string | null
        location?: string | null
        provider?: string
        created_at?: Date
    }
}

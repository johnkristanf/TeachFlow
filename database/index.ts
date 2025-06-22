import { drizzle } from 'drizzle-orm/node-postgres'
if (process.env.NODE_ENV !== 'production') {
    await import('dotenv/config')
}
export const db = drizzle(process.env.DATABASE_URL!) 

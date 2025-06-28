import { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
    // console.log('All cookies:', request.cookies.getAll())

    const devSessionCookie = request.cookies.get('authjs.session-token')
    const prodSessionCookie = request.cookies.get('__Secure-authjs.session-token')

    const isLoggedIn = !!(devSessionCookie?.value || prodSessionCookie?.value)
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth')

    const publicRoutes = ['/', '/pricing', '/contact-us']
    const protectedRoutes = ['/essays', '/classes', '/feedback', '/rubrics', '/quiz/generator'] // add more as needed

    const isProtectedRoute = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    )
    const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname === route)

    // ✅ Redirect logged-in users away from auth pages & public routes like landing
    if (isLoggedIn && (isAuthPage || isPublicRoute)) {
        return Response.redirect(new URL('/essays', request.nextUrl))
    }

    // Redirect non-logged-in users to sign-in page for protected routes
    if (!isLoggedIn && isProtectedRoute) {
        return Response.redirect(new URL('/auth/signin', request.nextUrl))
    }
}

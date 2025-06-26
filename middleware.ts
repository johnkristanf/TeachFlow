import { auth } from '@/auth'

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')

    const publicRoutes = ['/', '/pricing', '/contact-us']
    const protectedRoutes = ['/essays', '/classes', '/feedback', '/rubrics', '/quiz/generator'] // add more as needed

    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
    const isPublicRoute = publicRoutes.some((route) => req.nextUrl.pathname === route)

    // ✅ Redirect logged-in users away from auth pages & public routes like landing
    if (isLoggedIn && (isAuthPage || isPublicRoute)) {
        return Response.redirect(new URL('/essays', req.nextUrl))
    }

    // Redirect non-logged-in users to sign-in page for protected routes
    if (!isLoggedIn && isProtectedRoute) {
        return Response.redirect(new URL('/auth/signin', req.nextUrl))
    }
})

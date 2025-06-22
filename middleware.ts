import { auth } from '@/auth'

export default auth((req) => {
    // req.auth contains the session

    console.log("session req: ", req);
    
    const isLoggedIn = !!req.auth
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isProtectedRoute = req.nextUrl.pathname.startsWith('/essays')

    // Redirect logged-in users away from auth pages
    if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/essays', req.nextUrl))
    }

    // Redirect non-logged-in users to sign-in page for protected routes
    if (!isLoggedIn && isProtectedRoute) {
        return Response.redirect(new URL('/auth/signin', req.nextUrl))
    }
})

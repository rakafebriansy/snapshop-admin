import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl
    const sessionToken = request.cookies.get("next-auth.session-token");

    if (!sessionToken && pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    else if (sessionToken && pathname == '/login') {
        return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
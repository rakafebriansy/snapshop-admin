import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get('auth-token');

    if (!token && pathname !== '/') {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (token && req.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/((?!$).*)',
}
import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req: NextRequest) {
    if (
        req.nextUrl.pathname.startsWith('/_next') ||
        req.nextUrl.pathname.includes('/api/') ||
        PUBLIC_FILE.test(req.nextUrl.pathname)
    ) {
        return
    }

    const locale = req.cookies.get('NEXT_LOCALE') || DEFAULT_LOCALE;
    if (req.nextUrl.locale === 'default' || req.nextUrl.locale !== locale) {
        if(locale === DEFAULT_LOCALE && req.nextUrl.locale !== locale) {
            return NextResponse.redirect(
                new URL(`${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
            )
        }
        return NextResponse.redirect(
            new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
        )
    }
}
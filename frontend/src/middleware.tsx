import React from 'react'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { server } from './config/config'

export async function middleware(req: NextRequest) {
    const url = req.nextUrl
    const res = NextResponse.next();
    function cookiesParse() {
        const getCookies = req.cookies.getAll()
        let cookies = ''
        getCookies.map(cook => {
            cookies += cook.name + '='
            cookies += cook.value + ';'
        })
        return cookies
    }
    if (url.pathname.startsWith('/admin')) {
        const cookies = cookiesParse()
        const res = await fetch(`${server}/admin/isAdmin`, {
            method: 'get',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': `${server}`,
                Domain: `${server}`,
                Cookie: cookies
            },
            credentials: 'include',
        })
        if (res.status !== 200) {
            url.pathname = '/'
            const response = NextResponse.redirect(url)
            return response
        }
    } else if (req.cookies.has("cart")) {
        return res;
    } else {
        const cookies = cookiesParse()
        const getCart = await fetch(`${server}/cart/getIdCart`, {
            method: 'get',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': `${server}`,
                Domain: `${server}`,
                Cookie: cookies
            },
            credentials: 'include',
        })
        const data = await getCart.json()
        const response = NextResponse.redirect(url)
        response.cookies.set("cart", data.cart, { httpOnly: true });
        return response
    }
}

export const config = {
    matcher: [`/((?!api|_next/static|_next/image|favicon.svg|favicon.ico).*)`,],
}
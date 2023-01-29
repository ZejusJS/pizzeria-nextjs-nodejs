import React from 'react'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import axios from 'axios'
import { server } from './config/config'

export async function middleware(req: NextRequest) {
    const url = req.nextUrl
    const res = NextResponse.next();
    // console.log('MW... ', cookies)
    if (req.cookies.has("cart")) {
        return res;
    } else {
        const getCookies = req.cookies.getAll()
        let cookies = ''
        getCookies.map(cook => {
            cookies += cook.name + '='
            cookies += cook.value + ';'
        })
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
        // console.log(data)
        const response = NextResponse.redirect(url)
        response.cookies.set("cart", data.cart);
        return response
    }
}

export const config = {
    matcher: [`/((?!api|_next/static|_next/image|favicon.svg|favicon.ico).*)`,],
}
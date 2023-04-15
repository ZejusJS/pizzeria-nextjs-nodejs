import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { server } from './config/config'

let counter = 0;
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
    // counter++;
    // console.log('-------------')
    // console.log("middleware #", counter);
    // // console.log(url.pathname.startsWith('/admin'))
    // console.log(url.pathname)
    // console.log(req.headers.get('purpose'))
    // console.log(req.headers.get('x-middleware-prefetch'))
    // console.log(req.headers.get('x-nextjs-data'))
    // console.log('-------------')

    // if (url.pathname.includes('/user/get-order')) {
    //     url.pathname = '/user/profile/orders'
    //     console.log(url)
    //     const response = NextResponse.rewrite(url)
    //     return response
    // }

    if (url.pathname.startsWith('/admin') && req.headers.get('purpose') !== 'prefetch') {
        console.log('!!!!!!! admin middleware')
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
            const response = NextResponse.rewrite(url)
            return response
        }
    }

    if (!req.cookies.has("cart") && !(req?.cookies?.get('cart')?.value === 'error')) {
        console.log(req.cookies.get('cart'))
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
        if (getCart.status === 200) {
            const response = NextResponse.rewrite(url)
            response.cookies.set("cart", data.cart, { httpOnly: true })
            return response
        } else {
            const response = NextResponse.rewrite(url)
            response.cookies.set("cart", 'error', { maxAge: 10 })
            return response
        }
    }
}

export const config = {
    matcher: [`/((?!api|api2|_next/data|_next/static|_next/image|favicon.svg|favicon.ico).*)`,],
}
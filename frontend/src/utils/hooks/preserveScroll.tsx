import { NextRouter, useRouter } from "next/router"
import { useEffect, useRef } from "react"

export const usePreserveScroll = (scrollPositions) => {
    const router: NextRouter = useRouter()

    const isBack = useRef(false)

    useEffect(() => {
        router.beforePopState(() => {
            isBack.current = true
            return true
        })

        const onRouteChangeStart = () => {
            const url = router.asPath
            scrollPositions.current[url] = window.scrollY
        }

        const onRouteChangeComplete = (url: any) => {
            if (isBack.current && scrollPositions.current[url]) {
                window.scroll({
                    top: scrollPositions.current[url],
                    behavior: "auto",
                })
            }

            isBack.current = false
        }

        router.events.on("routeChangeStart", onRouteChangeStart)
        router.events.on("routeChangeComplete", onRouteChangeComplete)

        return () => {
            router.events.off("routeChangeStart", onRouteChangeStart)
            router.events.off("routeChangeComplete", onRouteChangeComplete)
        }
    }, [router])
}
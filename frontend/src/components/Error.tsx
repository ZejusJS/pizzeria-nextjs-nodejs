// @ts-nocheck

import React from "react"
import ErrorSvg from '../images/Error'
import Link from 'next/link'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)

        // Define a state variable to track whether is an error or not
        this.state = { hasError: false }
    }
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI

        return { hasError: true }
    }
    componentDidCatch(error, errorInfo) {
        // You can use your own error logging service here
        console.log({ error, errorInfo })
    }
    render() {
        // Check if the error is thrown
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <main className="error-boundary-con">
                    <ErrorSvg />
                    <h3>Unexpected error occurred</h3>
                    <button
                        type="button"
                        className="btn-styled try-again"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Try again?
                    </button>
                    <Link className='home-page' href='/' shallow={false} prefetch={false}>
                        Go to Home Page
                    </Link>
                </main>
            )
        }

        // Return children components in case of no error

        return this.props.children
    }
}

export default ErrorBoundary
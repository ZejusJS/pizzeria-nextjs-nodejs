import NotFoundSvg from '../images/NotFound'
import ErrorSvg from '../images/Error'
import Link from 'next/link'

function Error({ statusCode }) {
    return (
        <div>
            {
                statusCode === 404 ?
                    <section className='error-page not-found'>
                        <NotFoundSvg />
                        <h3>Page was not found</h3>
                        <Link className='back' href='/' shallow={false} prefetch={false}>
                            Go to Homepage
                        </Link>
                    </section>
                    :
                    <section className='error-page'>
                        <ErrorSvg />
                        <h3>Something went wrong</h3>
                        <h4>Code: <span>{statusCode}</span></h4>
                        <Link className='back' href='/' shallow={false} prefetch={false}>
                            Go to Home Page
                        </Link>
                    </section>
            }
        </div>
    )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error
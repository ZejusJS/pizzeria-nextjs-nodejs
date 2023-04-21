import Head from 'next/head'

const Meta = ({ title, keywords, description }) => {
    return (
        <Head>
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <meta name='keywords' content={keywords} />
            <meta name="description" content={description} />
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

            <meta name="twitter:card" content="summary" />
            <meta property="twitter:domain" content="pizzeria-mammamia.netlify.app" />
            <meta property="twitter:image" content="/favicon.svg" />
            <meta property='twitter:title' content={`${title}`} />
            <meta property='twitter:description' content={`${description}`} />
            
            <meta property="og:type" content="restaurant" />
            <meta property="og:image" content="/favicon.svg" />
            <meta property="og:description" content={`${description}`} />
            <meta property="og:title" content={`${title}`} />

            <meta charSet='utf-8' />
            <title>{title}</title>
        </Head>
    )
}

Meta.defaultProps = {
    title: 'Pizzeria Mamma Mia',
    keywords: 'food, pizza, tomatoes, Czech Republic, menu, delivery, online',
    description: 'One of the biggest pizzerias in the Czech Republic. We deliver to every corner of Czech Republic.'
}

export default Meta
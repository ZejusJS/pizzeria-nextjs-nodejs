import Head from 'next/head'

const Meta = ({ title, keywords, description }) => {
    return (
        <Head>
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <meta name='keywords' content={keywords} />
            <meta name="description" content={description} />
            <link rel="icon" href="/favicon.svg" />
            <meta charSet='utf-8' />
            <title>{title}</title>
        </Head>
    )
}

Meta.defaultProps = {
    title: 'Pizzeria Mamma Mia',
    keywords: 'food, pizza, tomatoes',
    description: 'The most delicious pizza in CZ.'
}

export default Meta
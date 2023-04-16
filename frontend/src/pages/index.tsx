import Carousel from 'react-bootstrap/Carousel';
import CurvedCorner from '../images/CurvedCorner'
import Link from 'next/link';

const index = () => {
    return (
        <main className="landing-page">
            <div className='hero-panel-con'>
                <div className="hero-con">
                    <div className="logo-con">
                        <CurvedCorner />
                        <div className='logo-deep-con'>
                            <img src="https://res.cloudinary.com/dzxwekkvd/image/upload/v1681643117/landing_page/logo.png" alt="" />
                            <div className='links-con'>
                                <div className='links'>
                                    <Link
                                    href='/menu'
                                    className='menu-link'
                                    >
                                        Menu
                                    </Link>
                                    <Link
                                    href='/phone-order'
                                    className='phone-link'
                                    >
                                        Order by phone
                                    </Link>
                                    <Link
                                    href='/about'
                                    className='about-link'
                                    >
                                        About us
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='carousel-con'>
                        <Carousel fade interval={10000} indicators={false} controls={false} pause={false}>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://res.cloudinary.com/dzxwekkvd/image/upload/v1681638900/landing_page/pizza4-transformed_hbbpob.jpg"
                                    alt="First slide"
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://res.cloudinary.com/dzxwekkvd/image/upload/v1681638070/landing_page/pizza1-transformed_j8lhdw.jpg"
                                    alt="Second slide"
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://res.cloudinary.com/dzxwekkvd/image/upload/v1681639273/landing_page/pizza2-transformed_un3uf9.jpg"
                                    alt="Third slide"
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://res.cloudinary.com/dzxwekkvd/image/upload/v1681639187/landing_page/pizza3-transformed_xpym1g.jpg"
                                    alt="Third slide"
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://res.cloudinary.com/dzxwekkvd/image/upload/v1681639030/landing_page/pizza5-transformed_we4pmd.jpg"
                                    alt="Third slide"
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://res.cloudinary.com/dzxwekkvd/image/upload/v1681639092/landing_page/pizza6-transformed_aymggg.jpg"
                                    alt="Third slide"
                                />
                            </Carousel.Item>
                        </Carousel>
                        <CurvedCorner />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default index
import Carousel from 'react-bootstrap/Carousel';
import CurvedCorner from '../images/CurvedCorner'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

import ArrowRightBasic from '../images/ArrowRightBasic';

const index = () => {
    const [pizzas, setPizzas] = useState([])

    useEffect(() => {
        axios({
            method: 'get',
            url: '/api2/pizza/get-many-number/7',
        })
            .then(res => {
                // console.log(res)
                setPizzas(res.data?.docs)
            })
            .catch(e => {
                console.error(e)
            })
    }, [])

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
                                    src="https://res.cloudinary.com/dzxwekkvd/image/upload/v1681638900/landing_page/pizza4-transformed.jpg"
                                    alt="First slide"
                                    loading='eager'
                                />
                            </Carousel.Item>
                            {
                                pizzas?.length ?
                                    pizzas?.map(pizza => (
                                        pizza?.images[0]?.url ?
                                            <Carousel.Item key={Math.random()}>
                                                <img
                                                    className="d-block w-100"
                                                    src={pizza?.images[0]?.url}
                                                    alt="Third slide"
                                                />
                                            </Carousel.Item>
                                            : ''
                                    ))
                                    : ''
                            }
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://res.cloudinary.com/dzxwekkvd/image/upload/v1681638900/landing_page/pizza1-transformed.jpg"
                                    alt="First slide"
                                    loading='eager'
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://res.cloudinary.com/dzxwekkvd/image/upload/v1681638900/landing_page/pizza2-transformed.jpg"
                                    alt="First slide"
                                    loading='eager'
                                />
                            </Carousel.Item>
                        </Carousel>
                        {pizzas.length ?
                            <div className='pizzas-con'>
                                <div className='pizzas-show'>
                                    <div className='pizzas-slider'>
                                        <div className='pizzas'>
                                            {pizzas.map(pizza => (
                                                <div className='pizza' key={Math.random()}>
                                                    <img src={pizza.images[0].url} alt="" />
                                                    <h3>{pizza.title}</h3>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Link
                                        href='/menu'
                                        className='more-pizzas'
                                        title='Look at our menu'
                                    >
                                        <ArrowRightBasic />
                                        <p>Look at the menu</p>
                                    </Link>
                                </div>
                            </div>
                            :
                            ''
                        }
                        <CurvedCorner />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default index
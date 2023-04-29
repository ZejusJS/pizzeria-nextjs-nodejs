import Link from "next/link"

import PhoneSvg from '../images/Phone'
import PhoneOrderSvg from '../images/PhoneOrder'
import EmailSvg from '../images/Email'
import CzechRepublicMapSvg from '../images/CzechRepublicMap'
import FastVanSvg from '../images/FastVan'
import HatChefSvg from '../images/HatChef'
import ClockSvg from '../images/Clock'
import VisaCardLogoSvg from '../images/VisaCardLogo'
import MasterCardLogoSvg from '../images/MasterCardLogo'

const Footer = () => {
    return (
        <footer>
            <section className="footer-section phone-order">
                <div className="phone-con">
                    <PhoneOrderSvg />
                    <div className="phones">
                        <h5>Order via phone</h5>
                        <p>+420 653 543 533</p>
                    </div>
                </div>
            </section>
            <section className="footer-section features">
                <div className="features-con">
                    <div className="feature delivery-cover">
                        <CzechRepublicMapSvg />
                        <h4>Our delivery covers 70% of CR</h4>
                    </div>
                    <div className="feature fast-delivery">
                        <FastVanSvg />
                        <h4>Fast delivery time, avg. 40 minutes</h4>
                    </div>
                    <div className="feature chefs">
                        <HatChefSvg />
                        <h4>The most precise pizzas chefs</h4>
                    </div>
                    <div className="feature time">
                        <ClockSvg />
                        <h4>Delivery is available at 7am - 22pm</h4>
                    </div>
                </div>
            </section>
            <section className="footer-section map">
                <iframe className="google-map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1811.3096402695842!2d14.4006284232914!3d50.05672378874986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b94467131a245%3A0x2f39d47cfee477ac!2zSyBaw6F2xJtyY2UgMjQ3MS8xNywgMTUwIDAwIFByYWhhIDUtU23DrWNob3Y!5e0!3m2!1scs!2scz!4v1682775164906!5m2!1scs!2scz" allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                </iframe>
            </section>
            <section className="footer-section payment-methods">
                <div className="payment-methods-con">
                    <h5>Payment Methods</h5>
                    <div className="methods">
                        <VisaCardLogoSvg />
                        <MasterCardLogoSvg />
                    </div>
                </div>
            </section>
            <section className="footer-section links">
                <div className="links-con">
                    <div>
                        <h5>Legal Information</h5>
                        <Link href={'/terms'}>
                            Terms and Conditions
                        </Link>
                    </div>
                    <div>
                        <h5>Contact</h5>
                        <Link href={'/contact'}>
                            Contact us
                        </Link>
                    </div>
                </div>
            </section>
            <section className="footer-section logo-section">
                <img className="logo" src="https://res.cloudinary.com/dzxwekkvd/image/upload/v1681643117/landing_page/logo.png" alt="logo" />
            </section>
        </footer>
    )
}

export default Footer
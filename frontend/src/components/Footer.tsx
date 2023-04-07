import Link from "next/link"

import PhoneSvg from '../images/Phone'
import PhoneOrderSvg from '../images/PhoneOrder'
import EmailSvg from '../images/Email'

const Footer = () => {
    return (
        <footer>
            <div className="columns-con">
                <div className="links column">
                    <Link href='/' prefetch={false}>
                        Home page
                    </Link>
                    <Link href='/about' prefetch={false}>
                        About
                    </Link>
                    <Link href='/cart' prefetch={false}>
                        Cart
                    </Link>
                </div>
                <div className="order-phone column">
                    <h4>Order via phone</h4>
                    <div className="phone-con">
                        <PhoneOrderSvg />
                        <p>636 354 275</p>
                    </div>
                </div>
                <div className="info column">
                    <div>
                        <h4>Contacts</h4>
                        <ul>
                            <li><p><PhoneSvg /> 506 254 675</p></li>
                            <li><p><EmailSvg /> contact@mamma.mia</p></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
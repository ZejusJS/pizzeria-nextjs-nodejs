import Pizza from "./Pizza";
import Link from "next/link";

const Pizzalist = ({ pizzas }) => {
    return (
        <>
            <section className="pizzas-showcase">
                {pizzas.map(pizza => {
                    console.log(pizza)
                    return <Pizza pizza={pizza} key={pizza.key} />
                })}
            </section>
            <Link href='/about'>
                About
            </Link>
        </>
    )
}

export default Pizzalist
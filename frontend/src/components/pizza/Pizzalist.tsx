import Pizza from "./Pizza";
import Link from "next/link";
import { Key } from "react";

const Pizzalist = ({ pizzas, updtCart }) => {
    return (
        <>
            <section className="pizzas-showcase">
                {pizzas.map((pizza: { key: Key }) => {
                    // console.log(pizza)
                    return <Pizza updtCart={updtCart} pizza={pizza} key={pizza.key} />
                })}
            </section>
        </>
    )
}

export default Pizzalist
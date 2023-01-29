import Pizza from "./Pizza";
import Link from "next/link";
import { Key } from "react";

const Pizzalist = ({ pizzas, updtCart, viewItem }) => {
    return (
        <>
            <section className="pizzas-showcase">
                {pizzas.map((pizza: { key: Key }) => {
                    // console.log(pizza)
                    return <Pizza 
                    updtCart={(e) => updtCart(e)} 
                    pizza={pizza} 
                    key={pizza.key}
                    viewItem={(e, piz) => viewItem(e, piz)} 
                    />
                })}
            </section>
        </>
    )
}

export default Pizzalist
import Pizza from "./Pizza";
import Link from "next/link";
import { Key } from "react";

const Pizzalist = ({ pizzas, singleAdd, viewItem, cart }) => {
    return (
        <>
            <section className="pizzas-showcase">
                {pizzas.map((pizza: { key: Key }) => {
                    // console.log(pizza)
                    return <Pizza 
                    cart={cart}
                    singleAdd={(e) => singleAdd(e)} 
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
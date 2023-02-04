import Pizza from "./Pizza";
import Link from "next/link";
import { Key } from "react";

const Pizzalist = ({ pizzas, singleAdd, viewItem, cart }) => {
    return (
        <>
            <section className="pizzas-showcase">
                {pizzas.map((pizza: {
                    _id: Key
                }) => {
                    return <Pizza
                        cart={cart}
                        singleAdd={(e) => singleAdd(e)}
                        pizza={pizza}
                        key={pizza._id}
                        viewItem={(e, piz) => viewItem(e, piz)}
                    />
                })}
            </section>
        </>
    )
}

export default Pizzalist
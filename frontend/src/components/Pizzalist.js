import Pizza from "./Pizza";

const Pizzalist = ({ pizzas }) => {
    return (
        <section>
            {
                pizzas.map(pizza => {
                    console.log(pizza)
                    return <Pizza pizza={pizza} key={pizza.key} />
                })
            }
        </section>
    )
}

export default Pizzalist
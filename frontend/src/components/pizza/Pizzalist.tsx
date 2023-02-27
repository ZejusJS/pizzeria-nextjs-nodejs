import Pizza from "./Pizza";
import { Key, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Pizzalist = ({ pizzas, setPizzas, singleAdd, viewItem, cart,router }) => {
    const [ingrs, setIngrs] = useState([])
    const [selectedIngrs, setSelectedIngrs] = useState([])

    useEffect(() => {
        axios({
            method: 'get',
            url: `api/pizza/all-ingredients`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })
            .then(res => setIngrs(res.data))
            .catch(e => '')
    }, [null])

    function changeIngrs(e) {
        const { name, value } = e.target
        setSelectedIngrs(prevIngrs => {
            const findIngr = prevIngrs.filter(ingr => ingr === value)
            if (findIngr[0]) {
                return prevIngrs.filter(ingr => ingr !== value)
            }
            return [
                ...prevIngrs,
                value
            ]
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        let data = {}
        await axios({
            method: 'get',
            url: `api/pizza/all`,
            // url: `api/pizza/all`,
            headers: {
                "Content-Type": "application/json"
            },
            params: {
                ingredients: selectedIngrs.toString()
            }
        })
            .then(res => data = res.data)
            .catch(e => '')

        console.log(data)
        setPizzas(data)
    }

    return (
        <>
            <div className="sort">
                <form onSubmit={handleSubmit}>
                    <div>
                        <h3>
                            Ingredients:
                        </h3>
                        <div className="ingrs-sort">
                            {
                                ingrs.map(ingr => {
                                    return (
                                        <>
                                            <div className="ingr-pick">
                                                <input
                                                    type="checkbox"
                                                    id={'ingr-' + ingr.name}
                                                    value={ingr.name}
                                                    checked={selectedIngrs.filter(selIngr => selIngr === ingr.name).length ? true : false}
                                                    onChange={changeIngrs}
                                                />
                                                <label
                                                    htmlFor={'ingr-' + ingr.name}
                                                >
                                                    {ingr.name}
                                                </label>
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                        >
                            Sort
                        </button>
                    </div>
                </form>
            </div>
            <section className="pizzas-showcase">
                {pizzas?.map((pizza: {
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
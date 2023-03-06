import Pizza from "./Pizza";
import { Key, useEffect, useState } from "react";
import axios from "axios";
import Ingredients from "./Ingredients";
import SearchSvg from '../../images/Search'
import SettingsSvg from '../../images/Settings'
import CheckedTickSvg from '../../images/CheckedTick'
import NProgress from 'nprogress'

const Pizzalist = ({ pizzas, setPizzas, singleAdd, viewItem, cart, router }) => {
    const [ingrs, setIngrs] = useState([])
    const [selectedIngrs, setSelectedIngrs] = useState([])
    const [viewSort, setViewSort] = useState(false)
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (!ingrs.length && viewSort) {
            axios({
                method: 'get',
                url: `api/pizza/all-ingredients`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })
                .then(res => setIngrs(res.data))
                .catch(e => '')
        }
    }, [viewSort])

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

    function changeSearch(e) {
        const { name, value } = e.target
        setSearch(prevSearch => value)
    }

    async function handleSubmit(e) {
        e.preventDefault()

        let data = {}
        NProgress.start()
        await axios({
            method: 'get',
            url: `api/pizza/all`,
            // url: `api/pizza/all`,
            headers: {
                "Content-Type": "application/json"
            },
            params: {
                ingredients: selectedIngrs.toString(),
                q: search
            },
        })
            .then(res => {
                data = res.data
                NProgress.done(false)
            })
            .catch(e => NProgress.done(false))

        console.log(data)
        setPizzas(data)
    }

    return (
        <>
            <div className="sort">
                <form onSubmit={handleSubmit}>
                    <div className="searching-con">
                        <div className="search-container">
                            <input
                                type="text"
                                className="search"
                                placeholder="Search"
                                value={search}
                                onChange={changeSearch}
                            />
                            <button
                                type="submit"
                                className='btn-styled submit search'
                            >
                                <SearchSvg />
                            </button>
                        </div>
                        <div className="btns-con">
                            <button
                                onClick={(e) => setViewSort(prev => !prev)}
                                className='btn-styled filter'
                                type="button">
                                <SettingsSvg /> <span>Filter</span></button>
                            <button
                                onClick={() => setSelectedIngrs([])}
                                className='btn-styled filter-clear'
                                type="submit"
                                style={selectedIngrs.length ? { display: '' } : { display: 'none' }}
                            >
                                <span>&#9587; </span> <div>Clear</div>
                            </button>
                        </div>
                    </div>
                    <div className={`sort-checks ${viewSort ? 'visible' : ''}`}>
                        <h3>
                            Ingredients:
                        </h3>
                        {
                            ingrs.length ?
                                <div className="sorting-con">
                                    <div className="ingrs-sort">
                                        <Ingredients
                                            ingrs={ingrs}
                                            changeIngrs={changeIngrs}
                                            selectedIngrs={selectedIngrs}
                                            setIngrs={setIngrs}
                                        />
                                    </div>
                                    <div className="btns-filter-con">
                                        <button
                                            onClick={() => setSelectedIngrs([])}
                                            className='btn-styled filter-clear'
                                            type="submit"
                                            style={selectedIngrs.length ? { display: '' } : { display: 'none' }}
                                        >
                                            <span>&#9587; </span> <div>Clear</div>
                                        </button>
                                        <button
                                            type="submit"
                                            className='btn-styled submit-filter'
                                        >
                                            <CheckedTickSvg /> <span>Find</span>
                                        </button>
                                    </div>
                                </div>
                                :
                                <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                </div>
                        }
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
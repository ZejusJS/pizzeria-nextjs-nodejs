import Pizza from "./Pizza";
import { Key, useEffect, useState } from "react";
import axios from "axios";
import Ingredients from "./Ingredients";
import SearchSvg from '../../images/Search'
import SettingsSvg from '../../images/Settings'
import CheckedTickSvg from '../../images/CheckedTick'
import NoPizzasSvg from '../../images/NoPizzas'
import NProgress from 'nprogress'
import { useRouter } from "next/router";
import { server } from '../../config/config'

const Pizzalist = ({ pizzas, setPizzas, singleAdd, viewItem, cart, router }) => {

    const [ingrs, setIngrs] = useState([])
    const [selectedIngrs, setSelectedIngrs] = useState([])
    const [viewSort, setViewSort] = useState(false)
    const [search, setSearch] = useState(router.query.q || '')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!ingrs.length && viewSort) {
            axios({
                method: 'get',
                url: `${server}/pizza/all-ingredients`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })
                .then(res => setIngrs(res.data))
                .catch(e => '')
        }
    }, [viewSort])

    useEffect(() => {
        const arrayIngrs = router?.query?.ingredients?.toString().split(',')
        if (arrayIngrs && arrayIngrs[0]?.length > 0) {
            setSelectedIngrs(prevIngrs => {
                return arrayIngrs
            })
        }
    }, [])

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
        e?.preventDefault()

        await router.replace({
            pathname: router.pathname,
            query: { ...router.query, q: search, ingredients: selectedIngrs.toString() }
        }, '', { shallow: true })

        NProgress.start()
    }

    useEffect(() => {

        NProgress.start()

        setSearch(router.query.q || '')
        const arrayIngrs = router?.query?.ingredients?.toString().split(',')
        if (arrayIngrs && arrayIngrs[0]?.length > 0) {
            setSelectedIngrs(prevIngrs => {
                return arrayIngrs
            })
        } else {
            setSelectedIngrs([])
        }
        console.log('query:.... ', router.query)
        setLoading(true)
        let data = {}
        axios({
            method: 'get',
            url: `${server}/pizza/all`,
            headers: {
                "Content-Type": "application/json",
            },
            params: {
                ingredients: router?.query?.ingredients,
                q: router?.query?.q
            }
        })
            .then(res => {
                data = res.data
                NProgress.done(false)
                setPizzas(data)
                setLoading(false)
            })
            .catch(e => NProgress.done(false))
    }, [router.query])

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
            {
                pizzas?.length || loading ?
                    <>
                        <div className="pizzas-con">

                            <div className={`spinner-pizza-con ${loading ? 'loading' : ''}`}>
                                <div className="loading-con">
                                    <div className={`spinner-border`} role="status">
                                    </div>
                                </div>
                            </div>

                            <section
                                className={`pizzas-showcase ${loading ? 'loading' : ''}`}>
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
                        </div>
                    </>
                    :
                    <div className={`pizzas-not-found ${loading ? 'loading' : ''}`}>
                        <NoPizzasSvg />
                        <p>No pizzas found <span>:(</span></p>
                        <p>Try different ingredients or keywords in search.</p>
                    </div>
            }
        </>
    )
}

export default Pizzalist
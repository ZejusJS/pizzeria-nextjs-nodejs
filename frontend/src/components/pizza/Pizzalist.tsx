import Pizza from "./Pizza";
import { Key, useEffect, useRef, useState } from "react";
import axios from "axios";
import Ingredients from "./Ingredients";
import Spinner from "../Spinner";

import SearchSvg from '../../images/Search'
import SettingsSvg from '../../images/Settings'
import CheckedTickSvg from '../../images/CheckedTick'
import NoPizzasSvg from '../../images/NoPizzas'
import ArrowSvg from '../../images/ArrowRight'

import { server } from '../../config/config'

const Pizzalist = ({ pizzas, setPizzas, singleAdd, viewItem, cart, router, deleteItem }) => {

    const [ingrs, setIngrs] = useState([])
    const [selectedIngrs, setSelectedIngrs] = useState([])
    const [viewSort, setViewSort] = useState(false)
    const [search, setSearch] = useState(router.query.q || '')
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        if (!ingrs.length && viewSort) {
            axios({
                method: 'get',
                url: `${server}/pizza/all-ingredients`
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

        // NProgress.start()
    }

    const isFirstRun = useRef(true)

    useEffect(() => {
        setSearch(router.query.q || '')
        const arrayIngrs = router?.query?.ingredients?.toString().split(',')
        if (arrayIngrs && arrayIngrs[0]?.length > 0) {
            setSelectedIngrs(prevIngrs => {
                return arrayIngrs
            })
        } else {
            setSelectedIngrs([])
        }

        console.log(isFirstRun.current)
        setLoading(false)
        if (isFirstRun.current && pizzas.length > 0) {
            isFirstRun.current = false;
            setLoading(false)
            return;
        }

        // NProgress.start()

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
                // NProgress.done(false)
                setPizzas(data)
                setLoading(false)
                // console.log(res.data)
            })
            .catch(e => {
                // NProgress.done(false)
                console.error(e)
            })
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
                                title="product searching"
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
                        <div className="sort-checks-con">
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
                                    <Spinner />
                            }
                        </div>
                    </div>
                </form>
            </div>
            {
                pizzas?.length || loading ?
                    <>
                        <div className="pizzas-con">

                            <div className={`spinner-con ${loading ? 'loading' : ''}`}>
                                <div className="loading-con">
                                    <div className={`spinner-border`} role="status">
                                    </div>
                                </div>
                            </div>

                            <section
                                className={`pizzas-showcase ${pizzas.length > 20 && !showMore ? 'part-hidden' : ''} ${loading ? 'loading' : ''}`}>
                                {pizzas?.map((pizza: {
                                    _id: Key
                                }) => {
                                    return <Pizza
                                        cart={cart}
                                        singleAdd={(e) => singleAdd(e, pizza)}
                                        pizza={pizza}
                                        key={pizza._id}
                                        viewItem={(e, piz) => viewItem(e, piz)}
                                        deleteItem={(e) => deleteItem(e, pizza)}
                                        Spinner={Spinner}
                                    />
                                })}
                            </section>
                            {
                                pizzas.length > 20 && !showMore ?
                                    <>
                                        <div className="show-more-con">
                                            <button
                                                onClick={() => setShowMore(true)}
                                                className="show-more-button btn-styled"
                                            >
                                                <ArrowSvg /><span>Show more</span><ArrowSvg />
                                            </button>
                                        </div>
                                    </>
                                    : ''
                            }
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
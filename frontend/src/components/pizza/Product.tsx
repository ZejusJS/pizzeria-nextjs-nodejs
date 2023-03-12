import React, { useState, useEffect } from 'react'
import CartAdd from '../../images/CartAdd'
import CartRemove from '../../images/CartRemove'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Product = ({ item, singleAdd, cart, deleteItem, onClick, user }) => {
    const [isInCart, setIsInCart] = useState(false)
    let ingredients = ''
    item.ingredients.map(ingr => {
        ingredients += ingr + ', '
    })
    if (ingredients.length > 2) ingredients = ingredients.slice(-0, -2)

    const router = useRouter()

    useEffect(() => {
        // console.log('JOULOUUUUU ',cart)
        setIsInCart(() => {
            let isItemInCart = false
            cart.items.map(it => {
                // console.log(it.item._id, item._id)
                if (it?.item?._id === item?._id) isItemInCart = true
            })
            return isItemInCart
        }
        )
    }, [cart])

    async function deletePizza(e) {
        e.stopPropagation()

        const answer = confirm(`Do you really want to delete pizza "${item.title}"?`)
        switch (answer) {
            case true:
                await axios({
                    method: 'delete',
                    url: `/api/admin/pizza/${item._id}`,
                    withCredentials: true
                })
                    .then(res => {
                        router.replace(router.asPath, '', { shallow: false })
                    })
                    .catch(e => console.error(e))
        }
    }

    return (
        <div id='view-product' onClick={(e) => onClick(e)}>
            <div
                className='cross'
                onClick={(e) => onClick(e)}
            >
                &#9587;
            </div>
            <div className='product-center'>
                <div className='pizza-img-container' onClick={(e) => e.stopPropagation()}>
                    <img src={item.images[0].url} alt="" />
                </div>
                <div className='info-container'>
                    <div className='pizza-thumbnail' onClick={(e) => e.stopPropagation()}>
                        <div className='pizza-info'>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                        <hr />
                        <div>
                            {item.ingredients.length ?
                                <div className='ingredients' key="fd">
                                    {ingredients}
                                </div>
                                : ''}
                        </div>
                    </div>
                    {user?.roles?.admin ?
                        <div className='admin-board'>
                            <button
                                type='button'
                                className='btn-styled danger delete'
                                onClick={deletePizza}>
                                Delete product
                            </button>
                            <Link
                                href={`/admin/edit-pizza/${item._id}`}
                                className='btn-styled cyan edit'
                            >
                                Edit Product
                            </Link>
                        </div>
                        : ''}
                    <div className='cart-price-container'>
                        <div className='price fw-500' onClick={(e) => e.stopPropagation()}>
                            {item.price} {item.currency}
                        </div>
                        <div className='add-to-cart-container'>
                            <Button
                                pizza={item}
                                onClick={
                                    isInCart ? (e, piz) => deleteItem(e, piz) : (e, piz) => singleAdd(e, piz)
                                }
                            >
                                <>
                                    {
                                        isInCart ?
                                            <>
                                                <CartRemove color={'#00c216'} />
                                                <span>In Cart</span>
                                            </>
                                            :
                                            <>
                                                <CartAdd />
                                                <span>Add to Cart</span>
                                            </>

                                    }
                                    <div className='spinner-container'>
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden"></span>
                                        </div>
                                    </div>
                                </>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Button = ({ onClick, children, pizza }) => {
    return (
        <button className="add-to-cart" type="button" onClick={(e) => onClick(e, pizza)}>
            {children}
        </button>
    );
};

export default Product
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import IngrItem from './IngrItem'
import CartAdd from '../../images/CartAdd'
import CartRemove from '../../images/CartRemove'

const Product = ({ item, singleAdd, cart, deleteItem, onClick }) => {
    const [isInCart, setIsInCart] = useState(false)
    let ingredients = ''
    item.ingredients.map(ingr => {
        ingredients += ingr + ', '
    })
    if (ingredients.length > 2) ingredients = ingredients.slice(-0, -2)

    useEffect(() => {
        // console.log('JOULOUUUUU ',cart)
        setIsInCart(() => {
            let isItemInCart = false
            cart.items.map(it => {
                // console.log(it.item._id, item._id)
                if (it.item._id === item._id) isItemInCart = true
            })
            return isItemInCart
        }
        )
    }, [cart])

    return (
        <div id='view-product' onClick={(e) => onClick(e)}>
            <div className='product-center'>
                <div className='pizza-img-container' onClick={(e) => e.stopPropagation()}>
                    <img src={item.images[0].url} alt="" />
                </div>
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
                <div className='price fw-500' onClick={(e) => e.stopPropagation()}>
                    {item.price} {item.currency}
                </div>
                <div className='add-to-cart-container'>
                    <Button
                        pizza={item}
                        onClick={
                            isInCart ? (e, piz) => deleteItem(e, piz) : (e, piz) => singleAdd(e, piz)
                        }
                        isInCart={isInCart}
                    >
                        {
                            isInCart ? 
                            <CartRemove color={'#00c216'} /> 
                            : 
                            <CartAdd />
                        }
                    </Button>
                </div>
            </div>
        </div>
    )
}

const Button = ({ onClick, children, pizza, isInCart }) => {
    return (
        <button className="add-to-cart" type="button" onClick={(e) => onClick(e, pizza)}>
            {children}
        </button>
    );
};

export default Product
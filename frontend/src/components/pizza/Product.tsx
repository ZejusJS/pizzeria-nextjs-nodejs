import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import IngrItem from './IngrItem'
import CartAdd from '../../images/CartAdd'
import CartRemove from '../../images/CartRemove'

const Product = ({ item, updateCart, cart, deleteItem }) => {
    const [isInCart, setIsInCart] = useState(false)
    let ingredients = ''
    item.ingredients.map(ingr => {
        ingredients += ingr + ', '
    })
    if (ingredients.length > 2) ingredients = ingredients.slice(-0, -2)

    useEffect(()=> {
        console.log('JOULOUUUUU ',cart)
        setIsInCart(() => {
            let isItemInCart = false
            cart.items.map(it => {
                console.log(it.item._id, item._id)
                if (it.item._id === item._id) isItemInCart = true
            })
            return isItemInCart
        }
        )
        console.log('lllllllllllllllllllllllllllllllllllll')
    }, [cart])
    console.log('xddddddddddddddddddddddd')

    return (
        <div className='view-product'>
            <div className='product-center'>
                <div className='pizza-img-container'>
                    <img src={item.images[0].url} alt="" />
                </div>
                <div className='pizza-thumbnail'>
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
                <div className='add-to-cart-container'>
                    <Button
                        pizza={item}
                        onClick={
                            isInCart ? (e,piz) => deleteItem(e,piz) : (e, piz) => updateCart(e, piz)
                        }
                        isInCart={isInCart}
                    >
                        {
                            isInCart ? <CartRemove /> : <CartAdd />
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
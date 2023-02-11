import IngrItem from './IngrItem'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import CartRemove from '../../images/CartRemove'

const Pizza = ({ pizza, singleAdd, viewItem, cart }) => {
  const [isInCart, setIsInCart] = useState(false)
  let ingredients = ''
  pizza?.ingredients?.map(ingr => {
    ingredients += ingr + ', '
  })
  ingredients = ingredients.slice(-0, -2)

  useEffect(() => {
    // console.log('JOULOUUUUU ',cart)
    setIsInCart(() => {
      let isItemInCart = false
      cart?.items?.map(it => {
        if (it.item._id === pizza._id) isItemInCart = true
      })
      return isItemInCart
    }
    )
  }, [cart])

  return (
    <div className='pizza-thumbnail index' onClick={(e) => viewItem(e, pizza)}>
      <div className='pizza-thumbnail-info'>
        <div className='pizza-img-container'>
          <img src={pizza.images[0].url} alt="" />
          {isInCart ?
            <>
              <div className='behind-cart'></div>
              <CartRemove color={'#00c216'} />
            </>
            : ''}
        </div>
        <div className='pizza-info'>
          <h3>{pizza.title}</h3>
          {pizza.ingredients.length ?
            <div className='ingredients' key="fd">
              {ingredients}
            </div>
            : ''}
            <div className='price fw-600'>{pizza.price} {pizza.currency}</div>
          <div className='pizza-action'>
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>
  )
}

const Button = ({ onClick, children, pizza }) => {
  return (
    <button className="add-to-cart" data-id={pizza._id} type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export default Pizza
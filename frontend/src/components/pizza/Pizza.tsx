import { useState, useEffect } from 'react';
import CartRemoveSvg from '../../images/CartRemove'
import CartAddSvg from '../../images/CartAdd'

const Pizza = ({ pizza, singleAdd, deleteItem, viewItem, cart, Spinner }) => {
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
        if (it?.item?._id === pizza._id) isItemInCart = true
      })
      return isItemInCart
    }
    )
  }, [cart])

  async function addToCart(e) {
    e?.currentTarget?.classList.add('loading')
    await singleAdd(e)
    e?.currentTarget?.classList.remove('loading')
  }

  async function RemoveFromCart(e) {
    e?.currentTarget?.classList.add('loading')
    await deleteItem(e)
    e?.currentTarget?.classList.remove('loading')
  }

  return (
    <div className='pizza-thumbnail index' onClick={(e) => viewItem(e, pizza)}>
      <div className='pizza-thumbnail-info'>
        <div className='pizza-img-container'>
          <img src={pizza.images[0].url} alt="" loading='lazy' />
          {/* {isInCart ?
            <>
              <div className='behind-cart'></div>
              <CartRemove color={'#059615'} />
            </>
            : ''} */}
        </div>
        <div className='pizza-info'>
          <h3>{pizza.title}</h3>
          {pizza.ingredients.length ?
            <div className='ingredients' key="fd">
              {ingredients}
            </div>
            : ''}
          <div className='pizza-action'>
          </div>
        </div>
      </div>
      <div className='pizza-footer' onClick={e => e.stopPropagation()}>
        <div className='price fw-600'>{pizza.price} {pizza.currency}</div>
        {
          isInCart ?
            <div className='add-cart remove' onClick={e => RemoveFromCart(e)}><CartRemoveSvg />
              <span className='text'>In cart</span>
              <Spinner />
            </div>
            :
            <div className='add-cart add' onClick={e => addToCart(e)}><CartAddSvg />
              <span className='text'>Add to cart</span>
              <Spinner />
            </div>
        }
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
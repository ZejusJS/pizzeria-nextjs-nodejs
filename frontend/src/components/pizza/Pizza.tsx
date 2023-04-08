import { useState, useEffect, useRef } from 'react';
import CartRemoveSvg from '../../images/CartRemove'
import CartAddSvg from '../../images/CartAdd'
import MoreInfoSvg from '../../images/MoreInfo'

const Pizza = ({ pizza, singleAdd, deleteItem, viewItem, cart, Spinner }) => {
  const [isInCart, setIsInCart] = useState(false)
  const [loading, setLoading] = useState(false)
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

  const btnAddToCartRef = useRef(null)

  async function addToCart(e) {
    // btnAddToCartRef?.current?.classList.add('loading')
    btnAddToCartRef.current.disabled = true
    setLoading(true)
    await singleAdd(e)
    setTimeout(() => {
      // btnAddToCartRef?.current?.classList.remove('add')
      // btnAddToCartRef?.current?.classList.add('remove')
      // btnAddToCartRef?.current?.classList.remove('loading')
      btnAddToCartRef.current.disabled = false
      setLoading(false)
    }, 150);
  }

  async function RemoveFromCart(e) {
    // btnAddToCartRef?.current?.classList.add('loading')
    btnAddToCartRef.current.disabled = true
    setLoading(true)
    await deleteItem(e)
    setTimeout(() => {
      // btnAddToCartRef?.current?.classList.add('add')
      // btnAddToCartRef?.current?.classList.remove('remove')
      // btnAddToCartRef?.current?.classList.remove('loading')
      btnAddToCartRef.current.disabled = false
      setLoading(false)
    }, 150);
  }

  return (
    <div className='pizza-thumbnail index' onClick={(e) => viewItem(e, pizza)}>
      <button className='more-info' onClick={(e) => viewItem(e, pizza)}>
        <MoreInfoSvg />
      </button>
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
          <button
            className={`add-cart ${isInCart ? 'remove' : 'add'} ${loading ? 'loading' : ''}`}
            ref={btnAddToCartRef}
            onClick={e => isInCart ? RemoveFromCart(e) : addToCart(e)}
            type='button'
          >
            <CartAddSvg />
            <span className='text'>{isInCart ? 'In cart' : 'Add to cart'}</span>
            <Spinner />
          </button>
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
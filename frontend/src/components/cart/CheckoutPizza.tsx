import React from 'react'

const CheckoutItem = ({ item, viewItem }) => {
  let ingredients = ''
  item.item.ingredients.map(ingr => {
    ingredients += ingr + ', '
  })
  ingredients = ingredients.slice(-0, -2)

  return (
    <>
      <div className='checkout-item'>
        <div className='image-container'>
          <img src={item.item.images[0].url} alt="" />
        </div>
        <div className='pizza-info'>
          <h3>{item.item.title}</h3>
          {item.item.ingredients.length ?
            (<div className='ingredients' key="fd">
              {ingredients}
            </div>)
            : ''}
        </div>
      </div>
      <hr />
    </>
  )
}

export default CheckoutItem
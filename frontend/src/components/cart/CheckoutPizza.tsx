import React from 'react'

const CheckoutItem = ({ item }) => {
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
          <p><span className='fw-500'>Price:</span> {item.item.price} {item.item.currency}</p>
          <p><span className='fw-500'>Quantity:</span> {item.quantity}</p>
          <p><span className='fw-500'>Total</span>: {item.totalPrice} {item.item.currency}</p>
        </div>
      </div>
      <hr />
    </>
  )
}

export default CheckoutItem
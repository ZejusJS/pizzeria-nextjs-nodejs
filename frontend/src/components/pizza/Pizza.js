import IngrItem from './IngrItem'

const Pizza = ({ pizza }) => {
  return (
    <div className='pizza-thumbnail'>
      <div className='pizza-thumbnail-info'>
        <div>
          <img src={pizza.images[0].url} alt="" />
        </div>
        <div>
          <h3>{pizza.title}</h3>
          <p>{pizza.description}</p>
          <button onClick type='button'>Add to cart</button>
        </div>
      </div>
      <div>
        {pizza.ingredients.length ?
          (<div className='ingredients' key="fd">
            {pizza.ingredients.map(ingr => (
              <IngrItem ingr={ingr} key={Math.random()} />
            )
            )}
          </div>)
          : ''}
      </div>
    </div>
  )
}

export default Pizza
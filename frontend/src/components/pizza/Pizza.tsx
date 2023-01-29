import IngrItem from './IngrItem'

const Pizza = ({ pizza, updtCart }) => {
  return (
    <div className='pizza-thumbnail'>
      <div className='pizza-thumbnail-info'>
        <div>
          <img src={pizza.images[0].url} alt="" />
        </div>
        <div>
          <h3>{pizza.title}</h3>
          <p>{pizza.description}</p>
          <Button pizza={pizza} onClick={updtCart}>Add to cart</Button>
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

const Button = ({ onClick, children, pizza }) => {
  return (
    <button data-id={pizza._id} type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export default Pizza
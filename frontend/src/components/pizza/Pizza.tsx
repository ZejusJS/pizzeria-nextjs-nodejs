import IngrItem from './IngrItem'
import Image from 'next/image';

const Pizza = ({ pizza, updtCart, viewItem }) => {
  let ingredients = ''
  pizza.ingredients.map(ingr => {
      ingredients += ingr + ', '
  })
  ingredients = ingredients.slice(-0, -2)

  return (
    <div className='pizza-thumbnail' onClick={(e) => viewItem(e, pizza)}>
      <div className='pizza-thumbnail-info'>
        <div className='pizza-img-container'>
          <img src={pizza.images[0].url} alt="" />
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
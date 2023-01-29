import React from 'react'
import Image from 'next/image'
import IngrItem from '../pizza/IngrItem'
import Triangle from '../../images/Triangle'

const Item = ({ item, changeQnt }) => {
    let ingredients = ''
    item.item.ingredients.map(ingr => {
        ingredients += ingr + ', '
    })
    ingredients = ingredients.slice(-0, -2)

    return (
        <>
            <div className='pizza-thumbnail cart'>
                <div className='pizza-thumbnail-info cart'>
                    <div className='pizza-img-container'>
                        <img src={item.item.images[0].url} alt="" />
                    </div>
                    <div>
                        <h3>{item.item.title}</h3>
                        <p>{item.item.description}</p>
                    </div>
                    <div className='qnt-change'>
                        <button onClick={(e) => changeQnt(e, item.quantity + 1, item)} className='btn-qnt' type='button'>
                            <Triangle  operation='plus-qnt'/>
                        </button>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => changeQnt(e, 'input', item)}
                            className='qnt-input'
                        />
                        <button onClick={(e) => changeQnt(e, item.quantity - 1, item)} className='btn-qnt' type='button'>
                            <Triangle operation='minus-qnt' />
                        </button>
                    </div>
                </div>
                <div>
                    {item.item.ingredients.length ?
                        (<div className='ingredients' key="fd">
                            {ingredients}
                        </div>)
                        : ''}
                </div>
            </div>
        </>
    )
}

export default Item
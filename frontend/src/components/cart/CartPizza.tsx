import { useRef } from 'react'
import RemoveCartSvg from '../../images/CartDelete'
import Spinner from '../Spinner'

const Item = ({ item, changeQnt, viewItem, deleteItem }) => {
    let ingredients = ''
    item?.item?.ingredients.map(ingr => {
        ingredients += ingr + ', '
    })
    ingredients = ingredients.slice(-0, -2)

    const thumbnailRef = useRef(null)


    function cartDeleteItem(e) {
        thumbnailRef?.current?.classList?.add('deleting')
        deleteItem(e, item.item).then(res => {
            thumbnailRef?.current?.classList?.remove('deleting')
        })
    }

    return (
        <>
            <div className='pizza-thumbnail cart' onClick={(e) => viewItem(e)} ref={thumbnailRef}>
                <div className='loading'>
                    <Spinner />
                </div>
                <div className='pizza-thumbnail-info cart'>
                    <div className='pizza-img-container'>
                        <img src={item?.item?.images[0].url} alt="" />
                    </div>
                    <div className='pizza-info'>
                        <h3>{item?.item?.title}</h3>
                        <div>
                            {item?.item?.ingredients?.length ?
                                (<div className='ingredients' key="fd">
                                    {ingredients}
                                </div>)
                                : ''}
                        </div>
                    </div>
                    <div className='changes-con' onClick={(e) => e.stopPropagation()}>
                        <div className='qnt-change'>
                            <button onClick={(e) => changeQnt(e, item.quantity + 1, item)} className='btn-qnt' type='button'>
                                +
                            </button>
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => changeQnt(e, 'input', item)}
                                className='qnt-input'
                            />
                            <button onClick={(e) => changeQnt(e, item.quantity - 1, item)} className='btn-qnt' type='button'>
                                -
                            </button>
                        </div>
                        <button
                            onClick={(e) => cartDeleteItem(e)}
                            className='remove-item'>
                            <RemoveCartSvg />
                        </button>
                    </div>
                </div>
                <div className='footer-pizza'>
                    {
                        item.quantity > 0 && item.quantity < 16 ?
                            <>
                                <div className='price fw-600'>{item?.item?.price} {item?.item?.currency}</div>
                                <div className='total-price fw-500'>
                                    Total: <span className='c-green fw-600'>{item?.totalPrice} {item?.item?.currency}</span>
                                </div>
                            </> :
                            <div className={`report`}>
                                <div className='report-msg fw-500'>
                                    Please provide quantity 1 to 15
                                </div>
                            </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Item
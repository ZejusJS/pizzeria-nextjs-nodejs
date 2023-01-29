import React from 'react'

const Item = ({ item, addQnt }) => {
    return (
        <>
            <div className='pizza-thumbnail cart'>
                <div className='pizza-thumbnail-info cart'>
                    <div>
                        <img src={item.item.images[0].url} alt="" />
                    </div>
                    <div>
                        <h3>{item.item.title}</h3>
                        <p>{item.item.description}</p>
                        <p>{item.quantity}</p>
                    </div>
                    <button onClick={(e) => addQnt(e, item.quantity + 1, item)}>Add</button>
                </div>
            </div>
        </>
    )
}

export default Item
import React from 'react'

const IngrItem = ({ ingr }) => {
    return (
        <>
            <span className='ingr'>{ingr + ', '}</span>
        </>
    )
}

export default IngrItem
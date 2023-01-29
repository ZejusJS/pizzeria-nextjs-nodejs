import React from 'react'

const IngrItem = ({ ingr }) => {
    return (
        <>
            <span className='ingr'>{ingr}</span>
            <span className='dot'>•</span>
        </>
    )
}

export default IngrItem
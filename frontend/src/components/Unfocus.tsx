import React from 'react'

const Unfocus = ({ onClick }) => {
  return (
    <div className='unfocus' onClick={(e) => onClick(e)}></div>
  )
}

export default Unfocus
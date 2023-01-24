const Pizza = ({ pizza }) => {
  return (
    <div className='pizza-thumbnail'>
      <img src={pizza.images[0].url} alt="" />
      <h3>{pizza.title}</h3>
      <p>{pizza.description}</p>
      <ul>
        <li></li>
      </ul>
    </div>
  )
}

export default Pizza
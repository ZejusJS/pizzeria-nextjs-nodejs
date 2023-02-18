const Shipping = ({ handleShipping, shipping }) => {
    return (
        <form>
            <div className='shipping-pick'>
                <div className='shipping'>
                    <div className='radio-container'>
                        <input
                            type="radio"
                            name='shipping'
                            value='standard'
                            id='standard-ship'
                            className="radio-green"
                            onChange={handleShipping}
                            checked={shipping.name === 'standard' ? true : false}
                        />
                        <label
                            htmlFor="standard-ship"
                            className='radio-label-green'></label>
                    </div>
                    <div>
                        <h4>Standard, 70 CZK</h4>
                        <p>Standard shipping. 40 min. - 70 min.</p>
                    </div>
                </div>
                <div className='shipping'>
                    <div className='radio-container'>
                        <input
                            type="radio"
                            name='shipping'
                            value='fast'
                            id='fast-ship'
                            className="radio-green"
                            onChange={handleShipping}
                            checked={shipping.name === 'fast' ? true : false}
                        />
                        <label
                            htmlFor="fast-ship"
                            className='radio-label-green'></label>
                    </div>
                    <div>
                        <h4>Fast, 90 CZK</h4>
                        <p>Faster shipping. 30 min. - 50 min.</p>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Shipping
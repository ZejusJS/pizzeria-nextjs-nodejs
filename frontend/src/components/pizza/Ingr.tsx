const Ingr = ({ingr, selectedIngrs, changeIngrs}) => {
    return (
        <>
            <div className="ingr-pick">
                <input
                    type="checkbox"
                    id={'ingr-' + ingr.name}
                    value={ingr.name}
                    checked={selectedIngrs.filter(selIngr => selIngr === ingr.name).length ? true : false}
                    onChange={changeIngrs}
                />
                <label
                    htmlFor={'ingr-' + ingr.name}
                >
                    {ingr.name + ' ' + ingr.nums}
                </label>
            </div>
        </>
    )
}

export default Ingr
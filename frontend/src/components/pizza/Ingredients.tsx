import Ingr from "./Ingr"

const Ingredients = ({ingrs, changeIngrs, selectedIngrs, setIngrs}) => {
    
    return ingrs.map(ingr => {
        return (
            <Ingr 
            ingr={ingr}
            selectedIngrs={selectedIngrs}
            changeIngrs={changeIngrs}
            key={ingr.name}
            />
        )
    })
}

export default Ingredients
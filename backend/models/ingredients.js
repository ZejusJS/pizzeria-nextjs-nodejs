const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredientsSchema = Schema({
    allIngredients: {
        type: Array
    }
})

module.exports = mongoose.model('Ingredients', IngredientsSchema);
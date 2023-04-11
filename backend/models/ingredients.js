const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredientsSchema = Schema({
    allIngredients: [
        {
            name: String,
            nums: Number,
            pizzas: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                }
            ]
        }
    ]
})

module.exports = mongoose.model('Ingredients', IngredientsSchema);
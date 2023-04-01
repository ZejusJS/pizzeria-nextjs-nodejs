const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

// const Pizza = require('./pizza')
const Ingredients = require('./ingredients')

const PizzaSchema = new Schema({
    title: {
        type: String
    },
    images: [
        {
            url: {
                type: String
            },
            filename: {
                type: String
            }
        }
    ],
    price: {
        type: Number
    },
    currency: {
        type: String
    },
    description: {
        type: String
    },
    ingredients: [
        {
            type: String
        }
    ],
    show: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

PizzaSchema.plugin(mongoosePaginate)

PizzaSchema.post('save', async function () {
    const Pizza = this.constructor;
    const pizzas = await Pizza.find({ show: true }).exec();
    let ingredients = []
    pizzas.map(pizza => {
        pizza.ingredients.map(ingr => {
            let prevIngrs = ingredients.filter(i => i.name === ingr)
            if (!prevIngrs[0]?.pizzas.filter(prev => prev === pizza._id)?.length) {
                if (prevIngrs.length) {
                    // console.log(prevIngrs) 
                    ingredients = ingredients.filter(i => i.name !== prevIngrs[0].name)
                    ingredients.push({
                        name: ingr,
                        nums: prevIngrs[0].nums + 1,
                        pizzas: [...prevIngrs[0].pizzas, pizza._id]
                    })
                } else {
                    ingredients.push({
                        name: ingr,
                        nums: 1,
                        pizzas: [pizza._id]
                    })
                }
            }
        })
    })
    // console.log(ingredients)
    let ingrs = await Ingredients.findOne()
    if (!ingrs) ingrs = new Ingredients()
    ingrs.allIngredients = ingredients
    await ingrs.save()
});

PizzaSchema.post('findOneAndDelete', async function () {
    const Pizza = this.model;
    const pizzas = await Pizza.find().exec();
    let ingredients = []
    pizzas.map(pizza => {
        pizza.ingredients.map(ingr => {
            let prevIngrs = ingredients.filter(i => i.name === ingr)
            if (!prevIngrs[0]?.pizzas.filter(prev => prev === pizza._id)?.length) {
                if (prevIngrs.length) {
                    // console.log(prevIngrs)
                    ingredients = ingredients.filter(i => i.name !== prevIngrs[0].name)
                    ingredients.push({
                        name: ingr,
                        nums: prevIngrs[0].nums + 1,
                        pizzas: [...prevIngrs[0].pizzas, pizza._id]
                    })
                } else {
                    ingredients.push({
                        name: ingr,
                        nums: 1,
                        pizzas: [pizza._id]
                    })
                }
            }
        })
    })
    // console.log(ingredients)
    let ingrs = await Ingredients.findOne()
    if (!ingrs) ingrs = new Ingredients()
    ingrs.allIngredients = ingredients
    await ingrs.save()
});

module.exports = mongoose.model('Pizza', PizzaSchema);
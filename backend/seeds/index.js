
require('dotenv').config();

const mongoose = require('mongoose');
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
});
mongoose.set('strictQuery', true);

const Pizza = require('../models/pizza')
const User = require('../models/user')
const Order = require('../models/order')
const Cart = require('../models/cart')

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

async function addPizzas(num) {
    // await Pizza.deleteMany()
    for (let i = 0; i < num; i++) {
        let ingrs = []
        for (let j = 0; j < Math.floor(Math.random() * 13) + 5; j++) {
            ingrs.push(lorem.generateWords(1))
        }

        const pizza = new Pizza({
            title: lorem.generateWords(Math.floor(Math.random() * 2) + 2),
            images: [
                {
                    url: 'https://source.unsplash.com/random/?pizza/',
                    filename: 'pizzas/file_e9hwpg'
                }
            ],
            key: Math.floor(Math.random() * 5000),
            description: lorem.generateSentences(Math.floor(Math.random() * 15) + 1),
            price: Math.floor(Math.random() * 120) + 1,
            currency: "CZK",
            ingredients: ingrs
        })
        await pizza.save()
    }
}

async function deleteAllUsers() {
    await User.deleteMany()
}

async function deleteAllOrders() {
    await Order.deleteMany()
}

async function deleteAllPizzas() {
    await Pizza.deleteMany()
}

async function deleteAllCarts() {
    await Cart.deleteMany()
}

// deleteAllUsers()
// deleteAllOrders()
// deleteAllPizzas()
// addPizzas(10)
// deleteAllCarts()
const mongoose = require('mongoose');
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const dbUrl = process.env.DB_URL  // 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
});

const Pizza = require('../models/pizza')
const User = require('../models/user')

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
    await Pizza.deleteMany()
    for (let i = 0; i < num; i++) {
        let ingrs = []
        for (let j = 0; j < Math.floor(Math.random() * 13) + 5; j++){
            ingrs.push(lorem.generateWords(1))
        }

        const pizza = new Pizza({
            title: lorem.generateWords(Math.floor(Math.random() * 2) + 2),
            images: [
                {
                    url: 'https://res.cloudinary.com/dzxwekkvd/image/upload/v1674492278/pizzas/pizza-1_qf3tto.jpg',
                    filename: 'pizzas/pizza-1_qf3tto'
                }
            ],
            key: Math.floor(Math.random() * 5000),
            description: lorem.generateSentences(Math.floor(Math.random() * 15) + 1),
            price: Math.floor(Math.random() * 120) + 1,
            ingredients: ingrs
        })
        await pizza.save()
    }
}

async function deleteAllUsers() {
    await User.deleteMany()
}

// addPizzas(10)
deleteAllUsers()
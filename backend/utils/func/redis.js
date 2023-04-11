const Redis = require('redis')

const redisClient = Redis.createClient({ url: process.env.REDIS_URL });
(async () => {
    redisClient.on("error", (error) => console.error(`Ups : ${error}`));
    await redisClient.connect();
})();

async function getOrSetexCached(query, time, cb) {
    return new Promise(async (resolve, reject) => {
        let result
        try {
            let cached = JSON.parse(await redisClient.get(query))
            if (cached) {
                result = cached
            } else {
                result = await cb()
                await redisClient.SETEX(query, time, JSON.stringify(result))
            }
        } catch (e) {
            result = await cb()
            // await redisClient.SETEX(query, time, JSON.stringify(result))
        }
        resolve(result)
    })
}

async function scanAndDelete (match) {
    return new Promise(async (resolve, reject) => {
        for await (const key of redisClient.scanIterator({ MATCH: match  })) {
            await redisClient.del(key);
        }
        resolve('OK')
    })
}

async function redisDeleteAllPizzasAndIngrs () {
    return new Promise(async (resolve, reject) => {
        await scanAndDelete('pizzas*')
        await scanAndDelete('ingredients*')
        resolve('OK')
    })
}

module.exports = {
    getOrSetexCached,
    scanAndDelete,
    redisClient,
    redisDeleteAllPizzasAndIngrs
}
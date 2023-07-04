import express, {Application, Request, Response} from 'express';
import {MongoClient} from "mongodb";
// import {MongoClient, MongoClientOptions} from 'mongodb';

const app = express();
const port = 8000;

// Mongodb
const mongoUrl = 'mongodb://localhost:27017/';
const mongoClient = new MongoClient(mongoUrl);

try {
    await mongoClient.connect();
} catch (e) {
    console.error(e);
}

const mongoDbName = 'dat-cocktails';
const database = mongoClient.db(mongoDbName);
const ingredientsCollectionName = 'ingredients';
const ingredientsCollection = database.collection(ingredientsCollectionName);

// Test get all ingredients
app.get('/', async (req: Request, res: Response) => {
    const query = {};
    const result = await ingredientsCollection.find(query);
    res.contentType('application/json');
    const resOutArr = [];
    for await (const doc of result) {
        resOutArr.push(doc);
    }
    res.send(resOutArr);
    // console.log(resOutArr);
});

app.listen(port, () => {
    console.log(`⚡️ [server]: Server is running at http://localhost:${port}/`);
})

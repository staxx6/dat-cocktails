import express, { Application, json, Request, Response } from 'express';
import { MongoDbConnectionService } from './services/mongo-db-connection.service.js';
import { IDbConnection, Ingredient, IngredientFilter } from 'dat-cocktails-types';

const app = express();
const port = 8000;

app.use(json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Mongodb
const dbConnection: IDbConnection = new MongoDbConnectionService();
await dbConnection.connect();

// TODO: use ingredients with empty filter
app.get('/allIngredients', async (req: Request, res: Response) => {
    res.contentType('application/json');
    res.send(await dbConnection.getAllIngredients());
});

app.post('/ingredients', async (req: Request, res: Response) => {
    console.log(req.body);
    const filter = req.body as IngredientFilter ?? {};
    res.contentType('application/json');
    res.send(await dbConnection.getIngredients(filter));
});

// TODO: use recipes with empty filter
app.get('/allRecipes', async (req: Request, res: Response) => {
    res.contentType('application/json');
    res.send(await dbConnection.getAllRecipes());
});

app.listen(port, () => {
    console.log(`⚡️ [server]: Server is running at http://localhost:${port}/`);
})

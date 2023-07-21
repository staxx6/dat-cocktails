import express, {Application, json, Request, Response} from 'express';
import {MongoDbConnectionService} from './services/mongo-db-connection.service.js';
import { IDbConnection, Ingredient, IngredientFilter, Recipe, RecipeFilter } from 'dat-cocktails-types';

const app = express();
const port = 8000;

app.use(json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
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
    const filter = req.body as IngredientFilter ?? {};
    res.contentType('application/json');
    const result = await dbConnection.getIngredients(filter);
    // result.forEach(ingredient => ingredient.filter = filter);
    console.log(`Request ingredients: ${JSON.stringify(filter)} - Result: ${JSON.stringify(result)}`);

    // res.setHeader("Surrogate-Control", "no-store");
    // res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    // res.setHeader("Expires", "0");
    
    res.send(result);
});

// TODO: use recipes with empty filter
app.get('/allRecipes', async (req: Request, res: Response) => {
    res.contentType('application/json');
    res.send(await dbConnection.getAllRecipes());
});

app.post('/recipes', async (req: Request, res: Response) => {
    const filter = req.body as RecipeFilter ?? {};
    res.contentType('application/json');
    res.send(await dbConnection.getRecipes(filter));
});

// Create
app.post('/recipe', async (req: Request, res: Response) => {
    const resultId = await dbConnection.createRecipe(req.body as Recipe);
    console.table(resultId);
    res.send({id: resultId}); // TODO
})

app.put('/recipe', async (req: Request, res: Response) => {
    const result = await dbConnection.updateRecipe(req.body as Recipe); // what with empty?
    console.table(result);
    res.send(true); // TODO
});

app.delete('/recipe', async (req: Request, res: Response) => {
    console.log('try to delete: ' + JSON.stringify(req.query['id']));
    const result = await dbConnection.deleteRecipe(parseInt(<string>req.query['id'])); // what with empty?
    console.table(result);
    res.send(true); // TODO
});

app.listen(port, () => {
    console.log(`⚡️ [server]: Server is running at http://localhost:${port}/`);
})

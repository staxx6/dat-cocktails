import express, {Application, Request, Response} from 'express';
import { MongoDbConnectionService } from './services/mongo-db-connection.service.js';
import { IDbConnection } from 'dat-cocktails-types';

const app = express();
const port = 8000;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Mongodb
const dbConnection: IDbConnection = new MongoDbConnectionService();
await dbConnection.connect();

// Test get all ingredients
app.get('/allIngredients', async (req: Request, res: Response) => {
    res.contentType('application/json');
    res.send(await dbConnection.getAllIngredients());
});

app.listen(port, () => {
    console.log(`⚡️ [server]: Server is running at http://localhost:${port}/`);
})

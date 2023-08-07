import express, {json, Request, Response} from 'express';
import {MongoDbConnectionService} from './services/mongo-db-connection.service.js';
import {
  IDbConnection,
  Ingredient,
  IngredientFilter,
  MeasuringUnitFilter,
  Recipe,
  RecipeFilter
} from 'dat-cocktails-types';
import {v4 as uuidv4} from 'uuid';
import path from "path";
import * as fs from "fs";
import sharp from 'sharp';

const app = express();
const port = 8000;

const cocktailPictureFolder = 'C:\\ng\\dat-cocktails\\server\\pictures';
const ingredientPictureFolder = 'C:\\ng\\dat-cocktails\\server\\pictures';

app.use('pictures', express.static('pictures'));

app.use(json({limit: '50mb'}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Mongodb
const dbConnection: IDbConnection = new MongoDbConnectionService();
await dbConnection.connect();

app.get('/pictures/:imageName', async (req: Request, res: Response) => {
  const imageName = req.params['imageName'];
  res.contentType('image/jpg');
  res.sendFile(`${cocktailPictureFolder}\\${imageName}`);
});

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

/**
 * Create ingredient
 * TODO: picture
 */
app.post('/ingredient', async (req: Request, res: Response) => {
  const resultId = await dbConnection.createIngredient(req.body as Ingredient);
  console.table(resultId);
  res.send({id: resultId}); // TODO
})

/**
 * Update ingredient
 * TODO: picture
 */
app.put('/ingredient', async (req: Request, res: Response) => {
  const ingredient = req.body as Ingredient;

  // picture handling
  if (ingredient.pictureB64) {
    const pictureB64 = ingredient.pictureB64;
    delete ingredient.pictureB64;

    const uniqueId = uuidv4();
    const pictureFileName = `${uniqueId}.jpg`; // TODO: File-Extension

    if (!fs.existsSync(ingredientPictureFolder)) {
      fs.mkdirSync(ingredientPictureFolder);
    }

    const pictureFilePath = path.join(ingredientPictureFolder, pictureFileName);
    const pictureData = pictureB64.replace(/^data:image\/jpeg;base64,/, '');
    const pictureBuffer = Buffer.from(pictureData, 'base64');

    sharp(pictureBuffer)
      .resize(1000, 1000, {
        fit: 'inside', // Maintain aspect ratio and ensure the image fits within the specified dimensions
        withoutEnlargement: true, // Prevent up-scaling if the image is smaller than the specified dimensions
      })
      .toFile(pictureFilePath, (err, info) => {
        if (err) {
          console.error('Error resizing and saving the image:', err);
        } else {
          console.log('Image resized and saved successfully:', info);
        }
      });
    // fs.writeFileSync(pictureFilePath, pictureData, 'base64');

    ingredient.pictureFileIdWithExt = `${pictureFileName}`;
  }

  const result = await dbConnection.updateIngredient(req.body as Ingredient); // what with empty?
  console.table(result);
  res.send(true); // TODO
});

/**
 * Delete ingredient
 * TODO: delete picture from it!
 */
app.delete('/ingredient', async (req: Request, res: Response) => {
  console.log('try to delete: ' + JSON.stringify(req.query['id']));
  const result = await dbConnection.deleteIngredient(parseInt(<string>req.query['id'])); // what with empty?
  console.table(result);
  res.send(true); // TODO
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

/**
 * Create recipe
 * TODO: picture
 */
app.post('/recipe', async (req: Request, res: Response) => {
  const resultId = await dbConnection.createRecipe(req.body as Recipe);
  console.table(resultId);
  res.send({id: resultId}); // TODO
})

/**
 * Update recipe
 * TODO: picture
 */
app.put('/recipe', async (req: Request, res: Response) => {
  const recipe = req.body as Recipe;

  // picture handling
  if (recipe.pictureB64) {
    const pictureB64 = recipe.pictureB64;
    delete recipe.pictureB64;

    const uniqueId = uuidv4();
    const pictureFileName = `${uniqueId}.jpg`; // TODO: File-Extension

    if (!fs.existsSync(cocktailPictureFolder)) {
      fs.mkdirSync(cocktailPictureFolder);
    }

    const pictureFilePath = path.join(cocktailPictureFolder, pictureFileName);
    const pictureData = pictureB64.replace(/^data:image\/jpeg;base64,/, '');
    const pictureBuffer = Buffer.from(pictureData, 'base64');

    sharp(pictureBuffer)
      .resize(1000, 1000, {
        fit: 'inside', // Maintain aspect ratio and ensure the image fits within the specified dimensions
        withoutEnlargement: true, // Prevent up-scaling if the image is smaller than the specified dimensions
      })
      .toFile(pictureFilePath, (err, info) => {
        if (err) {
          console.error('Error resizing and saving the image:', err);
        } else {
          console.log('Image resized and saved successfully:', info);
        }
      });
    // fs.writeFileSync(pictureFilePath, pictureData, 'base64');

    recipe.pictureFileIdWithExt = `${pictureFileName}`;
  }

  const result = await dbConnection.updateRecipe(req.body as Recipe); // what with empty?
  console.table(result);
  res.send(true); // TODO
});

/**
 * Delete recipe
 * TODO: delete picture from it!
 */
app.delete('/recipe', async (req: Request, res: Response) => {
  console.log('try to delete: ' + JSON.stringify(req.query['id']));
  const result = await dbConnection.deleteRecipe(parseInt(<string>req.query['id'])); // what with empty?
  console.table(result);
  res.send(true); // TODO
});

app.post('/measuringUnits', async (req: Request, res: Response) => {
  const filter = req.body as MeasuringUnitFilter ?? {};
  res.contentType('application/json');
  res.send(await dbConnection.getMeasuringUnits(filter));
});

app.listen(port, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${port}/`);
})

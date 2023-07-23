import {
    IDbConnection,
    IFilter,
    Ingredient,
    IngredientFilter, MeasuringUnit,
    MeasuringUnitFilter,
    Recipe,
    RecipeFilter
} from 'dat-cocktails-types';
import { Collection, Db, MongoClient, WithId } from "mongodb";

export class MongoDbConnectionService implements IDbConnection {

    private readonly _url = 'mongodb://localhost:27017/';
    private readonly _client = new MongoClient(this._url);

    private readonly _dbName = 'dat-cocktails'; // -test
    private readonly _ingredientsCollectionName = 'ingredients';
    private readonly _recipesCollectionName = 'recipes';
    private readonly _measureUnitsCollectionName = 'measuring-units';

    private _dataBase: Db | undefined;

    private getDb(): Db {
        if (!this._dataBase) {
            this._dataBase = this._client.db(this._dbName);
        }
        return this._dataBase;
    }

    private _ingredientsCollection: Collection<Ingredient> | undefined;

    private _getIngredientCollection(): Collection<Ingredient> {
        if (!this._ingredientsCollection) {
            this._ingredientsCollection = this.getDb().collection<Ingredient>(this._ingredientsCollectionName);
        }
        return this._ingredientsCollection;
    }

    private _recipesCollection: Collection<Recipe> | undefined;

    private _getRecipesCollection(): Collection<Recipe> {
        if (!this._recipesCollection) {
            this._recipesCollection = this.getDb().collection<Recipe>(this._recipesCollectionName);
        }
        return this._recipesCollection;
    }

    private _measuringUnitCollection: Collection<MeasuringUnit> | undefined;

    private getMeasuringUnitCollection(): Collection<MeasuringUnit> {
        if (!this._measuringUnitCollection) {
            this._measuringUnitCollection = this.getDb().collection<MeasuringUnit>(this._measureUnitsCollectionName);
        }
        return this._measuringUnitCollection;
    }

    constructor() {
    }

    async connect(): Promise<boolean> {
        try {
            await this._client.connect();
        } catch (e) {
            throw e; // kek
        }
        return true;
    }

    get(filter: IFilter): Promise<any[]> {
        return Promise.resolve([]);
    }

    getAll(): Promise<any[]> {
        return Promise.resolve([]);
    }

    async getAllIngredients(): Promise<Ingredient[]> {
        const query = {};
        const cursor = await this._getIngredientCollection().find(query);
        return await cursor.toArray();
    }

    async getRecipes(filter: RecipeFilter): Promise<Recipe[]> {
        const cursor = await this._getRecipesCollection().find(filter);
        return await cursor.toArray();
    }

    async updateRecipe(recipe: Recipe): Promise<boolean> {
        // TODO: Return result
        delete (recipe as any)['_id'];
        await this._getRecipesCollection().replaceOne({id: recipe.id}, recipe);
        console.log(`updated recipe with id: ${recipe.id}`);
        return true; // TODO
    }

    async createRecipe(recipe: Recipe): Promise<number> {
        // Please explain ki result :)
        const result = await this._getRecipesCollection().find({}, { projection: { id: 1 } }).sort({ id: -1 }).limit(1).toArray();
        console.log('result from find: ' + JSON.stringify(result));
        let resultId;
        if (result.length !== 0) {
            resultId = result[0].id + 1;
        } else {
            resultId = 0;
        }
        console.log('new resiltID: ' + resultId);
        recipe.id = resultId;
        await this._getRecipesCollection().insertOne(recipe);
        console.log(`created recipe: ` + JSON.stringify(recipe));
        return resultId; // TODO
    }

    async getAllRecipes(): Promise<Recipe[]> {
        const query = {};
        const cursor = await this._getRecipesCollection().find(query);
        return await cursor.toArray();
    }

    async getIngredients(filter: IngredientFilter): Promise<Ingredient[]> {
        const cursor = await this._getIngredientCollection().find(filter);
        return await cursor.toArray();
    }

    async deleteRecipe(id: number): Promise<boolean> {
        await this._getRecipesCollection().deleteOne({id: id});
        console.log(`Deleted recipe with id: ${id}`);
        return true;
    }

    async getMeasuringUnits(filter: MeasuringUnitFilter): Promise<MeasuringUnit[]> {
        const cursor = await this.getMeasuringUnitCollection().find(filter);
        return await cursor.toArray();
    }
}

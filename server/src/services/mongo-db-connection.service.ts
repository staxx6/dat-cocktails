import { IDbConnection, IFilter, Ingredient, IngredientFilter, Recipe } from 'dat-cocktails-types';
import { Collection, Db, MongoClient, WithId } from "mongodb";

export class MongoDbConnectionService implements IDbConnection {

    private readonly _url = 'mongodb://localhost:27017/';
    private readonly _client = new MongoClient(this._url);

    private readonly _dbName = 'dat-cocktails';
    private readonly _ingredientsCollectionName = 'ingredients';

    private _dataBase: Db | undefined;
    private getDb(): Db {
        if (!this._dataBase) {
            this._dataBase = this._client.db(this._dbName);
        }
        return this._dataBase;
    }
    private _ingredientsCollection: Collection<Ingredient> | undefined;
    private getIngredientCollection(): Collection<Ingredient> {
        if (!this._ingredientsCollection) {
            this._ingredientsCollection = this.getDb().collection<Ingredient>(this._ingredientsCollectionName);
        }
        return this._ingredientsCollection;
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
      const cursor = await this.getIngredientCollection().find(query);
      return await cursor.toArray();
    }

    getAllRecipes(): Recipe[] {
        return [];
    }

    getIngredients(filter: IngredientFilter): Ingredient[] {
        return [];
    }

}

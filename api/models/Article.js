const DB = require('../controllers/Database');
const db = new DB();
const uuid = require('uuid/v1');
const tableName = require('../config/configDB').tables.articles;

class Article {
    constructor(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        this.id = params.id || uuid();
        this.name = params.name || null;
        this.describe = params.describe || null;
        this.userId = params.userId || null;
        this.createdAt = params.createdAt || Date.now();
        this.updatedAt = params.updatedAt || null;
        this.deletedAt = params.deletedAt || null;
    }

    static async findOne(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        let query = `SELECT * FROM ${tableName} WHERE deleted_at=NULL`;
        query = params.id?query.concat(` AND id='${params.id}'`):query;
        query = params.name?query.concat(` AND name='${params.name}'`):query;
        query = params.describe?query.concat(` AND describe='${params.describe}'`):query;
        query = params.userId?query.concat(` AND user_id='${params.userId}'`):query;
        const result = await db.query(query).rows.shift();
        return new this({
            id: result.id,
            name: result.name,
            describe: result.describe,
            userId: result.user_id,
            createdAt: result.created_at,
            updatedAt: result.updated_at,
            deletedAt: result.deleted_at
        })
    } 

    static async findAll(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        let query = `SELECT * FROM ${tableName} WHERE deleted_at=NULL`;
        query = params.id?query.concat(` AND id='${params.id}'`):query;
        query = params.name?query.concat(` AND name='${params.name}'`):query;
        query = params.describe?query.concat(` AND describe='${params.describe}'`):query;
        query = params.userId?query.concat(` AND user_id='${params.userId}'`):query;
        const result = await db.query(query).rows;
        return result.map(article =>{
            return new this({
                id: article.id,
                name: article.name,
                describe: article.describe,
                userId: article.user_id,
                createdAt: article.created_at,
                updatedAt: article.updated_at,
                deletedAt: article.deleted_at
            })
        });
    } 

    static async delete(id = null) {
        if(!id) {
            if(!this.id) throw Error("Article id is required")
            id = this.id;
        }
        await db.query(`UPDATE ${tableName} SET deleted_at=${Date.now()} WHERE id=${id}`);
    }

    async save() {
        if(!this.name) throw Error("Client name is required");
        await db.query(`INSERT INTO ${tableName} (id, name, describe, user_id, created_at, updated_at, deleted_at)
        VALUES (${this.id}, ${this.name}, ${this.describe}, ${this.userId}, ${this.createdAt}, ${Date.now()}, ${this.deletedAt})`);
    } 
}

module.exports = Article;
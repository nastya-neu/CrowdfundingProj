const uuid = require('uuid/v1');
const crypto = require('crypto'); 
const DB = require('../controllers/Database');
const db =new DB();
const tableName = require('../config/configDB').tables.clients;

class Client {
    constructor(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        this.id = params.id || uuid();
        this.name = params.name;
        this.secret = params.secret || this._getSecret();
        this.createdAt = params.createdAt || Date.now();
        this.updatedAt = params.updatedAt | null;
        this.deletedAt = params.deletedAt || null;
    }

    static async findOne(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        let query = `SELECT * FROM ${tableName} WHERE deleted_at=NULL`;
        query = params.id?query.concat(` AND id='${params.id}'`):query;
        query = params.name?query.concat(` AND name='${params.name} '`):query;
        query = params.id?query.concat(` AND secret='${params.secret} '`):query;
        const result = await db.query(query).rows.shift();
        return {
            id: result.id,
            name: result.name,
            secret: result.secret,
            createdAt: result.created_at,
            updatedAt: result.updated_at
        }
    } 

    static async findAll(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        let query = `SELECT * FROM ${tableName} WHERE deleted_at=NULL`;
        query = params.id?query.concat(` AND id='${params.id}'`):query;
        query = params.name?query.concat(` AND name='${params.name}'`):query;
        query = params.id?query.concat(` AND secret='${params.secret}'`):query;
        const result = await db.query(query).rows;
        return result.map(client =>{
            return new this({
                id: client.id,
                name: client.name,
                secret: client.secret,
                createdAt: client.created_at,
                updatedAt: client.updated_at,
                deletedAt = client.deleted_at
            })
        });
    } 

    static async delete(id = null) {
        if(!id) {
            if(!this.id) throw Error("Client id is required")
            id = this.id;
        }
        await db.query(`UPDATE ${tableName} SET deleted_at=${Date.now()} WHERE id=${id}`);
    }

    async save() {
        if(!this.name) throw Error("Client name is required");
        await db.query(`INSERT INTO ${tableName} (id, name, secret, salt, created_at, updated_at, deleted_at)
        VALUES (${this.id}, ${this.name}, ${this.secret}, ${this.createdAt}, ${Date.now()}, ${this.deletedAt})`);
    } 

    _getSecret() {
        return crypto.randomBytes(128).toString('hex');
    }   
}

module.exports = Client;
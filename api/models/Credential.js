const crypto = require('crypto');
const DB = require('../controllers/Database');
const db = new DB();
const tableName = require('../config/configDB').tables.credentials; 
const uuid = require('uuid/v1');

class Credential {
    constructor(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        this.id = params.id || uuid();
        this.userId = params.userId || userId;
        this.hashedPassword = params.hashedPassword || null;
        this.salt = params.salt || this._getSalt();
        this.createdAt = params.createdAt || Date.now();
        this.updatedAt = params.updatedAt || null;
        this.deletedAt = params.deletedAt || null;
    }

    static async findOne(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        let query = `SELECT * FROM ${tableName} WHERE deleted_at=NULL`;
        query = params.id?query.concat(` AND id='${params.id}'`):query;
        query = params.userId?query.concat(` AND user_id='${params.userId} '`):query;
        const result = await db.query(query).rows.shift();
        return new this({
            id: result.id,
            userId: result.user_id,
            hashedPassword: result.hashed_password,
            salt: result.salt,
            createdAt: result.created_at,
            updatedAt: result.updated_at,
            deletedAt: result.deleted_at
        });
    } 

    static async findAll(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        let query = `SELECT * FROM ${tableName} WHERE deleted_at=NULL`;
        query = params.id?query.concat(` AND id='${params.id}'`):query;
        query = params.userId?query.concat(` AND user_id='${params.userId} '`):query;
        const result = await db.query(query).rows;
        return result.map(credential =>{
            return new this({
                id: credential.id,
                userId: credential.user_id,
                hashedPassword: credential.hashed_password,
                salt: credential.salt,
                createdAt: credential.created_at,
                updatedAt: credential.updated_at,
                deletedAt: credential.deleted_at
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

    static async checkPassword(userId, password) {
        const credentialData = await db.query(`SELECT hashed_password, salt FROM ${tableName} WHERE user_id='${userId}' AND deleted_at=NULL`).rows.shift();
        const hash = await this._encryptPassword(password,credentialData.salt);
        return hash === credentialData.hashed_password;
    } 

    async save() {
        if(!this.userId) throw Error("Credential userId is required");
        if(!this.hashedPassword) throw Error("Credential userId is required");
        await db.query(`INSERT INTO ${tableName} (id, user_id, hashed_password, salt, created_at, updated_at, deleted_at)
        VALUES (${this.id}, ${this.userId}, ${this.salt}, ${this.createdAt}, ${Date.now()}, ${this.deletedAt})`);
    } 

    async setPassword(password) {
        this.hashedPassword = await this._encryptPassword(password, this.salt);
    }

    _getSalt() {
        return crypto.randomBytes(128).toString('hex');
    }

    _encryptPassword(password, salt) {
        return new Promise((resolve, reject)=>{
            crypto.pbkdf2(password, salt, 10000, 512, 'sha512',(err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey.toString('hex'));
              })
        });
    }
}


module.exports = Credential;
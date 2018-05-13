const DB = require('../controllers/Database');
const db = new DB();
const uuid = require('uuid/v1');
const tableName = require('../config/configDB').tables.users;

class User {
    constructor(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        this.id = params.id || uuid();
        this.username = params.username || null;
        this.firstName = params.firstName || null;
        this.lastName = params.lastName || null;
        this.birthday = params.birthday || null;
        this.email = params.email || null;
        this.avatarUrl = params.avatarUrl || null;
        this.createdAt = params.createdAt || Date.now();
        this.updatedAt = params.updatedAt || null;
        this.deletedAt = params.deletedAt || null;
    }

    static async findOne(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        let query = `SELECT * FROM ${tableName} WHERE deleted_at=NULL`;
        query = params.id?query.concat(` AND id='${params.id}'`):query;
        query = params.username?query.concat(` AND username='${params.username}'`):query;
        query = params.firstName?query.concat(` AND first_name='${params.firstName}'`):query;
        query = params.lastName?query.concat(` AND last_name='${params.lastName}'`):query;
        query = params.birthday?query.concat(` AND birthday='${params.birthday}'`):query;
        query = params.email?query.concat(` AND email='${params.email}'`):query;
        const result = await db.query(query).rows.shift();
        return new this({
            id: result.id,
            username: result.username,
            firstName: result.first_name,
            lastName: result.last_name,
            birthday: result.birthday,
            email: result.email,
            avatarUrl: result.avatar_url,
            createdAt: result.created_at,
            updatedAt: result.updated_at,
            deletedAt: result.deleted_at
        })
    } 

    static async findAll(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        let query = `SELECT * FROM ${tableName} WHERE deleted_at=NULL`;
        query = params.id?query.concat(` AND id='${params.id}'`):query;
        query = params.username?query.concat(` AND username='${params.username}'`):query;
        query = params.firstName?query.concat(` AND first_name='${params.firstName}'`):query;
        query = params.lastName?query.concat(` AND last_name='${params.lastName}'`):query;
        query = params.birthday?query.concat(` AND birthday='${params.birthday}'`):query;
        query = params.email?query.concat(` AND email='${params.email}'`):query;
        const result = await db.query(query).rows;
        return result.map(user =>{
            return new this({
                id: user.id,
                username: user.username,
                firstName: user.first_name,
                lastName: user.last_name,
                birthday: user.birthday,
                email: user.email,
                avatarUrl: user.avatar_url,
                createdAt: user.created_at,
            updatedAt: user.updated_at,
            deletedAt: user.deleted_at
            })
        });
    } 

    static async delete(id = null) {
        if(!id) {
            if(!this.id) throw Error("USER id is required")
            id = this.id;
        }
        await db.query(`UPDATE ${tableName} SET deleted_at=${Date.now()} WHERE id=${id}`);
    }

    async save() {
        if(!this.username) throw Error("Username is required");
        if(!this.email) throw Error("User email is required");
        await db.query(`INSERT INTO ${tableName} (id, username, first_name, last_name, birthday, email, avatar_url, created_at, updated_at, deleted_at)
        VALUES (${this.id}, ${this.username}, ${this.firstName}, ${this.lastName}, ${this.birthday}, ${this.email}, ${this.avatarUrl},${this.createdAt}, ${Date.now()}, ${this.deletedAt})`);
    } 
}

module.exports = User;
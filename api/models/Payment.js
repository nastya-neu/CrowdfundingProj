const DB = require('../controllers/Database');
const db = new DB();
const uuid = require('uuid/v1');
const tableName = require('../config/configDB').tables.payment;
const { User, Aricle } = require('./index');

class Payment {
    constructor(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        this.id = params.id || uuid();
        this.articleId = params.articleId || null;
        this.userId = params.userId || null;
        this.amout = params.amout || null;
        this.createdAt = params.createdAt || Date.now();
        this.updatedAt = params.updatedAt || null;
        this.deletedAt = params.deletedAt || null;
    }

    static async findOne(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        let query = `SELECT * FROM ${tableName} WHERE deleted_at=NULL`;
        query = params.id?query.concat(` AND id='${params.id}'`):query;
        query = params.articleId?query.concat(` AND article_id='${params.articleId}'`):query;
        query = params.userId?query.concat(` AND user_id='${params.userId}'`):query;
        const result = await db.query(query).rows.shift();
        return new this({
            id: result.id,
            articleId: result.article_id,
            userId: result.user_id,
            amout: result.amout,
            createdAt: result.created_at,
            updatedAt: result.updated_at,
            deletedAt: result.deleted_at
        })
    } 

    static async findAll(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        let query = `SELECT * FROM ${tableName} WHERE deleted_at=NULL`;
        query = params.id?query.concat(` AND id='${params.id}'`):query;
        query = params.articleId?query.concat(` AND article_id='${params.articleId}'`):query;
        query = params.userId?query.concat(` AND user_id='${params.userId}'`):query;
        const result = await db.query(query).rows;
        return result.map(payment =>{
            return new this({
                id: payment.id,
                articleId: payment.article_id,
                userId: payment.user_id,
                amout: payment.amout,
                createdAt: payment.created_at,
                updatedAt: payment.updated_at,
                deletedAt: payment.deleted_at
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

    static async getSumByArticle(articleId) {
        if(!articleId) throw Error("Article Id is required");
        let query = `SELECT SUM(amount) FROM ${tableName} WHERE deleted_at=NULL AND article_id=${articleId}`;
        const result = await db.query(query).rows;
        return result;
    }

    async save() {
        if(!this.articleId) throw Error("Payment article id is required");
        if(!this.userId) throw Error("Payment user id is required");
        if(!this.amount) throw Error("Amount is required");
        const isUserExists = await User.findOne({id: this.userId});
        if(!isUserExists) throw Error("User not found");
        const isArticleExists = await Aricle.findOne({id: this.articleId});
        if(!isArticleExists) throw Error("Article not found");
        await db.query(`INSERT INTO ${tableName} (id, article_id, user_id, amount, created_at, updated_at, deleted_at)
        VALUES (${this.id}, ${this.articleId}, ${this.userId}, ${this.amount}, ${this.createdAt}, ${Date.now()}, ${this.deletedAt})`);
    } 
}

module.exports = Payment;
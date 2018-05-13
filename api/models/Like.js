const DB = require('../controllers/Database');
const db = new DB();
const uuid = require('uuid/v1');
const tableName = require('../config/configDB').tables.likes;
const { User, Aricle } = require('./index');

class Like {
    constructor(params) {
        if(!params || typeof params !== 'object') throw Error("Params must be object");
        this.id = params.id || uuid();
        this.articleId = params.articleId || null;
        this.userId = params.userId || null;
        this.isLikes = params.isLikes || null;
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
        query = params.isLikes?query.concat(` AND is_likes='${params.isLikes}'`):query;
        const result = await db.query(query).rows.shift();
        return new this({
            id: result.id,
            articleId: result.article_id,
            userId: result.user_id,
            isLikes: result.is_likes,
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
        query = params.isLikes?query.concat(` AND is_likes='${params.isLikes}'`):query;
        const result = await db.query(query).rows;
        return result.map(like =>{
            return new this({
                id: like.id,
                articleId: like.article_id,
                userId: like.user_id,
                isLikes: like.is_likes,
                createdAt: like.created_at,
                updatedAt: like.updated_at,
                deletedAt: like.deleted_at
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

    static async getCountLikesByArticle(articleId) {
        if(!articleId) throw Error("Article Id is required");
        let query = `SELECT COUNT(*) FROM ${tableName} WHERE deleted_at=NULL AND article_id=${articleId} AND is_likes=TRUE`;
        const result = await db.query(query).rows;
        return result;
    }

    static async getCountDislikesByArticle(articleId) {
        if(!articleId) throw Error("Article Id is required");
        let query = `SELECT COUNT(*) FROM ${tableName} WHERE deleted_at=NULL AND article_id=${articleId} AND is_likes=FALSE`;
        const result = await db.query(query).rows;
        return result;
    }

    async save() {
        if(!this.articleId) throw Error("Like article id is required");
        if(!this.userId) throw Error("Like user id is required");
        if(typeof this.isLikes !== "boolean") throw Error("Is like is required");
        const isUserExists = await User.findOne({id: this.userId});
        if(!isUserExists) throw Error("User not found");
        const isArticleExists = await Aricle.findOne({id: this.articleId});
        if(!isArticleExists) throw Error("Article not found");
        await db.query(`INSERT INTO ${tableName} (id, article_id, user_id, is_likes, created_at, updated_at, deleted_at)
        VALUES (${this.id}, ${this.articleId}, ${this.userId}, ${this.isLikes}, ${this.createdAt}, ${Date.now()}, ${this.deletedAt})`);
    } 
}

module.exports = Like;
module.exports = {
        host: process.env.PGHOST || "localhost", 
        port: process.env.PGPORT || '5432',
        database: process.env.PGDATABASE || 'ds_api',
        user: process.env.PGUSER || "root",
        password: process.env.PGPASSWORD || null,
        max: 20,
        tables: {
                users: 'users',
                articles: 'articles',
                credentials: 'user_credentials',
                tokens: 'user_tokens',
                likes: 'user_likes',
                payment: 'user_payment',
                clients: 'clients'
        }
}
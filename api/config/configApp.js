module.exports = {
    port: process.env.HTTP_PORT || 3000,
    numThreads:  process.env.NUM_THREADS || require('os').cpus().length,
    autoHeal: process.env.AUTO_HEAL === "true",
    session: {
        secret: process.env.SESSION_SECRET || "ILikeCrowdfunding",
        resave: false,
        saveUninitialized: true
    }
};

module.exports = (app, express)=>{
    const router = express.Router();

    router.get('/', (req,res)=>{
        res.send('OK!');
    });

    return router;
};
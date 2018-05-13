const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

module.exports = (app, express)=>{
    const router = express.Router();    

    router.use(bodyParser.urlencoded());
    router.use(bodyParser.json());
      
    router.get('/',(req, res)=>{
      res.status(200).send("OK") 
    });
    return router;
};
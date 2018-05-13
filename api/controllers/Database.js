const { Pool } = require('pg');
const config = require('../config/configDB');

class DatabaseCtrl {
    constructor() {
        this._config = config;
        this._pool = new Pool(this._config);
    }

    getPool(){
        return this._pool;
    }
    
    query(query) {
        return new Promise((resolve, reject)=>{
            this._pool.connect((errorConnection, client, release) => {
                if (errorConnection) 
                  reject(errorConnection);
                client.query(query, (errorQuery, result) => {
                  release()
                  if (errorQuery) 
                    reject(errorQuery)
                  resolve(result)
                })
              })
        });
    }
}

module.exports = DatabaseCtrl;
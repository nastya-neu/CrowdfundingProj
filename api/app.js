const cluster = require('cluster');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config/configApp');

const app = express();
const router = require('./routes')(app, express);

const migrations = require('./migrations');


const bootstrapWorker = ()=>{
    app.use(router);
    app.listen(config.port, ()=>{

    });
    console.log("Application listening on " + config.port );
};

const bootstrapMaster = ()=>{
    for(let workerNum = 0; workerNum < config.numThreads; workerNum++){
        cluster.fork();
    }
    cluster.on('exit', worker => {
        console.log(`Worker ${worker.id} died`);
        if(config.autoHeal)
            setTimeout(()=>{
                console.log("Autoheal is enabled, start new worker");
                cluster.fork();
            }, 5000);    
    });
}

if (cluster.isMaster) {
    console.log(`Starting cluster with ${config.numThreads} workers`);
    migrations()
    .then(bootstrapMaster)
    .catch((error)=>{
        console.log("Unable to bootstrap worker:", error);
        process.exit(1);
    });
} else {
    bootstrapWorker();
}
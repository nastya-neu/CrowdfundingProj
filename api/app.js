const cluster = require('cluster');
const express = require('express');
const config = require('./config/configApp');

const app = express();
const router = require('./routes')(app, express);

const migrations = require('./migrations');

migrations()
.then(()=>{
    startApp()
})
.catch((error)=>{
    console.log("Unable to bootstrap worker:", error);
    process.exit(1);
})

const startApp = ()=>{
    if (cluster.isMaster) {
        console.log(`Starting cluster with ${config.numThreads} workers`);
        bootstrapMaster()
    } else {
        bootstrapWorker();
    }
}

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
'use strict';
import logger from './app/util/logger'
import config from './config/config'
import express from './config/express'

const server = express();

server.listenAsync(config.port).then(()=>{
    logger.info('Application started on port ', config.port);
});

'use strict';
const winston = require('winston');

const logger =  new (winston.Logger)({
     level:'info',
     transports:[
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename:'./logs/applog.log'})
     ]
 });

export default logger;

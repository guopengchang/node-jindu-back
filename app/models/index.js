'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../../config/config';
import logger from '../util/logger';

const basename  =  'index.js';  //当前文件
const db = {};
const dbConfig = config.db;
let sequelize;

try{
    sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
    logger.info('Connected to the db...');
} catch(e){
    logger.error('Failed to connect to the db. Errors: ', e);
    throw e;
}

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));  //将Model导入到Service
    db[model.name] = model;  //在service中引用模型并调用find等方法
  });

db.sequelize = sequelize;

export default db;

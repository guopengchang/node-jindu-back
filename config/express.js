'use strict';

/**
 * Module dependencies.
 */
import fs from 'fs';
import util from 'util';
import https from 'https';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import logger from '../app/util/logger';
import path from 'path'
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

export default (db) => {
	// Initialize express app
	var app = express();

	// swagger
	var swaggerDefinition = {
		info: {
		  title: 'Node Swagger API',
		  version: '1.0.0',
		  description: 'Swagger 接口文档',
		},
		basePath: '/',
	};
	// options for the swagger docs
	var options = {
		swaggerDefinition: swaggerDefinition,
		apis: ['./app/routes/*.js'],
	};
	// initialize swagger-jsdoc
	var swaggerSpec = swaggerJSDoc(options);
	// serve swagger
	app.get('/swagger.json', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.send(swaggerSpec);
	});
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	app.listenAsync = util.promisify(app.listen);

	//cors
	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Origin', req.headers.origin);//自定义中间件，设置跨域需要的响应头。
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');  //允许任何方法
		res.setHeader('Access-Control-Allow-Headers', 'X-Token,token,authorization,content-type');   //允许任何类型
		res.setHeader('Access-Control-Allow-Credentials',true);
		res.setHeader('Set-Cookie', 'SameSite=None; Secure');
		next();
	});

	// 使用 session 中间件
	app.use(session({
		secret :  'secret', // 对session id 相关的cookie 进行签名
		resave : true,      // 是否允许session重新设置
		saveUninitialized: false, // 是否保存未初始化的会话
		cookie : {
			maxAge : 1000 * 60 * 30, // 设置 session 的有效时间，单位毫秒
		},
	}));

    // CookieParser should be above session
    app.use(cookieParser());

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

    // for routers
	require(process.cwd() + '/app/routes/user.route.js')(app)

	return app;
};


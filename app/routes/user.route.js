'use strict';

/**
 * Module dependencies.
 */
import jwt from 'jsonwebtoken'
import express from 'express';
import logger from '../util/logger';
import LoanStatus from '../util/status.loan';
import userCtrl from '../controllers/user.ctrl';
import loanCtrl from '../controllers/loan.ctrl';
import loanFirstCtrl from '../controllers/app.first.ctrl';
import loanEndCtrl from '../controllers/app.end.ctrl';
import contractCtrl from '../controllers/contract.ctrl';
const router = express.Router();

export default function(app) {

	//for user
	/**
	 * @swagger
	 * /api/user/login:
	 *   post:
	 *     description: 登录
	 *     parameters:
	 *       - name: account
	 *         description: 账号
	 *         required: true
	 *       - name: password
	 *         description: 密码
	 *         required: true
	 */
	router.route('/user/login').post(userCtrl.login);
	/**
	 * @swagger
	 * /api/user/info:
	 *   get:
	 *     description: 用户信息
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 */
	router.route('/user/info').get(userCtrl.info);
	/**
	 * @swagger
	 * /api/user/list:
	 *   get:
	 *     description: 用户列表
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 */
	router.route('/user/list').get(userCtrl.list);
	/**
	 * @swagger
	 * /api/user/logout:
	 *   post:
	 *     description: 登出
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 */
	router.route('/user/logout').post(userCtrl.logout);
	/**
	 * @swagger
	 * /api/loan/list:
	 *   post:
	 *     description: 贷款列表,支持名称模糊查询
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: pageNo
	 *         description: 页码(从1开始)
	 *         required: true
	 *       - name: pageSize
	 *         description: 行数
	 *         required: true
	 *       - name: name
	 *         description: 名称
	 */
	router.route('/loan/list').get(loanCtrl.list);
	/**
	 * @swagger
	 * /api/loan/create:
	 *   post:
	 *     description: 贷款添加
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: loan
	 *         description: 贷款json对象
	 *         required: true
	 */
	router.route('/loan/create').post(loanCtrl.createOrUpd);
	/**
	 * @swagger
	 * /api/loan/update:
	 *   put:
	 *     description: 贷款修改
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: loan
	 *         description: 贷款json对象
	 *         required: true
	 */
	router.route('/loan/update').put(loanCtrl.createOrUpd);
	/**
	 * @swagger
	 * /api/loan/delete/{id}:
	 *   delete:
	 *     description: 贷款删除
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: id
	 *         description: 贷款id
	 *         required: true
	 */
	router.route('/loan/delete/:id').delete(loanCtrl.delete);
	/**
	 * @swagger
	 * /api/loan/query:
	 *   get:
	 *     description: 贷款查询
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: id
	 *         description: 贷款id
	 *         required: true
	 */
	router.route('/loan/query').get(loanCtrl.query);
	/**
	 * @swagger
	 * /api/loan/submitToApprove:
	 *   post:
	 *     description: 提交到初审
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: id
	 *         description: 贷款id
	 *         required: true
	 */
	router.route('/loan/submitToApprove').post(loanCtrl.submitToApprove);
	// router.route('/approve/first/history/:loanId').post(loanFirstCtrl.approveHistory);
	//for first approve
	/**
	 * @swagger
	 * /api/approve/first/list:
	 *   get:
	 *     description: 初审查询列表，支持名称模糊查询
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: pageNo
	 *         description: 页码(从1开始)
	 *         required: true
	 *       - name: pageSize
	 *         description: 行数
	 *         required: true
	 *       - name: name
	 *         description: 名称
	 */
	router.route('/approve/first/list').get(loanFirstCtrl.list);
	/**
	 * @swagger
	 * /api/approve/first/pass:
	 *   post:
	 *     description: 初审通过
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: appId
	 *         description: 初审id
	 *         required: true
	 *       - name: loanId
	 *         description: 贷款id
	 *         required: true
	 */
	router.route('/approve/first/pass').post(loanFirstCtrl.submitToEndApprove);
	/**
	 * @swagger
	 * /api/approve/first/reject:
	 *   post:
	 *     description: 初审拨回
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: appId
	 *         description: 初审id
	 *         required: true
	 *       - name: loanId
	 *         description: 贷款id
	 *         required: true
	 */
	router.route('/approve/first/reject').post(loanFirstCtrl.reject);
	//for end approve
	/**
	 * @swagger
	 * /api/approve/end/list:
	 *   get:
	 *     description: 终审查询列表，支持名称模糊查询
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: pageNo
	 *         description: 页码(从1开始)
	 *         required: true
	 *       - name: pageSize
	 *         description: 行数
	 *         required: true
	 *       - name: name
	 *         description: 名称
	 */
	router.route('/approve/end/list').get(loanEndCtrl.list);
	/**
	 * @swagger
	 * /api/approve/end/pass:
	 *   post:
	 *     description: 终审通过
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: appId
	 *         description: 终审id
	 *         required: true
	 *       - name: loanId
	 *         description: 贷款id
	 *         required: true
	 */
	router.route('/approve/end/pass').post(loanEndCtrl.submitToContract);
	/**
	 * @swagger
	 * /api/approve/end/reject:
	 *   post:
	 *     description: 终审拨回
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: appId
	 *         description: 终审id
	 *         required: true
	 *       - name: loanId
	 *         description: 贷款id
	 *         required: true
	 */
	router.route('/approve/end/reject').post(loanEndCtrl.reject);
	//for contract
	/**
	 * @swagger
	 * /api/contract/list:
	 *   get:
	 *     description: 合同查询列表
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: pageNo
	 *         description: 页码(从1开始)
	 *         required: true
	 *       - name: pageSize
	 *         description: 行数
	 *         required: true
	 *       - name: name
	 *         description: 名称
	 */
	router.route('/contract/list').get(contractCtrl.list);
	// router.route('/contract/createOrUpd').post(contractCtrl.createOrUpd);
	// router.route('/contract/delete').delete(contractCtrl.delete);
	/**
	 * @swagger
	 * /api/contract/createFile:
	 *   get:
	 *     description: 合同生成
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: id
	 *         description: 合同id
	 *         required: true
	 */
	router.route('/contract/createFile').post(contractCtrl.createContractFile);
	/**
	 * @swagger
	 * /api/contract/createFile:
	 *   get:
	 *     description: 合同预览下载
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: id
	 *         description: 合同id
	 *         required: true
	 */
	router.route('/contract/download').get(contractCtrl.downloadFile);

	//for permission
	/**
	 * @swagger
	 * /api/permission/createUser:
	 *   post:
	 *     description: 添加用户角色
	 *     parameters:
	 *       - name: token
	 *         description: 请求头key：token
	 *         required: true
	 *       - name: account
	 *         description: 登录账号
	 *         required: true
	 *       - name: password
	 *         description: 密码
	 *         required: true
	 *       - name: role_id
	 *         description: 角色id
	 *         required: true
	 */
	router.route('/permission/createUser').post(userCtrl.createUser);

	
	//检查token与登录状态
	let checkLogin = (req, res, next) => {
		logger.info(req.originalUrl, req.headers['token'], req.method)
		if (req.method === 'OPTIONS') {
			res.send(LoanStatus.RESULT.data = {code: 20000, msg: "options"})
		} else if (req.originalUrl === '/api/user/login') {
			next()
		// } else if (req.session.userInfo && req.headers['token'] == req.session.userInfo.token){
		} else if(req.headers.hasOwnProperty('token')) {
				logger.info('enter...')
				jwt.verify(req.headers.token, LoanStatus.PRIVATE_KEY, function(err, decoded) {
					if(err) {
						console.log(err)
					  LoanStatus.RESULT.data = {
						status: false,
						message: 'token不存在或已过期'
					  }
					  logger.info('token不存在或已过期...')
					  res.json(LoanStatus.RESULT);
					} else {
					  let decoded = jwt.decode(req.headers.token, LoanStatus.PRIVATE_KEY);
					  req.user = decoded;
					  next();//success
					}
				});
				// next()
		} else {
			logger.info('未登录或已超时')
			res.send(LoanStatus.RESULT.data = {code: 10000, msg: "please have a login"})
		}
			
	}
	app.use(checkLogin)
	
	app.use('/api', router);
	app.use('/static', express.static('files'));

	
}

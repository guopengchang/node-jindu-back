'use strict';
import jwt from 'jsonwebtoken'
import logger from '../util/logger';
import errorMessages from '../../config/error.messages';
import * as userService from '../services/user.service';
import LoanStatus from '../util/status.loan';

const operations = {
	/**查询所有*/
	list: function(req, resp){
		return userService
				.findAll(req.query)
				.then((data)=>{
					LoanStatus.RESULT.data = data
					resp.status(200).json(LoanStatus.RESULT);
				});
	},
	/**查询用户信息*/
	info: function(req, resp){
		let role = userService.findRoleByUId(req.user.id)
		role.then(d=>{
			LoanStatus.RESULT.data = {
				roles: [{id: d.id, name: d.role_name}]
			}
			resp.status(200).json(LoanStatus.RESULT);
		})
	},
	/**登出*/
	logout: function(req, resp){
		if (req.user && req.query.token != req.user.token) {
			req.user = null;
			LoanStatus.RESULT.message = "logout success";
			resp.status(200).json(LoanStatus.RESULT);
			return;
		}
		result.message = "logout failure";
		resp.status(200).json(result);
	},
	/**生成token*/
	generateToken(data) {
		return jwt.sign(data, LoanStatus.PRIVATE_KEY, {
				  expiresIn: '1d' // 1天 https://github.com/zeit/ms
				});
	},
	/**登入*/
	login: function(req, resp){
		logger.info("============"+JSON.stringify(req.body))
		const account = req.body.account;
		const password = req.body.password;
		userService.findByAccountPwd(account,password)
		.then(data=>{
			if (data) {
				LoanStatus.RESULT.data = {
					status: true,
					id: data.id,
					account: account
					// token: new Date().getTime()
				}
				//for session
				// req.session.userInfo = LoanStatus.RESULT.data;
				//for jwt
				LoanStatus.RESULT.data.token = operations.generateToken(LoanStatus.RESULT.data); //将基础信息写入jwt
				resp.status(200).json(LoanStatus.RESULT)
			} else {
				resp.status(404).send(errorMessages.USER_NOT_FOUND);
			}
		})

	},
	/**查询单个用户*/
	get: function(req, resp){
		const userName = req.params.userName;
		return userService
				.findByUserName(userName)
				.then((data)=>{
					if(data) {
						LoanStatus.RESULT.data = data;
						resp.status(200).json(LoanStatus.RESULT);
					} else {
						resp.status(404).send(errorMessages.USER_NOT_FOUND);
					}
				});
	},
	/**添加用户*/
	createUser: function(req, resp){
		const user = req.body;
		logger.info('About to create user and role ', user);
		return userService
				.createUserAndRole(user, req.user.account)
				.then((data)=>{
					if (data) {
						LoanStatus.RESULT.data = {status: true}
						resp.status(200).json(LoanStatus.RESULT);
					} else {
						resp.status(404).send(errorMessages.USER_NOT_FOUND);
					}
				});
	}

}

export default operations;











/**
 *
 *
 *系统管理员
测试账号：lidazhao
密码：Qwe123
手机：13800138001
验证码：654321

设备管理员
测试账号：wangerxiao
密码：Qwe123
手机：13800138002
验证码：654321


系统登陆/POST：http://jxsjs.com/equipment/login
参数：
type: 短信登陆sms、密码登陆password
短信登陆时：phone + code
密码登陆时：username + password

发送手机验证码/POST：http://jxsjs.com/equipment/code
参数：phone手机号

当前登陆用户信息/GET：http://jxsjs.com/equipment/who

退出登陆/POST：http://jxsjs.com/equipment/logout

修改密码/POST：http://jxsjs.com/equipment/password-reset
参数：oldPw旧密码、newPw新密码

概览总数和总金额/GET：http://jxsjs.com/equipment/overview
设备状态汇总/GET：http://jxsjs.com/equipment/status-overview
设备分类汇总/GET：http://jxsjs.com/equipment/category-overview

未入库设备状态列表/GET：http://jxsjs.com/equipment/status-list
参数：type=pre

编辑未入库设备状态/POST：http://jxsjs.com/equipment/status-edit
参数：type=pre、id状态编号、 name状态名称、color状态颜色

未入库设备状态列表排序/POST：http://jxsjs.com/equipment/status-order
参数：type=pre、ids状态编号排序数组

已入库设备状态列表/GET：http://jxsjs.com/equipment/status-list
参数：type=equip

编辑已入库设备状态/POST：http://jxsjs.com/equipment/status-edit
参数：type=equip、id状态编号、 name状态名称、color状态颜色

已入库设备状态列表排序/POST：http://jxsjs.com/equipment/status-order
参数：type=equip、ids状态编号排序数组

设备分类列表/GET：http://jxsjs.com/equipment/category-list

编辑设备分类/POST：http://jxsjs.com/equipment/category-edit
参数：id设备分类编号、 name设备分类名称

设备分类列表排序/POST：http://jxsjs.com/equipment/category-order
参数：ids设备分类编号排序数组

设备登记列表/POST：http://jxsjs.com/equipment/pre-list
参数：pageNo当前页数1开始、pageSize每页条数、id设备编号、name设备名称、status设备状态(传状态id)、category设备分类(传分类id)

添加设备/POST：http://jxsjs.com/equipment/pre-add
参数：name设备名称、status设备状态(传状态id)、category设备分类(传分类id)、number设备数量、price设备单价、time采购时间

编辑设备/POST：http://jxsjs.com/equipment/pre-edit
参数：id设备编号、name设备名称、status设备状态(传状态id)、category设备分类(传分类id)、number设备数量、price设备单价、time采购时间

 *
 *
 *
 *
 *
 *
 *
 *
 * 
 */
'use strict';

import logger from '../util/logger';
const models = require('../models');
const LoanStatus = require('../util/status.loan');
const Loan = models.jd_loan;
const Contract = models.jd_contract;
const LoanApproveEnd = models.jd_loan_approve_end;
const sequelize = require('sequelize');

/**
 * 初审分页查询所有贷款记录
**/
export async function findAll (pageNo, pageSize, name){
	let limit = pageSize;         //读取行数
	let offset = pageNo*pageSize; //读取开始行
	let result = {};
	if (name) {
		var d = await models.sequelize
			.query(`SELECT * from jd_loan_approve_end where loan_name like ? order by id desc LIMIT ${offset},${limit} `, 
			{replacements: ['%'+name+'%'], model: Loan})
		result.data = d;
		d = await models.sequelize
			.query(`SELECT count(*) num from jd_loan_approve_end where loan_name like ? `, 
			{replacements: ['%'+name+'%']})
		if (d && d.length > 0) {
			result.rows = d[0][0].num;
			result.pages = Math.ceil(d[0][0].num/pageSize);
		}
		
	} else {
		var d = await LoanApproveEnd.findAll({
			limit: Number(limit),
			offset: Number(offset),
			order: [
				['id', 'DESC']
			]
		});
		result.data = d;
		d = await models.sequelize
			.query(`SELECT count(*) num from jd_loan_approve_end `)
		if (d && d.length > 0) {
			result.rows = d[0][0].num;
			result.pages = Math.ceil(d[0][0].num/pageSize);
		}
	}
	return result;
};

/**
 * 根据ID查询所有贷款记录
**/
export function findById (id){
	return LoanApproveEnd.findOne({
		where: {
			id: id
		}
	});
};

/**根据贷款名称模糊查询*/
export function findByName (name) {
	sequelize
		.query(`SELECT * FROM jd_loan_approve_first where loan_name like '%?%'`, 
			{ replacements: [name], model: Loan })
	    .then(function(loans){
		return loans;
	})
}

/**
 * 添加 or 修改
**/
export function insertOrUpdate (loan){
	if (loan && loan.id) {
		return LoanApproveEnd.findById(loan.id)
			.then((p)=>{
				return p.update(loan);
			});
	} else {
		return LoanApproveEnd.create(loan);
	}
};

/**
 * 删除
**/
export function deleteLoan (_id){
	return LoanApproveEnd.destroy({
		where: {
			id: _id
		}
	});
};

/**
 * 提交终审审批
**/
export async function submitToContract (appId,loanId,userName){
	// 更新进价状态为： 提交到初审
	var loan = await Loan.findById(loanId)
	var _loan = JSON.parse(JSON.stringify(loan));
	_loan.status = LoanStatus.TO_CONTRACT;
	loan.update(_loan);
	logger.info("_loan", JSON.stringify(loan))
	// 更新终审状态
	var app = await LoanApproveEnd.findById(appId);
	var _app = JSON.parse(JSON.stringify(app));
	_app.result = LoanStatus.PASS;
	app.update(_app);
	logger.info("_app", JSON.stringify(app))

	var contracts = await models.sequelize.query(`SELECT * FROM jd_contract where loan_id = ?`, 
	{ replacements: [loanId], model: Contract })
	if (contracts && contracts.length > 0) {
		logger.info('已经存在合同。')
	} else {
		var obj = {
			loan_id: loanId,
			loan_name: _loan.name,
			loan_card: _loan.identity_card,
			approve: userName,
			created: new Date(),
			modified: new Date()
		}
		logger.info("obj", JSON.stringify(obj))
		return Contract.create(obj);
	}
}

/**
 * 拨回
 * appId-初审id
 * loanId-进件id
 * reason-原因
**/
export function reject (appId, loanId, reason, userName){
	// 更新进价状态为： 进阶状态
	Loan.findById(loanId)
	.then((p)=>{
		var loan = JSON.parse(JSON.stringify(p));
		loan.status = LoanStatus.APPROVE_END_REJECT; //终审拒绝
		p.update(loan);
	});
	return LoanApproveEnd.findById(appId)
	.then((p)=>{
		var approveEnd = JSON.parse(JSON.stringify(p));
		approveEnd.result = 'reject';
		approveEnd.content = reason;
		return p.update(approveEnd);
	});
}

'use strict';

const models = require('../models');
const LoanStatus = require('../util/status.loan');
const Loan = models.jd_loan;
const Log = models.jd_loan_log;
const LoanApprove = models.jd_loan_approve_first;
const sequelize = require('sequelize');
import logger from '../util/logger';

/**
 * 分页查询所有贷款记录
**/
export async function findAll (pageNo, pageSize, name){
	let limit = pageSize;         //读取行数
	let offset = pageNo*pageSize; //读取开始行
	let result = {};
	if (name) {
		var d = await models.sequelize
			.query(`SELECT * from jd_loan where name like ? order by id desc LIMIT ${offset},${limit} `, 
			{replacements: ['%'+name+'%'], model: Loan})
		result.data = d;
		d = await models.sequelize
			.query(`SELECT count(*) num from jd_loan where name like ? `, 
			{replacements: ['%'+name+'%']})
		if (d && d.length > 0) {
			result.rows = d[0][0].num;
			result.pages = Math.ceil(d[0][0].num/pageSize);
		}
		
	} else {
		var d = await Loan.findAll({
			limit: Number(limit),
			offset: Number(offset),
			order: [
				['id', 'DESC']
			]
		});
		result.data = d;
		d = await models.sequelize
			.query(`SELECT count(*) num from jd_loan `)
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
	return Loan.findOne({
		where: {
			id: id
		}
	});
};

/**根据贷款名称模糊查询*/
export function findByName (name) {
	sequelize
		.query(`SELECT * FROM jd_loan where name like '%?%'`, 
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
		return Loan.findById(loan.id)
			.then((p)=>{
				return p.update(loan);
			});
	} else {
		loan.status = 0; //默认进件状态
		return Loan.create(loan);
	}
};

/**
 * 删除
**/
export function deleteLoan (_id){
	return Loan.destroy({
		where: {
			id: _id
		}
	});
};

/**根据贷款ID查询*/
export async function findByLoanId (loanId) {
	return await models.sequelize
		.query(`SELECT * FROM jd_loan_approve_first where loan_id = ?`, 
			{ replacements: [loanId], model: LoanApprove })
}

/**
 * 提交审批
**/
export async function submitToApprove (loanId,userName){
	logger.info('submitToApprove ', loanId, userName);
	// 更新进价状态为： 提交到初审
	var loan = await Loan.findById(loanId);
	var _loan = JSON.parse(JSON.stringify(loan));
	_loan.status = LoanStatus.TO_APPROVE_FIRST;
	loan.update(_loan);
	// log
	Log.create({
		loan_id: loanId,
		name: userName,
		result: LoanStatus.PASS,
		modified: new Date()
	})
	
	var loanApp = await models.sequelize.query(`SELECT * FROM jd_loan_approve_first where loan_id = ?`, 
	{ replacements: [loanId], model: LoanApprove })
	if (loanApp && loanApp.length > 0) {
		var Approve = await LoanApprove.findById(loanApp[0].id);
		var _loanApp = JSON.parse(JSON.stringify(loanApp[0]));
		_loanApp.approve = userName
		_loanApp.modified = new Date();
		_loanApp.result = '';
		return Approve.update(_loanApp);
	} else {
		var obj = {
			loan_id: loanId,
			loan_name: _loan.name,
			loan_card: _loan.identity_card,
			approve: userName,
			modified: new Date()
		}
		return LoanApprove.create(obj);
	}
}

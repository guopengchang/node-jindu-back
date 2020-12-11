'use strict';

const models = require('../models');
const LoanStatus = require('../util/status.loan');
const Loan = models.jd_loan;
const LoanApprove = models.jd_loan_approve_first;
const LoanApproveEnd = models.jd_loan_approve_end;
const sequelize = require('sequelize');

/**
 * 初审分页查询所有贷款记录
 * api:https://itbilu.com/nodejs/npm/VJIR1CjMb.html
**/
export async function findAll (pageNo, pageSize, name){
	let limit = pageSize;         //读取行数
	let offset = pageNo*pageSize; //读取开始行
	let result = {};
	if (name) {
		var d = await models.sequelize
			.query(`SELECT * from jd_loan_approve_first where loan_name like ? order by id desc LIMIT ${offset},${limit} `, 
			{replacements: ['%'+name+'%'], model: LoanApprove})
		result.data = d;
		d = await models.sequelize
			.query(`SELECT count(*) num from jd_loan_approve_first where loan_name like ? `, 
			{replacements: ['%'+name+'%']})
		if (d && d.length > 0) {
			result.rows = d[0][0].num;
			result.pages = Math.ceil(d[0][0].num/pageSize);
		}
		
	} else {
		var d = await LoanApprove.findAll({
			limit: Number(limit),
			offset: Number(offset),
			order: [
				['id', 'DESC']
			]
		});
		result.data = d;
		d = await models.sequelize
			.query(`SELECT count(*) num from jd_loan_approve_first `)
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
	return LoanApprove.findOne({
		where: {
			id: id
		}
	});
};

/**根据贷款ID查询*/
export async function findByLoanId (loanId) {
	return await sequelize
		.query(`SELECT * FROM jd_loan_approve_first where loan_id = ?`, 
			{ replacements: [loanId], model: LoanApprove })
}

/**
 * 添加 or 修改
**/
export function insertOrUpdate (loan){
	if (loan && loan.id) {
		return LoanApprove.findById(loan.id)
			.then((p)=>{
				return p.update(loan);
			});
	} else {
		return LoanApprove.create(loan);
	}
};

/**
 * 删除
**/
export function deleteLoan (_id){
	return LoanApprove.destroy({
		where: {
			id: _id
		}
	});
};

/**
 * 提交终审审批
**/
export async function submitToEndApprove (appId, loanId,userName){
	// 更新进价状态为： 提交到终审
	var loan = await Loan.findById(loanId)
	var _loan = JSON.parse(JSON.stringify(loan));
	_loan.status = LoanStatus.TO_APPROVE_END;
	loan.update(_loan);
	// 更新初审状态
	var app = await LoanApprove.findById(appId);
	var _app = JSON.parse(JSON.stringify(app));
	_app.result = LoanStatus.PASS;
	app.update(_app);

	var loanApp = await models.sequelize.query(`SELECT * FROM jd_loan_approve_end where loan_id = ?`, 
	{ replacements: [loanId], model: LoanApproveEnd })
	if (loanApp && loanApp.length > 0) {
		var Approve = await LoanApproveEnd.findById(loanApp[0].id);
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
		return LoanApproveEnd.create(obj);
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
		loan.status = LoanStatus.APPROVE_FIRST_REJECT; //初审拒绝
		p.update(loan);
	});
	return LoanApprove.findById(appId)
	.then((p)=>{
		var approveFist = JSON.parse(JSON.stringify(p));
		approveFist.result = 'reject';
		approveFist.content = reason;
		return p.update(approveFist);
	});
}

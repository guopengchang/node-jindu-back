'use strict';
import logger from '../util/logger';
import errorMessages from '../../config/error.messages';
import * as loanFirstService from '../services/app.first.service';
import LoanStatus from '../util/status.loan';

const operations = {
	/**分页查询*/
	list: function(req, resp){
		let {pageNo, pageSize, name} = req.query;
		if (req.query && pageSize) {
			pageNo = pageNo - 1;
			loanFirstService
				.findAll(pageNo, pageSize, name)
				.then((data)=>{
					LoanStatus.RESULT.data = {};
					LoanStatus.RESULT.data.data = data;
					resp.status(200).json(LoanStatus.RESULT);
				})
				.catch(msg=>{
					resp.status(404).send(errorMessages.SERVER_ERROR);
				})
		} else {
			resp.status(200).json({});
		}
	},
	/**查询单个*/
	get: function(req, resp){
		const userName = req.params.userName;
		return loanFirstService
				.findByUserName(userName)
				.then((data)=>{
					if(data) {
						LoanStatus.RESULT.data = {};
						LoanStatus.RESULT.data.data = data;
						resp.status(200).json(LoanStatus.RESULT);
					} else {
						resp.status(404).send(errorMessages.USER_NOT_FOUND);
					}
				});
	},
	/**添加或更新*/
	createOrUpd: function(req, resp){
		const loan = req.body;
		logger.info('About to create loan ', loan);
		return loanFirstService
				.insertOrUpdate(loan)
				.then((data)=>{
					LoanStatus.RESULT.data = {status: true}
					resp.status(200).json(LoanStatus.RESULT);
				})
				.catch(msg=>{
					resp.status(404).send(errorMessages.SERVER_ERROR);
				})
	},
	/**删除*/
	delete: function(req, resp){
		const id = req.params.id;
		logger.info('About to delete loan ', id);
		return loanFirstService
				.deleteLoan(id)
				.then((affectedRows)=>{
					logger.info('rows deleted', affectedRows);
					LoanStatus.RESULT.data = {status: true}
					resp.status(200).json(LoanStatus.RESULT);
				});
	},
	/**提交到终审*/
	submitToEndApprove: function(req, resp){
		const appId = req.body.appId;
		const loanId = req.body.loanId;
		logger.info('to approve loan is ', loanId);
		return loanFirstService
			   .submitToEndApprove(appId, loanId, req.user.account)
			   .then((data)=>{
					LoanStatus.RESULT.data = {status: true}
					resp.status(200).json(LoanStatus.RESULT);
				})
				.catch(msg=>{
					resp.status(404).send(errorMessages.SERVER_ERROR);
				})
	},
	/**拒绝*/
	reject: function(req, resp){
		const loanId = req.body.loanId;
		const appId = req.body.appId;
		const reason = null;
		logger.info('to approve loan is ', loanId,' approve id:', appId);
		return loanFirstService
			   .reject(appId, loanId, reason, "admin")
			   .then((data)=>{
					LoanStatus.RESULT.data = {status: true}
					resp.status(200).json(LoanStatus.RESULT);
				})
				.catch(msg=>{
					resp.status(404).send(errorMessages.SERVER_ERROR);
				})
	}

}

export default operations;

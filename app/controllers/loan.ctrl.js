'use strict';
import logger from '../util/logger';
import errorMessages from '../../config/error.messages';
import * as loanService from '../services/loan.service';
import LoanStatus from '../util/status.loan';

const operations = {
	/**分页查询*/
	list: function(req, resp){
		let {pageNo, pageSize, name} = req.query;
		if (req.query && pageSize) {
			pageNo = pageNo - 1;
			loanService
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
	/**查询单个贷款*/
	query: function(req, resp){
		const id = req.query.id;
		return loanService
				.findById(id)
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
	/**添加或更新贷款*/
	createOrUpd: function(req, resp){
		const loan = req.body;
		logger.info('About to create loan ', loan);
		return loanService
				.insertOrUpdate(loan)
				.then((data)=>{
					LoanStatus.RESULT.data = {status: true}
					resp.status(200).json(LoanStatus.RESULT);
				})
				.catch(msg=>{
					resp.status(404).send(errorMessages.SERVER_ERROR);
				})
	},
	/**删除贷款*/
	delete: function(req, resp){
		const id = req.params.id;
		logger.info('About to delete loan ', id);
		return loanService
				.deleteLoan(id)
				.then((affectedRows)=>{
					logger.info('rows deleted', affectedRows);
					LoanStatus.RESULT.data = {status: true}
					resp.status(200).json(LoanStatus.RESULT);
				});
	},
	/**提交到初审*/
	submitToApprove: function(req, resp){
		const loanId = req.body.id;
		logger.info('to approve loan is ', loanId);
		return loanService
			   .submitToApprove(loanId, req.user.account)
			   .then((data)=>{
					LoanStatus.RESULT.data = {status: true}
					resp.status(200).json(LoanStatus.RESULT);
				})
				.catch(msg=>{
					console.log(msg)
					resp.status(404).send(errorMessages.SERVER_ERROR);
				})
	}

}

export default operations;

'use strict';
const path = require('path')
import logger from '../util/logger';
import errorMessages from '../../config/error.messages';
import * as contractService from '../services/contract.service';
import LoanStatus from '../util/status.loan';

const operations = {
	/**分页查询*/
	list: function(req, resp){
		let {pageNo, pageSize, name} = req.query;
		if (req.query && pageSize) {
			pageNo = pageNo - 1;
			contractService
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
	/**添加或更新*/
	createOrUpd: function(req, resp){
		const loan = req.body;
		logger.info('About to create loan ', loan);
		return contractService
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
		logger.info('About to delete contract ', id);
		return contractService
				.deleteContract(id)
				.then((affectedRows)=>{
					logger.info('rows deleted', affectedRows);
					LoanStatus.RESULT.data = {status: true}
					resp.status(200).json(LoanStatus.RESULT);
				});
	},
	/**生成合同文件*/
	createContractFile: function(req, resp){
		const constractId = req.body.id;
		logger.info('to contract is ', constractId);
		return contractService
			   .createContractFile(constractId)
			   .then((data)=>{
					LoanStatus.RESULT.data = {status: true}
					resp.status(200).json(LoanStatus.RESULT);
				})
				.catch(msg=>{
					logger.info(msg)
					resp.status(404).send(errorMessages.SERVER_ERROR);
				})
	},
	/**下载合同*/
	downloadFile: function(req, resp) {
		const constractId = req.query.id;
		return contractService
			   .findById(constractId)
			   .then((data)=>{
					LoanStatus.RESULT.data = {url: "/static/" + data.file_path}
					resp.status(200).json(LoanStatus.RESULT);
				})
				.catch(msg=>{
					resp.status(404).send(errorMessages.SERVER_ERROR);
				})
	}

}


export default operations;

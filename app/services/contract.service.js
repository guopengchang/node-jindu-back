'use strict';

const models = require('../models');
const Contract = models.jd_contract;
const fs = require('fs');
import logger from '../util/logger';
const officegen = require('officegen');
const docx  = officegen ('docx');

/**
 * 合同分页查询所有贷款记录
**/
export async function findAll (pageNo, pageSize, title){
	let limit = pageSize;         //读取行数
	let offset = pageNo*pageSize; //读取开始行
	let result = {};
	if (title) {
		var d = await models.sequelize
			.query(`SELECT * from jd_contract where title like ? order by id desc LIMIT ${offset},${limit} `, 
			{replacements: ['%'+title+'%'], model: Contract})
		result.data = d;
		d = await models.sequelize
			.query(`SELECT count(*) num from jd_contract where title like ? `, 
			{replacements: ['%'+title+'%']})
		if (d && d.length > 0) {
			result.rows = d[0][0].num;
			result.pages = Math.ceil(d[0][0].num/pageSize);
		}
		
	} else {
		var d = await Contract.findAll({
			limit: Number(limit),
			offset: Number(offset),
			order: [
				['id', 'DESC']
			]
		});
		result.data = d;
		d = await models.sequelize
			.query(`SELECT count(*) num from jd_contract `)
		if (d && d.length > 0) {
			result.rows = d[0][0].num;
			result.pages = Math.ceil(d[0][0].num/pageSize);
		}
	}
	return result;
};

/**
 * 添加 or 修改
**/
export function insertOrUpdate (contract){
	if (contract && contract.id) {
		return Contract.findById(contract.id)
			.then((p)=>{
				return p.update(contract);
			});
	} else {
		return Contract.create(contract);
	}
};

/**
 * 删除
**/
export function deleteContract (_id){
	return Contract.destroy({
		where: {
			id: _id
		}
	});
};

/**
 * 生成合同
**/
export function createContractFile (contractId){
	
	return Contract.findById(contractId)
	.then((p)=>{
		var contract = JSON.parse(JSON.stringify(p));
		
		var time = new Date().getTime()
		var file = `./files/${time}.docx`
		var filename = `${time}.docx`

		//生成word
		createWord(contract.loan_name, file)

		logger.info("create file success.", file)
		contract.file_path = filename;
		return p.update(contract);
	});
}

/**
 * 下载合同
**/
export function findById (contractId){
	return Contract.findById(contractId)
}

function createWord(name, file){
	logger.info('create file start.')
	var pObj = docx.createP();
	pObj.options.align = 'center';
	pObj.addText("借款合同", {font_size:20,font_face:'KaiTi_GB2312'});

	pObj = docx.createP();
	pObj.addText("甲方(出借方)： XXX有限公司");
	pObj = docx.createP();
	pObj.addText("通讯地址：________________");
	pObj = docx.createP();
	pObj.addText("联系电话：________________");
	pObj = docx.createP();
	pObj.addText(`乙方(借款人)： ${name}`);
	pObj = docx.createP();
	pObj.addText("通讯地址：________________");
	pObj = docx.createP();
	pObj.addText("联系电话：________________");
	pObj = docx.createP();
	pObj.addText("鉴于乙方经营需要，向甲方申请贷款作为小额存款借资，双方经协商一致同意，");
	pObj.addText("由甲方提供双方商定的贷款给一方。");
	pObj = docx.createP();
	pObj.addText("为此，甲、乙二方根据相关法律、法规和规章制度，经协商一致特订立本合同：");
	pObj = docx.createP();
	pObj.addText("第一条 签订合同依据");
	pObj = docx.createP();
	pObj.addText("《中华人民共和国法通则》、《中华人民共和国合同法》、《中华人民共和");
	pObj.addText("国担保法》等法律、法规和规章制度。");
	pObj = docx.createP();
	pObj.addText("第二条 当事人各方本着平等自愿、诚实信用的原则，经协商一致，签订本合同。");
	pObj = docx.createP();
	pObj.addText("第三条 本合同包括借款、保证等内容。");
	pObj = docx.createP();
	pObj.addText("第四条 借款金额：");
	pObj = docx.createP();
	pObj.addText("乙方向甲方借款人民币___________元整。");
	pObj = docx.createP();
	pObj.addText("第五条 借款期限");
	pObj = docx.createP();
	pObj.addText("本合同约定借款期限从 __date__ 到 ___年__月__日_止。");
	pObj = docx.createP();
	pObj.addText("第六条 借款利率");
	pObj = docx.createP();
	pObj.addText("1、本合同经各方约定，借款月利率为______%。");
	pObj = docx.createP();
	pObj.addText("2、利息支付：本借款合同利息按季交纳，乙方应于每三个月末准时交付甲方。");
	pObj = docx.createP();
	pObj.addText("第七条 还款");
	pObj = docx.createP();
	pObj.addText("1、乙方在本合同期限内，可以一次性全部或部分归还借款利息；");
	pObj = docx.createP();
	pObj.addText("2、在本合同到期时，乙方必须以货币方式一次性按时归还合同借款的全部本金及利息。");
	pObj = docx.createP();
	pObj.addText("第八条 合同生效");
	pObj = docx.createP();
	pObj.addText("本合同经甲、乙二方签章，并由甲方将本合同约定的借款金额划入乙方提供的账号后即生效。");
	pObj = docx.createP();
	pObj.addText("第九条 本合同一式三份，甲、乙及见证机关各一份。");
	pObj = docx.createP();
	pObj.addText("甲方签字(盖章)：");
	pObj = docx.createP();
	pObj.addText("授权代理人(签字)：");
	pObj = docx.createP();
	pObj.addText("乙方(盖章)：");
	pObj = docx.createP();
	pObj.addText("授权代理人(签字)：");
	pObj = docx.createP();
	pObj.addText("见证机关(公章)：");
	pObj = docx.createP();
	pObj.addText("见证人员(签字)：");


	var out  = fs.createWriteStream (file);// 文件写入
	out.on ( 'error', function ( err ) {
		logger.error( err );
	});
	docx.generate (out);// 服务端生成word
	logger.info('create file end.', file)
}

'use strict';

import models from '../models';
const User = models.jd_user;
const Role = models.jd_role;
const UserRole = models.jd_user_role;
const Module = models.jd_module;
const ModuleRole = models.jd_role_module;

/**
 * Find all users
 *
**/
export async function findAll (){
	var d = await models.sequelize
		.query(`SELECT u.account, u.password, u.reg_time, u.creator, r.role_name 
		from jd_user u left join jd_user_role ur on u.id=ur.user_id 
		left join jd_role r on r.id=ur.role_id order by u.id desc `, 
		{model: User})
	return d;
};

/**
 * 根据账号密码查找
**/
export function findByAccountPwd (account,pwd){
	return User.findOne({
		where: {
			account: account,
			password: pwd
		}
	});
};

/**根据用户id查找角色*/
export async function findRoleByUId (uid) {
	var userRole = await UserRole.findOne({
						where: {
							user_id: uid
						}
					})
	var role = await Role.findOne({
			where: {
				id: userRole.role_id
			}
		})
	return role
}

/**根据角色id查找模块  未使用*/
export async function findModulesByRId_ (rid) {
	var moduleRole = await ModuleRole.findAll({
		                attributes:['id'],
						where: {
							role_id: rid
						}
					})
	var ids = moduleRole.map(m => m.id);
	console.log(ids)
	var modules = await Module.findAll({
			where: {
				id: {
					$in: ids
				}
			}
		})
		//console.log(modules)
	return modules
}

/**
 * 通过名称查询用户
**/
export function findByUserName (userName){
	return User.findOne({
		where: {
			userName: userName
		}
	});
};
/**
 * 创建用户和角色
**/
export async function createUserAndRole (user, creator) {
	
	user.creator = creator;
	user.reg_time = new Date();
	user.created = new Date();
	var u = await User.create(user);
	var role = {
		role_id: user.role_id,
		user_id: u.id
	}
	return UserRole.create(role);
};

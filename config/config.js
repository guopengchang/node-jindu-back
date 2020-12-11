'use strict';

/**
 * Module dependencies.
 */

const config =  {
	timezone: "+08:00",
	port: process.env.PORT || 5003,
	db: {
		database: 'jindu_loan',
		username: 'root',
		password: 'root',
		host: 'localhost',
		port: 3306,
		timezone: "+08:00",
        dialect: 'mysql',   //方言
        define: {// Sequelize Unknown column '*.createdAt' in 'field list'
	        timestamps: false
	    }
	}
};
export default config;
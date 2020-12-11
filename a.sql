DROP TABLE IF EXISTS `jd_role`;
CREATE TABLE `jd_role`
(
	`id`           INT           NOT NULL AUTO_INCREMENT      COMMENT '角色id',
	`role_name`    VARCHAR(50)   NOT NULL                     COMMENT '角色名称',
	`role_dsc`     VARCHAR(500)  NOT NULL                     COMMENT '角色描述',
	`creator`      VARCHAR(10)   DEFAULT NULL                 COMMENT '创建人',
	`created`      DATETIME(0)   DEFAULT CURRENT_TIMESTAMP    COMMENT '创建时间',
	`modified`     DATETIME(0)   DEFAULT NULL                 COMMENT '修改时间',
	CONSTRAINT `PK_jd_role` PRIMARY KEY (`id`)
) COMMENT='角色表'
;

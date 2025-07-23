# MYSQL基础SQL
### 登录数据
```bash
# 登录数据库
mysql -u root -p root
```
### 创建、授权和删除用户
```sql
# 创建用户和授权
# 创建用户（本地登录）
CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'password123';

# 创建用户（远程登录）
CREATE USER 'testuser'@'%' IDENTIFIED BY 'password123';

# 授权某个数据库的所有权限给用户
GRANT ALL PRIVILEGES ON demo.* TO 'testuser'@'%';

# 刷新权限（每次授权后建议执行）
FLUSH PRIVILEGES;

# 查看所有用户
SELECT User, Host FROM mysql.user;

# 删除用户
DROP USER 'testuser'@'%';
```
### 基础SQL操作
```sql
# 登录成功后常用基础操作命令
# 查看当前用户
SELECT USER();

# 查看当前数据库
SELECT DATABASE();

# 切换数据库
USE demo;

# 查看当前数据库所有表
SHOW TABLES;

# 查看表结构
DESC 表名;
SHOW COLUMNS FROM 表名;

# 创建表（示例）
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  email VARCHAR(100)
);

# 插入数据
INSERT INTO user (name, email) VALUES ('张三', 'zhangsan@example.com');

# 查询数据
SELECT * FROM user;

# 更新数据
UPDATE user SET email = 'zhangsan@new.com' WHERE name = '张三';

# 删除数据
DELETE FROM user WHERE name = '张三';
```
# MYSQL基础SQL
### 登录数据
```bash
# 登录数据库
mysql -u root -p root
```
### 创建、授权和删除用户
```sql
# 创建用户和授权
# 创建用户（本地登录）
CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'password123';

# 创建用户（远程登录）
CREATE USER 'testuser'@'%' IDENTIFIED BY 'password123';

# 授权某个数据库的所有权限给用户
GRANT ALL PRIVILEGES ON demo.* TO 'testuser'@'%';

# 刷新权限（每次授权后建议执行）
FLUSH PRIVILEGES;

# 查看所有用户
SELECT User, Host FROM mysql.user;

# 删除用户
DROP USER 'testuser'@'%';
```
### 基础SQL操作
```sql
# 登录成功后常用基础操作命令
# 查看当前用户
SELECT USER();

# 查看当前数据库
SELECT DATABASE();

# 切换数据库
USE demo;

# 查看当前数据库所有表
SHOW TABLES;

# 查看表结构
DESC 表名;
SHOW COLUMNS FROM 表名;

# 创建表（示例）
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  email VARCHAR(100)
);

# 插入数据
INSERT INTO user (name, email) VALUES ('张三', 'zhangsan@example.com');

# 查询数据
SELECT * FROM user;

# 更新数据
UPDATE user SET email = 'zhangsan@new.com' WHERE name = '张三';

# 删除数据
DELETE FROM user WHERE name = '张三';
```
### 通过dump导入/导出数据

```bash
# 使用mysqldump导出数据库

# 导出整个数据库
mysqldump -u root -p demo > demo.sql

# 导出某个表
mysqldump -u root -p demo user > user.sql

# 导出结构不导数据
mysqldump -u root -p -d demo > demo_structure.sql

# 使用source命令导入SQL文件（登录mysql后执行）
mysql -u root -p demo
source /path/to/demo.sql;

# 或者直接通过命令导入
mysql -u root -p demo < demo.sql
```



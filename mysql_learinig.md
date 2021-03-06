#### 连接到本机上的MYSQL。进入mysql\bin		
-	`mysql -u user_name -p` 结尾没有`;`
-  `select user();`	 查看当前用户
- `mysql -u root -P3307 -p` 连接端口号为3307的mysql


#### 创建数据库
- 查看已有database 
	`show databases;`

- 创建新的数据库:
`create database db_name;`

- 修改数据库:    
` alter database db_name charset=utf8 //将数据库字符编码改为utf8`

- 删除数据库
` drop database [if exists] db_name; `

- 使用数据库 
	`use db_name;`

- 查看当前使用的数据库	
	`select database();`	

- 查看该数据库下的表
	`show tables;`



#### 数据表操作
- 创建表	
```sql 
	create table user1(
		id int not null auto_increment primary key,
		username VARCHAR(50) NOT NULL unique key,
		gender enum('1','2','3') default '3' not null
	)engine=innodb auto_increment=1 default charset=utf8;
```

-  查看创建表的命令 ` show create table tb_name; `


- 删除数据表
`drop table tb_name;` 

- 更改数据表名	
` rename table users1 to users2 ` 

- 删除表内容(全部)	
` delete from tb_name; `

- 查看表结构	
`desc tb_name;`

- 更新数据表结构
> 添加单列	` alter table user1 add pwd varchar(20) not null default '123' `
> 添加多列 	` alter table tb_name add (col_name1 col_defination,col2 col_defignation ) `
> 删除单/多列 `alter table tb_name drop col_name1, drop col_name2 ;`
> 更新列	` alter table users1 alter pwd set defalut '456' `
> **更新列**	` alter table users1 modify pwd varchar(20) not null unsigned default '789' 	//只改变属性`	
>**更新列** 	` alter table users1 change pwd password varchar(10) not null unsigned default 'abc' 	//同时改变列名字和属性`



- 查看表内容
`select * from table_name;`


- 插入数据  
```sql
	// 单表插入
	insert table_name values( , , ,);	
	insert table_name(id,name) values('id','name');
	
	//	将一张表的查询结果写入另一张表
	INSERT test(username) SELECT username FROM users WHERE age>=100;  // 将user表中age>=100的username插入到test表中

	INSERT tdb_goods_cates(cate_name) SELECT goods_cate FROM tdb_goods GROUP BY goods_cate;

```  

- 更新数据(单表更新)
```sql	 
	UPDATE users SET age = age+10;		// 所有记录的age+10
	UPDATE users SET age = age+100 WHERE id % 2 = 0;	//id是偶数的记录age+10 
```

- 多表更新
	```sql
		// 将表tdb_goods中的goods_cate 设置为 表tdb_goods_cates中的cate_id
		UPDATE tdb_goods INNER JOIN tdb_goods_cates ON goods_cate = cate_name SET goods_cate = cate_id;
		
		// 使用别名防brand_name混淆
		UPDATE tdb_goods AS g INNER JOIN tdb_goods_brands AS b ON g.brand_name = b.brand_name SET g.brand_name = b.brand_id;

		// 数据改变但是数据表结构未变; 使用ALTER ... CHANGE语句改变表结构
		alter table tdb_goods
    	change goods_cate cate_id smallint unsigned not null,
    	change brand_name brand_id smallint unsigned not null;
		
		// 创建新表并插入数据
		create table tdb_goods_brands(    
			brand_id smallint unsigned primary key auto_increment,
			brand_name varchar(40) not null 
		)engine = innodb default charset=utf8  
		select brand_name from tdb_goods group by brand_name; 	//将查询的结果插入新表中


		// 查询数据插入另一表
		INSERT tdb_goods_cates(cate_name) SELECT g.goods_cate FROM tdb_goods AS g GROUP BY g.goods_cate;

	```



- 删除数据(单表删除)
```sql
	DELETE FROM users;	//删除所有记录
	DELETE FROM users WHERE id = 3;	//删除id为3的记录

```
- 删除unique key	
` ALTER TABLE tb_name DROP INDEX col_name`

- ##### 查询记录
	- 一般查询
	> 
	```sql
		SELECT id,username FROM users;	//只查询显示users表中的id,username
		SELECT users.id,users.username FROM users;	//用于连表查询
		SELECT id AS u_id, username AS u_name FROM users; //查询结果使用别名显示

		// 分组
		SELECT sex FROM users GROUP BY sex;		// 根据sex进行分组

		// 排序
		SELECT * FROM users ORDER BY id DESC; 	//根据id降序排列,asc为升序
		SELECT * FROM users ORDER BY age DESC, id ASC; // 根据age降序,如果age相同,根据id升序排列
		
		// 限制数量 limit
		SELECT * FROM users LIMIT 2; //返回2条记录

	``` 
	- 子查询
	> 指出现在其他SQL语句内的`SELECT`语句
	``` sql
		// 使用比较运算符的子查询
		SELECT ROUND(AVG(goods_price),2) FROM tdb_goods;	//对表tdb_goods中的goods_price求平均值,保留2位小数;		

		//子查询>=
		SELECT goods_id,goods_name,goods_price FROM tdb_goods WHERE goods_price >= (SELECT round(avg(goods_price),2) FROM tdb_goods); 

	```
	
	

- 连接的语法结构
> ` table_a {[INNER|CROSS] JOIN | {LEFT|RIGHT} JOIN} table_reference ON conditional_expr `
	-	连接类型
	``` 
		// 内连接 仅显示符合连接条件的记录(两表的交集)-较为常用
		INNER JOIN	//  等价于(JOIN;CROSS_JOIN)

		// 左外连接 显示左表全部和右表中符合条件的记录
		LEFT [OUTER] JOIN 

		// 右外连接 显示右表全部和左表中符合条件的记录
		RIGHT [OUTER] JOIN 

		// 三表连查
		// 其中brand_name 在表tdb_goods_brands中
		// cate_name 在表tbd_goods_cates 中
		// INNER JOIN 连接处无符号分隔
		SELECT goods_name, goods_price,brand_name,cate_name FROM tdb_goods AS g
		INNER JOIN tdb_goods_brands AS b ON g.brand_id = b.brand_id
		INNER JOIN tdb_goods_cates AS c ON g.cate_id = c.cate_id;

	```

#### MySQL函数
-------------------
- 字符函数
	-  `CONCAT() CONCAT_WS()` 字符连接
	```sql
		// 连接 str_A str_B
		SELECT CONCAT('str_A','str_B');
		
		// 将表tb_62中的first_name 和 last_name 用' '连接,作为full_name 输出;
		// ' '中可多个空格
		SELECT CONCAT(first_name,' ',last_name) AS full_name FROM tb_62;

		// 将 A B C D 以 - 连接
		SELECT CONCAT_WS('-','A','B','C','D');
	```
	- `FORMAT()`  数字格式化 返回的是**字符类型**
	```sql
		SELECT FORMAT(1234.345,1);	// 小数保留一位
	```
	
	-  `LOWER() UPPER()` 大小写转换

	-	 `LEFT() RIGHT()` 左/右截取
	```sql 
		SELECT LEFT('ABCD',2);	// => AB 

		SELECT RIGHT('ABCD',2); // => CD
	``` 
	
	-  `LENGTH()` 返回字符串长度 **空格计算在内**

	- `TRIM()`  删除前后空格
		`LTRIM()` 删除前导空格
		`RTRIM()` 删除后导空格

	```sql 
		//删除前后特殊字符
		SELECT TRIM(BOTH '?' FROM '??MySQL???'); // =>MySQL

		SELECT TRIM(LEADING '?' FROM '??MySQL???'); // =>MySQL???

		SELECT TRIM(TRAILING '?' FROM '??MySQL???'); // =>??MySQL
	```

	- `REPLACE()` 字符串替换
	```sql 
		SELECT REPLACE('??MySQL???','?','-');	//=>--MySQL---

		SELECT REPLACE('??MySQL???','?','-+');	//=>-+-+MySQL-+-+-+
	```

	- `SUBSTRING()` 字符串截取, **字符串从1开始计数**
	```sql 

		SELECT SUBSTRING('MySQL',1,2);  // =>My
		SELECT SUBSTRING('MySQL',3);  // =>SQL

	```

	- `	[NOT] LIKE() `  
	```sql 
		SELECT * FROM tb_62 WHERE first_name LIKE '%c%'
	```


- 数值函数
	- `CEIL()`  进一取整
	- `FLOOR()` 舍一取整
	- `ROUND()` 四舍五入
	- `DIV()` 整数除法 `select 4 div 2 `
	- `MOD()` 取模

- 时间日期函数
	- `NOW()` 当前日期 时间
	- `CURTIME` 当前时间
	- `CURDATE` 当前日期

- 加密函数
	-	`MD5()` 

	- `PASSWORD()` 修改本地数据库密码
	```mysql 
		set password = password('123456')
	```



#### 存储引擎(表类型) 
- myisam 256TB 支持索引 表锁 数据压缩
- innodb 64TB 支持事务处理 外键约束 索引 行锁
> 事务处理 多条mysql语句,一条不成功,其他回滚 


#### 约束	
- 非空约束 ` NOT NULL`
- 主键约束 ` PRIMARY KEY `
- 唯一约束 ` UNIQUE KEY ` 
- 默认约束 ` DEFAULT `
- 外键约束 ` FOREIGN KEY ` 	` foreign key (pid) references father_tb(id) ` 	**高并发避免外键约束**

	- 保持数据一致性,完整性,实现一对一或一对多关系(关系性数据库)
	-	要求:
	-	禁止使用临时表;	
	-	存储引擎只能是InnoDB;	
	-	外键列和参照列必须具有相似的数据类型,其中数字的长度或是否有符号位必须相同;字符的长度则可以不同;
	-	外键列和参照列必须创建索引,若外键列不存在索引,mysql将自动创建

- 外键约束的参照操作(物理)
	-	`foreign key (pid) references provinces(id) ON DELETE CASCADE ` 	
	>	跟随父表删除或更新; 
	-	`foreign key (pid) references provinces(id) ON DELETE SET NULL `
	>	父表删除或更新行;子表相应列设为`NULL`;前提子表相应列没有指定**NOT NULL**
	- ` ... ON DELETE RESTRICT ` 
	>	拒绝对父表的删除或更新操作;





======================================================================================

首先打开DOS窗口，然后进入目录，再键入命令mysql -u root -p，回车后提示你输密码.注意用户名前可以有空格也可以没有空格，但是密码前必须没有空格，否则让你重新输入密码。

1、连接Mysql(非本机)
格式： mysql -h主机地址 -u用户名 －p用户密码

如果刚安装好MYSQL，超级用户root是没有密码的，故直接回车即可进入到MYSQL中了，MYSQL的提示符是： mysql>

2、连接到远程主机上的MYSQL。假设远程主机的IP为：110.110.110.110，用户名为root,密码为abcd123。则键入以下命令：
		mysql -h110.110.110.110 -u root -p 123;（注:u与root之间可以不用加空格，其它也一样）

3、退出MYSQL命令： exit （回车）
 
2、修改密码
格式：mysqladmin -u用户名 -p旧密码 password 新密码

1、给root加个密码ab12。
首先在DOS下进入目录mysql\bin，然后键入以下命令
		mysqladmin -u root -password ab12
注：因为开始时root没有密码，所以-p旧密码一项就可以省略了。

2、再将root的密码改为djg345。
		mysqladmin -u root -p ab12 password djg345
3、增加新用户
注意：和上面不同，下面的因为是MYSQL环境中的命令，所以后面都带一个分号作为命令结束符

格式：grant select on 数据库.* to 用户名@登录主机 identified by “密码”

1、增加一个用户test1密码为abc，让他可以在任何主机上登录，并对所有数据库有查询、插入、修改、删除的权限。首先用root用户连入MYSQL，然后键入以下命令：
		grant select,insert,update,delete on *.* to [email=test1@”%]test1@”%[/email]” Identified by “abc”;

但增加的用户是十分危险的，你想如某个人知道test1的密码，那么他就可以在internet上的任何一台电脑上登录你的mysql数据库并对你的数据可以为所欲为了，解决办法见2。

2、增加一个用户test2密码为abc,让他只可以在localhost上登录，并可以对数据库mydb进行查询、插入、修改、删除的操作（localhost指本地主机，即MYSQL数据库所在的那台主机），这样用户即使用知道test2的密码，他也无法从internet上直接访问数据库，只能通过MYSQL主机上的web页来访问了。
		grant select,insert,update,delete on mydb.* to [email=test2@localhost]test2@localhost[/email] identified by “abc”;

如果你不想test2有密码，可以再打一个命令将密码消掉。
		grant select,insert,update,delete on mydb.* to [email=test2@localhost]test2@localhost[/email] identified by “”;
 
4.1 创建数据库
注意：创建数据库之前要先连接Mysql服务器

命令：create database <数据库名>

例1：建立一个名为xhkdb的数据库
	 mysql> create database xhkdb;

例2：创建数据库并分配用户

①CREATE DATABASE 数据库名;

②GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP,ALTER ON 数据库名.* TO 数据库名@localhost IDENTIFIED BY '密码';

③SET PASSWORD FOR '数据库名'@'localhost' = OLD_PASSWORD('密码');

依次执行3个命令完成数据库创建。注意：中文 “密码”和“数据库”是户自己需要设置的。
4.2 显示数据库
命令：show databases （注意：最后有个s）
mysql> show databases;

注意：为了不再显示的时候乱码，要修改数据库默认编码。以下以GBK编码页面为例进行说明：

1、修改MYSQL的配置文件：my.ini里面修改default-character-set=gbk
2、代码运行时修改：
	 ①Java代码：jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=gbk
	 ②PHP代码：header("Content-Type:text/html;charset=gb2312");
	 ③C语言代码：int mysql_set_character_set( MYSQL * mysql, char * csname)；
该函数用于为当前连接设置默认的字符集。字符串csname指定了1个有效的字符集名称。连接校对成为字符集的默认校对。该函数的工作方式与SET NAMES语句类似，但它还能设置mysql- > charset的值，从而影响了由mysql_real_escape_string() 设置的字符集。
4.3 删除数据库
命令：drop database <数据库名>
例如：删除名为 xhkdb的数据库
mysql> drop database xhkdb;

例子1：删除一个已经确定存在的数据库
	 mysql> drop database drop_database;
	 Query OK, 0 rows affected (0.00 sec)

例子2：删除一个不确定存在的数据库
	 mysql> drop database drop_database;
	 ERROR 1008 (HY000): Can't drop database 'drop_database'; database doesn't exist
			//发生错误，不能删除'drop_database'数据库，该数据库不存在。
	 mysql> drop database if exists drop_database;
	 Query OK, 0 rows affected, 1 warning (0.00 sec)//产生一个警告说明此数据库不存在
	 mysql> create database drop_database;
	 Query OK, 1 row affected (0.00 sec)
	 mysql> drop database if exists drop_database;//if exists 判断数据库是否存在，不存在也不产生错误
	 Query OK, 0 rows affected (0.00 sec)
4.4 连接数据库
命令： use <数据库名>

例如：如果xhkdb数据库存在，尝试存取它：
	 mysql> use xhkdb;
屏幕提示：Database changed

use 语句可以通告MySQL把db_name数据库作为默认（当前）数据库使用，用于后续语句。该数据库保持为默认数据库，直到语段的结尾，或者直到发布一个不同的USE语句：
	 mysql> USE db1;
	 mysql> SELECT COUNT(*) FROM mytable;   # selects from db1.mytable
	 mysql> USE db2;
	 mysql> SELECT COUNT(*) FROM mytable;   # selects from db2.mytable

使用USE语句为一个特定的当前的数据库做标记，不会阻碍您访问其它数据库中的表。下面的例子可以从db1数据库访问作者表，并从db2数据库访问编辑表：
	 mysql> USE db1;
	 mysql> SELECT author_name,editor_name FROM author,db2.editor
			 ->        WHERE author.editor_id = db2.editor.editor_id;

USE语句被设立出来，用于与Sybase相兼容。

有些网友问到，连接以后怎么退出。其实，不用退出来，use 数据库后，使用show databases就能查询所有数据库，如果想跳到其他数据库，用
	 use 其他数据库名字
就可以了。
4.5 当前选择的数据库
命令：mysql> select database();

MySQL中SELECT命令类似于其他编程语言里的print或者write，你可以用它来显示一个字符串、数字、数学表达式的结果等等。如何使用MySQL中SELECT命令的特殊功能？

1.显示MYSQL的版本
mysql> select version(); 
+-----------------------+ 
| version()             | 
+-----------------------+ 
| 6.0.4-alpha-community | 
+-----------------------+ 
1 row in set (0.02 sec) 

2. 显示当前时间
mysql> select now(); 
+---------------------+ 
| now()               | 
+---------------------+ 
| 2009-09-15 22:35:32 | 
+---------------------+ 
1 row in set (0.04 sec) 

3. 显示年月日
SELECT DAYOFMONTH(CURRENT_DATE); 
+--------------------------+ 
| DAYOFMONTH(CURRENT_DATE) | 
+--------------------------+ 
|                       15 | 
+--------------------------+ 
1 row in set (0.01 sec) 
	
SELECT MONTH(CURRENT_DATE); 
+---------------------+ 
| MONTH(CURRENT_DATE) | 
+---------------------+ 
|                   9 | 
+---------------------+ 
1 row in set (0.00 sec) 
	
SELECT YEAR(CURRENT_DATE); 
+--------------------+ 
| YEAR(CURRENT_DATE) | 
+--------------------+ 
|               2009 | 
+--------------------+ 
1 row in set (0.00 sec) 

4. 显示字符串
mysql> SELECT "welecome to my blog!"; 
+----------------------+ 
| welecome to my blog! | 
+----------------------+ 
| welecome to my blog! | 
+----------------------+ 
1 row in set (0.00 sec) 

5. 当计算器用
select ((4 * 4) / 10 ) + 25; 
+----------------------+ 
| ((4 * 4) / 10 ) + 25 | 
+----------------------+ 
|                26.60 | 
+----------------------+ 
1 row in set (0.00 sec) 

6. 串接字符串
select CONCAT(f_name, " ", l_name) 
AS Name 
from employee_data 
where title = 'Marketing Executive'; 
+---------------+ 
| Name          | 
+---------------+ 
| Monica Sehgal | 
| Hal Simlai    | 
| Joseph Irvine | 
+---------------+ 
3 rows in set (0.00 sec) 
注意：这里用到CONCAT()函数，用来把字符串串接起来。另外，我们还用到以前学到的AS给结果列'CONCAT(f_name, " ", l_name)'起了个假名。
5.1 创建数据表
命令：create table <表名> ( <字段名1> <类型1> [,..<字段名n> <类型n>]);

例如，建立一个名为MyClass的表，
字段名	数字类型	数据宽度	是否为空	是否主键	自动增加	默认值
id	int	4	否	primary key	auto_increment	 
name	char	20	否	 	 	 
sex	int	4	否	 	 	0
degree	double	16	是	 	 	 
mysql> create table MyClass(
> id int(4) not null primary key auto_increment,
> name char(20) not null,
> sex int(4) not null default '0',
> degree double(16,2));
5.3 删除数据表
命令：drop table <表名>

例如：删除表名为 MyClass 的表
	 mysql> drop table MyClass;

DROP TABLE用于取消一个或多个表。您必须有每个表的DROP权限。所有的表数据和表定义会被取消，所以使用本语句要小心！

注意：对于一个带分区的表，DROP TABLE会永久性地取消表定义，取消各分区，并取消储存在这些分区中的所有数据。DROP TABLE还会取消与被取消的表有关联的分区定义（.par）文件。

对与不存在的表，使用IF EXISTS用于防止错误发生。当使用IF EXISTS时，对于每个不存在的表，会生成一个NOTE。

RESTRICT和CASCADE可以使分区更容易。目前，RESTRICT和CASCADE不起作用。
5.4 表插入数据
命令：insert into <表名> [( <字段名1>[,..<字段名n > ])] values ( 值1 )[, ( 值n )]

例如：往表 MyClass中插入二条记录, 这二条记录表示：编号为1的名为Tom的成绩为96.45, 编号为2 的名为Joan 的成绩为82.99， 编号为3 的名为Wang 的成绩为96.5。
	 mysql> insert into MyClass values(1,'Tom',96.45),(2,'Joan',82.99), (2,'Wang', 96.59);

注意：insert into每次只能向表中插入一条记录。
5.5 查询表中的数据
1)、查询所有行
命令： select <字段1，字段2，...> from < 表名 > where < 表达式 >
例如：查看表 MyClass 中所有数据
	 mysql> select * from MyClass;

2）、查询前几行数据
例如：查看表 MyClass 中前2行数据
mysql> select * from MyClass order by id limit 0,2;

select一般配合where使用，以查询更精确更复杂的数据。
5.6 删除表中数据
 
 
 
命令：delete from 表名 where 表达式

例如：删除表 MyClass中编号为1 的记录
mysql> delete from MyClass where id=1;

下面是一个删除数据前后表的对比。
FirstName	LastName	Age
Peter	Griffin	35
Glenn	Quagmire	33
下面以PHP代码为例删除 "Persons" 表中所有 LastName='Griffin' 的记录：
<?php 
	 $con = mysql_connect("localhost","peter","abc123"); 
	 if (!$con) 
	 {
			die('Could not connect: ' . mysql_error()); 
	 } 
	 mysql_select_db("my_db", $con); 
	 mysql_query("DELETE FROM Persons WHERE LastName='Griffin'"); mysql_close($con); 
?>
在这次删除之后，表是这样的：
FirstName	LastName	Age
Glenn	Quagmire	33

5.7 修改表中数据
语法：update 表名 set 字段=新值,… where 条件
	 mysql> update MyClass set name='Mary' where id=1;

例子1：单表的MySQL UPDATE语句：
	 UPDATE [LOW_PRIORITY] [IGNORE] tbl_name SET col_name1=expr1 [, col_name2=expr2 ...] [WHERE where_definition] [ORDER BY ...] [LIMIT row_count]

例子2：多表的UPDATE语句：
UPDATE [LOW_PRIORITY] [IGNORE] table_references SET col_name1=expr1 [, col_name2=expr2 ...] [WHERE where_definition]

UPDATE语法可以用新值更新原有表行中的各列。SET子句指示要修改哪些列和要给予哪些值。WHERE子句指定应更新哪些行。如果没有WHERE子句，则更新所有的行。如果指定了ORDER BY子句，则按照被指定的顺序对行进行更新。LIMIT子句用于给定一个限值，限制可以被更新的行的数目。
 
5.8 增加字段
命令：alter table 表名 add字段 类型 其他;
例如：在表MyClass中添加了一个字段passtest，类型为int(4)，默认值为0
	 mysql> alter table MyClass add passtest int(4) default '0'

加索引
	 mysql> alter table 表名 add index 索引名 (字段名1[，字段名2 …]);
例子： mysql> alter table employee add index emp_name (name);

加主关键字的索引
	mysql> alter table 表名 add primary key (字段名);
例子： mysql> alter table employee add primary key(id);

加唯一限制条件的索引
	 mysql> alter table 表名 add unique 索引名 (字段名);
例子： mysql> alter table employee add unique emp_name2(cardnumber);

删除某个索引
	 mysql> alter table 表名 drop index 索引名;
例子： mysql>alter table employee drop index emp_name;

增加字段：
mysql> ALTER TABLE table_name ADD field_name field_type;

修改原字段名称及类型：
mysql> ALTER TABLE table_name CHANGE old_field_name new_field_name field_type;

删除字段：
MySQL ALTER TABLE table_name DROP field_name;
5.9 修改表名
命令：rename table 原表名 to 新表名;

例如：在表MyClass名字更改为YouClass
	 mysql> rename table MyClass to YouClass;

当你执行 RENAME 时，你不能有任何锁定的表或活动的事务。你同样也必须有对原初表的 ALTER 和 DROP 权限，以及对新表的 CREATE 和 INSERT 权限。

如果在多表更名中，MySQL 遭遇到任何错误，它将对所有被更名的表进行倒退更名，将每件事物退回到最初状态。

RENAME TABLE 在 MySQL 3.23.23 中被加入。
6、备份数据库
命令在DOS的[url=file://\\mysql\\bin]\\mysql\\bin[/url]目录下执行

1.导出整个数据库
导出文件默认是存在mysql\bin目录下
		mysqldump -u 用户名 -p 数据库名 > 导出的文件名
		mysqldump -u user_name -p123456 database_name > outfile_name.sql

2.导出一个表
		mysqldump -u 用户名 -p 数据库名 表名> 导出的文件名
		mysqldump -u user_name -p database_name table_name > outfile_name.sql

3.导出一个数据库结构
		mysqldump -u user_name -p -d –add-drop-table database_name > outfile_name.sql
		-d 没有数据 –add-drop-table 在每个create语句之前增加一个drop table

4.带语言参数导出
		mysqldump -uroot -p –default-character-set=latin1 –set-charset=gbk –skip-opt database_name > outfile_name.sql

例如，将aaa库备份到文件back_aaa中：
	[root@test1 root]# cd　/home/data/mysql
	[root@test1 mysql]# mysqldump -u root -p --opt aaa > back_aaa
7.1 一个建库和建表的实例1
drop database if exists school; //如果存在SCHOOL则删除
create database school; //建立库SCHOOL
use school; //打开库SCHOOL
create table teacher //建立表TEACHER
(
		id int(3) auto_increment not null primary key,
		name char(10) not null,
		address varchar(50) default ‘深圳’,
		year date
); //建表结束

//以下为插入字段
insert into teacher values(”,’allen’,'大连一中’,'1976-10-10′);
insert into teacher values(”,’jack’,'大连二中’,'1975-12-23′);

如果你在mysql提示符键入上面的命令也可以，但不方便调试。
1、你可以将以上命令原样写入一个文本文件中，假设为school.sql，然后复制到c:\\下，并在DOS状态进入目录[url=file://\\mysql\\bin]\\mysql\\bin[/url]，然后键入以下命令：
		mysql -uroot -p密码 < c:\\school.sql
如果成功，空出一行无任何显示；如有错误，会有提示。（以上命令已经调试，你只要将//的注释去掉即可使用）。

2、或者进入命令行后使用 mysql> source c:\\school.sql; 也可以将school.sql文件导入数据库中。

7.2 一个建库和建表的实例2
drop database if exists school; //如果存在SCHOOL则删除
create database school; //建立库SCHOOL
use school; //打开库SCHOOL
create table teacher //建立表TEACHER
(
		id int(3) auto_increment not null primary key,
		name char(10) not null,
		address varchar(50) default ''深圳'',
		year date
); //建表结束

//以下为插入字段
insert into teacher values('''',''glchengang'',''深圳一中'',''1976-10-10'');
insert into teacher values('''',''jack'',''深圳一中'',''1975-12-23'');

注：在建表中
1、将ID设为长度为3的数字字段:int(3)；并让它每个记录自动加一:auto_increment；并不能为空:not null；而且让他成为主字段primary key。

2、将NAME设为长度为10的字符字段

3、将ADDRESS设为长度50的字符字段，而且缺省值为深圳。

4、将YEAR设为日期字段。
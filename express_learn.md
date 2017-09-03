### express 连接mysql
- 安装`mysql`依赖
- 建立连接池  

> 方法一

> db/config.js 

```js
	
module.exports = {
	mysql: {
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'segment2',
		port: '3306'
	}
};

```
> models/Users.js

```js

	var config = require('../db/config');
	// 创建连接池
	var pool = mysql.createPool(config.mysql);

```


> 方法二

```js
var mysql = require('mysql');
module.exports = (function () {
    //创建连接池
    var pool = mysql.createPool({
        host: 'localhost',       //主机 
        user: 'root',               //MySQL认证用户名 
        password: '',        //MySQL认证用户密码 
        database: 'segment',
        port: '3306'                   //端口号 
    });
    //初始化pool
    pool.on('connection', function (connection) {
        connection.query('SET SESSION auto_increment_increment=1');
    });
    
    return function () { //返回的唯一的一个pool 
        return pool;
    };
})();   //立即调用函数

```



### 连接池使用完成后须放回连接池

`conn.release()`;

### 事物处理
- 开始事物处理
```
	conn.beginTransaction((err)=>{
	// 错误后回滚
    if(err){
        console.log(`事务处理有错:${err}`);
        res.send('事务处理出错');
        return;
    }
```

- 提交处理  
```js
	// 都没出错,提交事务
    conn.commit(function(err) {
        if (err) {
            //提交事物出错,再次回滚
            console.log('调用回滚2');
            conn.rollback(function() {
                //throw err;
            });
            res.send('数据库错误b:'+err);
            console.log('提交事物出错');
        }
        res.send('回复成功');
        console.log('success!');
    });
```

### 前后端分离 设置代理

- 前端vue

> config/index.js

```
	proxyTable: {
      '/node': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
            '^/node' : '/',     // rewrite path (重定向路径)
        }
      }
    },
```

> api/api.js  

```
	let base = '/node';
	export const GET_CLASS = params => {  return axios.get(`${base}/goods`,{params:params}); }

```

- 后端express

> app.js  

```
	app.use('/', goods);

```

> routes/goods.js  

```
	router.get('/', function(req, res, next) {
	    Goods.getGoods(req,res);
	    // res.send('goods pages')
	});

```


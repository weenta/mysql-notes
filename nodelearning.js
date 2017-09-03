// 清除http两次请求
if(req.url !== '/favicon.ico'){
	//...
	res.end(); //结束访问
}

//输出
//funs.js
module.exports = fun; //一次只能输出一个(没有())

module.exports = { //多个输出
	fun1: function(){...},
	fun2: function() {...}
}

//引入
var funs = require('./funs'
//调用
funs.fun1();
funs.fun2();

//字符串调用
funs.['fun1']();
funs.['fun2']();


//模块调用/继承============================================================
//js apply
apply:方法能劫持另外一个对象的方法，继承另外一个对象的属性.
fun.apply(thisArg, [argsArray])

//继承user
var User = require('./user');
function student(id,age,name){
	User.apply(this,[id,age,name])
	this.study = function(res){
		res.write(`${this.name} 学习nodejs!`)
	}
}

module.exports = student;

//路由==============================================================


//文件读取-同步/异步

//异常处理
//同步
try{

}catch(err){

}

//异步

//接收参数
//get方式接收参数n10_params
	var data = url.parse(req.url,true).query;//返回一个对象
	console.log(data);
	if(data['email'] !== undefined){
		console.log(data['email']);
	}

//==post方式提交===================================================
	var post = '';
	req.on('data',function(chunk){
		post += chunk;

	});
	req.on('end',function(){
		//querystring.parse 把url字符串解析成键值对组合
		post = querystring.parse(post);
		console.log('email:'+ post['email']+"\n");
		console.log('pwd:'+ post['pwd']+"\n");
		// res.end();
	})	





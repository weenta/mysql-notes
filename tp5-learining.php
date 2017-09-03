<?php 
//配置虚拟域名
//1 apache httpd_vhosts.config
//
<VirtualHost *:80>
	ServerName o2o.com
	DocumentRoot "D:\wamp64\www\10tp5o2o\imooc_o2o\imooc_o2o-p0630\public"
</VirtualHost>

//2 c盘 system32\drivers\etc\hosts
//加入 127.0.0.1 o2o.com

//3 重启swamp
//
//======================================
//Banner接口编写流程 (controller控制器方法,model 数据查询操作)

//1 app\api\controller
use app\api\model\Banner as BannerModel;
Banner.php
public function getBanner($id){
	//通过4中的模型查询
	//get find 返回一个记录或模型对象
	//all select 返回一组
	//get all 模型特有(Db中无法使用)
	//find sellect Db所具有的(但是模型中可以用)

	//使用with('items')获取banner模型中包含banner_item中的关联数据
	$banner = BannerModel::with('items')->find($id);

}

//2 验证$id为正整数
app\api\validate
IDMustBePositiveInt.php
calss IDMustBePositiveInt extends BaseValidate
{
	//固定写法
	protected $rule = [
		'id' => 'required|isPositiveInteger'
	];

	protected function isPositiveInteger($value,$rule='',$data='',$field=''){
		if (is_numeric($value) && is_int($value + 0) && ($value + 0) > 0) {
            return true;
        }else{
        	return $field.'必须是正整数';
        }
	}
}

//3 Banner.php中添加验证
app\api\controller
	Banner.php
	public function getBanner($id){
		(new IDMustBePositiveInt())->goCheck();
	}

4 数据库查询
app\api\model
Banner.php 

namespace app\api\model;
use think\Db;
class Banner
{

	//默认Banner对应数据库的banner表;
	// protected $table = 'banner_item'; //修改对应关系(Banner对应banner_item表)

	//定义关联关系
	public function items(){
							//关联表名      关联表外键	主键	
		return $this->hasMany('BannerItem','banner_id','id');
	}	

	public static function getBannerByID($id){
		
	}
}



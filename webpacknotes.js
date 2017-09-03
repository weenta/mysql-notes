//webpack-dev-server 自动打包的文件是放在内存中,输出需npm run build

//打包分离
1 打包生成的js文件放入单独/js文件夹中-可行
2 打包生成的css文件单独放到/css文件夹中-background(url)找不到图片

3 多html页面单独打包 {
	3.1 打包的html中的img标签无法正确编译src属性,此时需要html-loader 配合url-loader(或file-loader)才能正确编译
}
4 图片打包;放入单独的img文件夹中

//打包流程

var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css独立打包 防止页面闪烁


var PATHS = {
	index:'./src/index.html',
	page:'./src/page.html',
	app:'./src/js/index.js'
}

module.exports = {
	entry: {
		app:PATHS.app,
	},
	output: {
		// filename:'[name].[hash].js',
		filename:'js/[name].[hash].js',
		path: path.resolve(__dirname,'dist'),
	},
	module:{
		rules:[
			{
				test:/\.css$/,
				exclude:/node_modules/,
				// use:['style-loader','css-loader']
				use:ExtractTextPlugin.extract({
					fallback:"style-loader",
					use:[
						{
							loader:"css-loader",
							options:{
								minimize:true

							}
						}
					]
				})
			},
			{
				test:/\.scss$/,
				exclude:/node_modules/,
				use:ExtractTextPlugin.extract({
					fallback:"style-loader",
					use:[
						{
							loader:"css-loader",
							options:{minimize:true}
							
						},
						{loader:"sass-loader"}
					]
				})
				
			},
			/*{
				test:/\.(png|svg|jpg|gif)$/,
				use:[
					{
						loader:'file-loader',	//不建议使用file-loader,使用url-loader替代
						options:{
							name:'imgs/[name].[hash:8].[ext]' //css打包入单独文件夹后url找不到对应图片
						}
					}
				]
			},*/
			{
				test:/\.(png|svg|jpg|gif)$/,
				use:[
					{
						loader:'url-loader',
						options: {
							limit: 3.1*1024, //限制编码文件大小
							name:'img/[name].[hash:7].[ext]'	//css打包如单独文件夹亦可找到对应图片
						}
					}
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename:'index.html',
			template:PATHS.index
		}),
		
		new HtmlWebpackPlugin({
			filename:'page.html',
			template:PATHS.page
		}),

		new ExtractTextPlugin({
			filename:'css/style.[chunkhash].css'
		}),
	]

}
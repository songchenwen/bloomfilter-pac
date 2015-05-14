var fs = require('fs');

var testWhite = ['www.weibo.com', 'baidu.com', 'jd.com', 'www.taobao.com', 'yhd.com'];
var testBlack = ['www.facebook.com', 'twitter.com', 'docs.google.com', 'google.com.hk', 'wordpress.com'];

var configPath = 'config.json',
	templatePath = 'template.pac',
	outPath = 'bloomfilter.pac';

var config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
eval(fs.readFileSync(outPath, 'utf8'));

testWhite = testWhite.concat(config.white);
testBlack = testBlack.concat(config.black);


function isPlainHostName(host){
	return false;
}

function testArray(array, expectedPrefix){
	for(var i = 0; i < array.length; i++){
		var item = array[i];
		var result = FindProxyForURL(item, item);
		
		if(result.indexOf(expectedPrefix) == 0){
			console.log(item + ' : ' + result);
		}else{
			throw item + ' : ' + result + ', expect prefix ' + '"' + expectedPrefix + '"'; 
		}
	}
}

testArray(testWhite, 'DIRECT');
testArray(testBlack, 'SOCKS5');

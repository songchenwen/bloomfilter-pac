var Bloomfilter = require('./lib/bloomfilter.js').BloomFilter,
	base64 = require('js-base64').Base64,
	request = require('request'),
	buildPac = require('./build-pac.js'),
    URL = require('url');

var BLOOM_FILTER_FP_RATE = 0.01;

var gfwListUrl = 'https://raw.githubusercontent.com/calfzhou/autoproxy-gfwlist/master/gfwlist.txt';

var fetchGfwList = function(callback){
	console.log('downloading gfw list');
	request(gfwListUrl, function(error, response, body){
		if(!error){
			if(body.indexOf('.') >= 0){
				callback('GFW list format wrong');
				return;
			}
			console.log('Gfw list downloaded');
			callback(null, base64.decode(body));
		} else {
			callback(error);
		}
	});
}

var getDomainsFromGfwList = function(error, content, callback){
	if(error){
		callback(error);
		return;
	}
	var lines = content.split(/\r?\n/);
	callback(null, lines);
}

var buildBloomfilterFromUrls = function(error, urls, callback){
	if(error){
		callback(error);
		return;
	}

	var filter = bloomfilterForElementCount(Math.ceil(urls.length / 2));

	for(var i = 0; i < urls.length; i ++){
		var url = urls[i];
		url = line2Add(url);
		if(url){
			filter.add(url);
		}
	}

	callback(null, filter);
}

var bloomfilterForElementCount = function(elements){
	var bits, hashFuncCount;
	bits = -1 / (Math.pow(Math.log(2), 2)) * elements * Math.log(BLOOM_FILTER_FP_RATE);
	bits = Math.ceil(bits);
	hashFuncCount = bits / elements * Math.log(2);
	hashFuncCount = Math.ceil(hashFuncCount);
	console.log('bloomfilter elements: ' + elements + ', bits: ' + bits + ', hashFuncCount: ' + hashFuncCount);
	return new Bloomfilter(bits, hashFuncCount);
}

var line2Add = function(line){
	if(line.indexOf('.*') >= 0){
		return null;
	}else if(line.indexOf('*') >= 0){
		line = line.replace('*', '/');
	}
	if(line.indexOf('!---') == 0){
		return null;
	}

	if(line.indexOf('!--') == 0){
		line = line.slice(3);
	}
	if(line.indexOf('||') == 0){
		line = line.slice(2);
	}else if(line.indexOf('|') == 0){
		line = line.slice(1);
	}else if(line.indexOf('.') == 0){
		line = line.slice(1);
	}

	if(line.indexOf('!') == 0 || line.indexOf('[') == 0 || line.indexOf('@') == 0){
		return null;
	}

	if(!line.match(/^https?\:/)){
		line = 'http://' + line;
	}

	return getDomain(line);
}

function getDomain(line) {
    var url = URL.parse(line);
  	if(url && url.hostname && url.hostname.split('.').length > 1){
  		return url.hostname;
  	}
  	return null;
}

fetchGfwList(function(error, content){

	getDomainsFromGfwList(error, content, function(error, urls){

		buildBloomfilterFromUrls(error, urls, function(error, bloomfilter){
			if(error){
				console.log(error);
				return;
			}
			buildPac(bloomfilter);
		});
	});
});

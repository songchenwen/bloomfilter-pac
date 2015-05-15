var M = require('mustache'),
	path = require('path'),
	fs = require('fs');

var configPath = path.join(__dirname, 'config.json'),
	templatePath = path.join(__dirname, 'template.pac'),
	outPath = path.join(__dirname, 'bloomfilter.pac');

var build = function(filter) {
	var config = prepareConfig(filter);
	var temp = fs.readFileSync(templatePath, 'utf8');
	var out = M.render(temp, config);
	fs.writeFileSync(outPath, out);
}

var prepareConfig = function(filter){
	var config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

	config.hashFuncCount = filter.k;
	config.white = JSON.stringify(config.white);
	config.black = JSON.stringify(config.black);
	config.bloomfilter =[].slice.call(filter.buckets).join('');
	return config;
}


module.exports = build;

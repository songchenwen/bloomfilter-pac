var M = require('mustache'),
	fs = require('fs');

var configPath = 'config.json',
	templatePath = 'template.pac',
	outPath = 'bloomfilter.pac';

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
	config.bloomfilter = JSON.stringify([].slice.call(filter.buckets));
	return config;
}

module.exports = build;

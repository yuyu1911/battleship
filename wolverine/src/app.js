var http = require('http'),
	db = require('./dbConnect').db,
	url = require('url'),
	os = require('os'),
	cluster = require('cluster'),
	numCPUs = os.cpus().length,
	app = http.createServer(function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end();
		req.on('end',function(){
			var requestUrl = req.url,
			params = url.parse(requestUrl, true).query,
			data,
			taskId,
			collection;
			data = JSON.parse(params.data);
			taskId = data.taskId;
			collection = db.collection(taskId);
			delete data.taskId;
			collection.insert(data,function(err,records){
				console.log(records);
			});
		});
	}),
	worker;
if (cluster.isMaster){
	console.log('CPUS:'+numCPUs);
	for(var i=0;i<numCPUs;i++){
		worker = cluster.fork();
	}
	cluster.on('death', function(worker) {
		console.log('worker ' + worker.pid + ' died');
	});
}
else{
	app.listen(1337);
}
console.log('wolverine is ready!');
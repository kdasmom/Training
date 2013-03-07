Ext.define('NP.lib.core.Net', {
	requires: ['Deft.*'],
	singleton: true,
	
	remoteCall: function(cfg) { // There can be more arguments, you can use either a config object or (success, method) as args
		// Create a deferred object to be used later
		var deferred = Ext.create('Deft.Deferred');

		// If config is for a single call, convert it to an array to avoid code duplication
		if ((cfg.requests instanceof Array) == false) {
			cfg.requests = [cfg.requests];
		}
		
		// These are the possible options for the cfg argument
		Ext.applyIf(cfg, {
			method: 'GET',
			success: function() {},
			failure: function() {}
		});
		
		Ext.Ajax.request({
			url: 'ajax.php',
			method: cfg.method,
			params: {
				config: Ext.JSON.encode(cfg.requests)
			},
			callback: function(options, success, response) {
				var res, returnStruct = false;
				if (success) {
					res = Ext.decode(response.responseText);
				}
				if ((res instanceof Array) == false) {
					res = [res];
					returnStruct = true;
				}
				for (var i=0; i<cfg.requests.length; i++) {
					if (success) {
						if (cfg.requests[i].model) {
							
							var store = Ext.create('Ext.data.Store', {
								autoLoad: true,
								model: cfg.requests[i].model,
								data: res[i],
								proxy: {
									type: 'memory',
									reader: {
										type: 'json'
									}
								}
							});
							
							res[i] = store;
						}
						if (cfg.requests[i].success) {
							cfg.requests[i].success(res[i], deferred);
						}
					} else {
						if (cfg.requests[i].failure) {
							cfg.requests[i].failure(response, options, deferred);
						}
					}
				}
				if (success) {
					if (returnStruct) {
						cfg.success(res[0], deferred);
					} else {
						cfg.success(res, deferred);
					}
				} else {
					cfg.failure(response, options, deferred);
				}
			}
		});
		
		return deferred.promise;
	}
});
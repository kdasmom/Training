Ext.define('NP.core.Net', {
	singleton: true,
	
	remoteCall: function(cfg) { // There can be more arguments, you can use either a config object or (success, method) as args
		// Only run anything if there are requests in the config file
		if (arguments.length && cfg.requests) {
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
					if (response.responseText == 'badRequest' || response.responseText == 'authenticationFailure') {
						window.location = 'login.php';
					} else {
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
									cfg.requests[i].success(res[i]);
								}
							} else {
								if (cfg.requests[i].failure) {
									cfg.requests[i].failure(response, options);
								}
							}
						}
						if (success) {
							if (returnStruct) {
								cfg.success(res[0]);
							} else {
								cfg.success(res);
							}
						} else {
							cfg.failure(response, options);
						}
					}
				}
			});
		}
	}
});
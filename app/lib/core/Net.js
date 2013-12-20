/**
 * The Net class is used for operations that require communication with a server or another client
 * 
 * For now, the main aim of the class is to wrap Ajax calls to make them easy to use and conform to
 * certain standards. This is accomplished via calls to the remoteCall() function. The function can
 * be used to batch calls to multiple service functions in the backend into one single ajax request
 * and handle the results individually, together, or both. Here's an example for a call to a single
 * function:
 *
 *		NP.lib.core.Net.remoteCall({
 *			requests: {
 *				service: 'UserService', 				// This is the PHP service you want to call
 *				action: 'save',							// This is the function to call on that service
 *				fname : 'Thomas',						// This will be passed as an argument to the function
 *				lname : 'Messier',						// This will be passed as an argument to the function
 *				// This function gets called if the ajax request succeeds
 *				success: function(result) {
 *					... handle success here ...
 *				},
 *				// This function gets called if the ajax request fails
 *				failure: function(response, options) {
 *					... handle failure here ...
 *				}
 *			}
 *		});
 *
 * Here's an example with batched calls:
 *
 *		var promise = NP.lib.core.Net.remoteCall({
 *			requests: [{
 *				service: 'UserService', 
 *				action : 'save',
 *				fname  : 'Thomas',
 *				lname  : 'Messier',
 *				// This function gets called if the ajax request succeeds with only the result returned for this operation
 *				success: function(result) {
 *					Ext.log('Thomas saved');
 *				},
 *				// This function gets called if the ajax request fails with only the result returned for this operation
 *				failure: function(response, options) {
 *					Ext.log('Saving Thomas failed');
 *				}
 *			},{
 *				service: 'UserService', 
 *				action : 'save',
 *				fname  : 'Sud',
 *				lname  : 'Luthra',
 *				success: function(result) {
 *					Ext.log('Sud saved');
 *				},
 *				failure: function(response, options) {
 *					Ext.log('Saving Sud failed');
 *				}
 *			}],
 *			// Method to use for the ajax request, defaults to GET if not included
 *          method : 'GET',
 *			// This function gets called if the ajax request succeeds after all callbacks for individual requests have run
 *			// The first parameter is an array with the results for all the operations above
 *			success: function(results) {
 *				// Look through results for each operation
 *				for (var i=0; i<results.length; i++) {
 *					// Do something here for each one of the ajax operations above
 *					...	
 *				}
 *			},
 *			// This function gets called if the ajax request fails after all callbacks for individual requests have run
 *			failure: function(response, options) {
 *				... handle failure here ...
 *			}
 *		});
 *
 * Note how this example has success and failure functions for both the individual functions and for the
 * operation as a whole. This is not required, you can have as many or as few callbacks as you want.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.core.Net', {
	alternateClassName: 'NP.Net',
	singleton: true,
	
	abortableRequests: {},

	/**
	 * Executes an Ajax call. Aside from the documented parameters, each request can take an arbitrary number of
	 * parameter that will be passed as arguments to the service function called
	 *
	 * @param  {Object}                         cfg                      See docs above for what can be passed as a config
	 * @param  {Object[]/Object}                cfg.requests             Request(s) that need to be made to backend services
	 * @param  {String}                         cfg.requests.service     PHP service to call
	 * @param  {String}                         cfg.requests.action      Function to call in the service
	 * @param  {String}                         [cfg.requests.store]     Name of a store to automatically load with the data that the request returns
	 * @param  {String}                         [cfg.requests.storeId]   Store Id for the store specified to be loaded (only applies if "store" config is set)
	 * @param  {Function}                       [cfg.requests.success]   Function to call after this request is done running if ajax request is successful
	 * @param  {Function}                       [cfg.requests.failure]   Function to call after this request is done running if ajax request fails
	 * @param  {"GET"/"POST"}                   [cfg.method]             Method to use for ajax request; defaults to "GET"
	 * @param  {Component}                      [cfg.mask]               Component that you want to mask while the request runs
	 * @param  {String}                         [cfg.maskText="Loading"] Text for the loading mask
	 * @param  {Ext.Element/HTMLElement/String} [cfg.form]               The <form> Element or the id of the <form> to pull parameters from.
	 * @param  {Boolean}                        [cfg.isUpload]           Set to true if the form object is a file upload.
	 * @param  {Boolean}                        [cfg.abortable]          Set to true if you want the request to be aborted if the user goes to another page
	 * @param  {Function}                       [cfg.success]            Function to call after all ajax requests have run if ajax request is successful
	 * @param  {Function}                       [cfg.failure]            Function to call after all ajax requests have run if ajax request fails
	 */
	remoteCall: function(cfg) { // There can be more arguments, you can use either a config object or (success, method) as args
		// If config is for a single call, convert it to an array to avoid code duplication
		if ((cfg.requests instanceof Array) == false) {
			cfg.requests = [cfg.requests];
		}
		
		// These are the possible options for the cfg argument
		Ext.applyIf(cfg, {
			method  : 'GET',
			isUpload: false,
			maskText: 'Loading',
			form    : '',
			abortable: true,
			success : function() {}, // default global success callback to empty function
			failure : function() {}  // default global failure callback to empty function
		});

		if (cfg.mask) {
			var mask = new Ext.LoadMask({ target: cfg.mask, msg: cfg.maskText });
			mask.show();
		}

		// Run the ajax request
		var ajaxRequest = Ext.Ajax.request({
			url     : 'ajax.php',
			method  : cfg.method,
			isUpload: cfg.isUpload,
			form    : cfg.form,
			params  : {
				config: Ext.JSON.encode(cfg.requests)
			},
			callback: function(options, success, response) {
				delete NP.Net.abortableRequests[ajaxRequest.id];

				var res, returnStruct = false;
				// If HTTP request was successful, decode the JSON response
				if (success) {
					res = Ext.decode(response.responseText);
				}
				// If the decoded result is not an array, make it an array for consistency sake
				if ((res instanceof Array) == false) {
					res = [res];
					returnStruct = true;
				}
				// Loop through the requests
				for (var i=0; i<cfg.requests.length; i++) {
					// If HTTP request was successful, process
					if (success) {
						// If a store was specified for this request, we need to create a store to return
						if (cfg.requests[i].store) {
							// Configure the store
							var storeCfg = { data: res[i] };
							if (cfg.requests[i].storeId) {
								storeCfg.storeId = cfg.requests[i].storeId;
							}
							// Create the store and set it as the return variable
							res[i] = Ext.create(cfg.requests[i].store, storeCfg);
						}
						// If a success callback was defined, run it, passing it the result
						if (cfg.requests[i].success) {
							cfg.requests[i].success(res[i]);
						}
					// If HTTP request failed, process the failure
					} else {
						// If a failure callback was defined, run it, passing it the response, options
						if (cfg.requests[i].failure) {
							cfg.requests[i].failure(response, options);
						}
					}
				}
				// If HTTP request was successful, process
				if (success) {
					// If we had a single request, just return a single result
					if (returnStruct) {
						cfg.success(res[0]);
					// If we had multiple requests, return the array of results
					} else {
						cfg.success(res);
					}
				// If HTTP request was successful, process failure
				} else {
					// Run the failure callback
					cfg.failure(response, options);
				}

				if (cfg.mask) {
					mask.destroy();
				}
			}
		});

		if (cfg.abortable) {
			NP.Net.abortableRequests[ajaxRequest.id] = {
				req : ajaxRequest,
				mask: (cfg.mask) ? mask : null
			};
		}
	},

	abortAllRequests: function() {
		for (var id in NP.Net.abortableRequests) {
			if (NP.Net.abortableRequests[id].mask !== null) {
				NP.Net.abortableRequests[id].mask.destroy();
			}
			
			Ext.Ajax.abort(NP.Net.abortableRequests[id].req);
			delete NP.Net.abortableRequests[id];
		}
	}
});
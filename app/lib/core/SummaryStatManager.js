/**
 * The SummaryStatManager class is used to update Summary Stats on the dashboard
 *
 * @author Thomas Messier
 * @singleton
 * @requires NP.lib.core.Security
 * @requires NP.store.system.SummaryStats
 */
Ext.define('NP.lib.core.SummaryStatManager', function() {
	// Private variable to track valid summary stats for the logged in user
	var userStats = null;

	return {
		extend   : 'Ext.util.Observable',
		requires: ['NP.lib.core.Security','NP.store.system.SummaryStats'],
		singleton: true,

		constructor: function() {
	    	// Add custom event
	    	this.addEvents('countreceive');

	    	// Create a store with the different summary stats available
	    	this.summaryStatStore = Ext.create('NP.store.system.SummaryStats', { storeId: 'system.SummaryStats' });

	    	this.callParent(arguments);
	    },

		/**
		 * Get the different summary stats available to the logged in user
		 * @return {Object[]} An array of objects for the summary stats available to the user
		 */
		getStats: function() {
			// If the stats have already been retrieved, don't bother doing it again, just get them from the private variable
			if (userStats === null) {
				userStats = [];
				this.summaryStatStore.each(function(rec) {
					var module_id = rec.get('module_id');
					if (module_id == 0 || NP.lib.core.Security.hasPermission(module_id)) {
						userStats.push(rec.getData());
					}
				});
			}

			return userStats;
		},

		/**
		 * Retrieve a specific summary stat from the store
		 * @param  {String} name Name of the summary stat to retrieve
		 * @return {Object}      Summary stat data that corresponds to the name passed
		 */
		getStat: function(name) {
			return this.summaryStatStore.findRecord('name', name);
		},

		/**
		 * Runs through all the stats available to the user and runs Ajax requests to retrieve
		 * a count for each summary stat.
		 * @param {String} contextType      The context type (Current Property, Region, etc.)
		 * @param {String} contextSelection The context selection (value of property or region drop down)
		 */
		updateCounts: function(contextType, contextSelection) {
			Ext.log('Updating dashboard counts');

			var that = this;

			// Get the summary stats for the logged in user
			var stats = this.getStats();

			// Track the ajax batches
			var batches = [];

			// Number of ajax call we want to make (we don't want to make 24 ajax calls if we have 24 summary stats)
			// So we batch the service requests in a few calls
			var ajaxCalls = 4;

			// Get the number of requests to include in a batch
			var reqsPerBatch = Math.ceil(stats.length / ajaxCalls);

			var pos = -1;
			Ext.each(stats, function(item, idx) {
				if (idx == 0 || idx % reqsPerBatch == 0) {
					pos++;
					batches[pos] = [];
				}
				batches[pos].push({
					service                    : item.service,
					action                     : 'get' + item.name,
					userprofile_id             : NP.lib.core.Security.getUser().get('userprofile_id'),
					delegated_to_userprofile_id: NP.lib.core.Security.getDelegatedToUser().get('userprofile_id'),
					countOnly                  : true,
					contextType                : contextType,
					contextSelection           : contextSelection,
					success: function(result, deferred) {
						/**
						 * @event countreceive
						 * Fired whenever a summary stat count is done being retrieved
						 * @param {String} summaryStatName The name of the summary stat
						 * @param {String} count           The number of items found for that stat
						 */
						that.fireEvent('countreceive', item.name, result);
					}
				});
			});

			for (var i=0; i<batches.length; i++) {
				NP.lib.core.Net.remoteCall({
					requests: batches[i]
				});
			}
		}
	}
});
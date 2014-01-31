/**
 * The SummaryStatManager class is used to update Summary Stats on the dashboard
 *
 * @author Thomas Messier
 * @singleton
 * @requires NP.lib.core.Security
 */
Ext.define('NP.lib.core.SummaryStatManager', function() {
	// Private variable to track valid summary stats for the logged in user
	var userStats = {};
	var userStatList = [];
	var userStatsLoaded = false;

	return {
		extend   : 'Ext.util.Observable',
		requires: ['NP.lib.core.Security'],
		singleton: true,

		constructor: function() {
	    	// Add custom event
	    	this.addEvents('countreceive');

	    	this.callParent(arguments);
	    },

		/**
		 * Get the different summary stats available to the logged in user
		 * @return {Object[]} An array of objects for the summary stats available to the user
		 */
		getStats: function() {
			// If the stats have already been retrieved, don't bother doing it again, just get them from the private variable
			if (!userStatsLoaded) {
				Ext.getStore('system.SummaryStats').each(function(rec) {
					var module_id = rec.get('module_id');
					if (module_id == 0 || NP.lib.core.Security.hasPermission(module_id)) {
						var cat = rec.get('category');
						if ( !(cat in userStats) ) {
							userStats[cat] = [];
						}
						userStats[cat].push(rec.getData());
						userStatList.push({ cat: cat, idx: userStats[cat].length-1 });
					}
				});
				userStatsLoaded = true;
			}

			return userStats;
		},

		/**
		 * Retrieve a specific summary stat from the store
		 * @param  {String} name Name of the summary stat to retrieve
		 * @return {Object}      Summary stat data that corresponds to the name passed
		 */
		getStat: function(name) {
			return Ext.getStore('system.SummaryStats').findRecord('name', name);
		},

		/**
		 * Runs through all the stats available to the user and runs Ajax requests to retrieve
		 * a count for each summary stat.
		 * @param {String} contextType      The context type (Current Property, Region, etc.)
		 * @param {String} contextSelection The context selection (value of property or region drop down)
		 */
		updateCounts: function(contextType, contextSelection, property_id, initCall) {
			Ext.log('Updating dashboard counts');

			var that = this;

			// Get the summary stats for the logged in user
			var stats = this.getStats();

			var batch = { requests: [] };

			// Loop through the stat categories
			Ext.Object.each(stats, function(category, categoryStats) {
				if (category != 'vendor' || initCall) {
					// Loop through each stat in the category
					Ext.each(categoryStats, function(stat) {
						// Add a request to the batch for the stat
						batch.requests.push({
							service                    : stat.service,
							action                     : 'get' + stat.name,
							userprofile_id             : NP.Security.getUser().get('userprofile_id'),
							delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
							countOnly                  : true,
							contextType                : contextType,
							contextSelection           : contextSelection,
							property_id                : property_id
						});
					});
				}
			});

			// Run ajax request for the batch
			var req = {
				method  : 'POST',
				requests: batch.requests,
				success : function(results) {
					// Suspend layouts to speed up the updating of the dashboard
					Ext.suspendLayouts();

					for (var i=0; i<results.length; i++) {
						// Update the stat count for this requests' summary stat
						var listPanel = Ext.ComponentQuery.query('[xtype="viewport.summarystatlist"]')[0];
						var stat = userStatList[i];
						
						listPanel.updateStatCount(stats[stat.cat][stat.idx].name, results[i]);
					}

					// Resume layouts now that all stats are updated
					Ext.resumeLayouts(true);
				}
			};
			
			if (!initCall) {
				req.mask = Ext.ComponentQuery.query('[xtype="viewport.summarystatlist"]')[0];
			}

			NP.lib.core.Net.remoteCall(req);
		}
	}
});
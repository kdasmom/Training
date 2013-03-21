Ext.define('NP.lib.core.SummaryStatManager', function() {
	var userStats = null;

	return {
		extend   : 'Ext.util.Observable',
		requires: ['NP.lib.core.Security'],
		singleton: true,

		invoicesToApproveText: 'Invoices to Approve',
		invoicesOnHoldText   : 'Invoices on Hold',
		invoicesCompletedText: 'Completed Invoices to Approve',
		invoicesRejectedText : 'Rejected Invoices',
		invoicesMyText       : 'My Invoices',

	    constructor: function() {
	    	this.addEvents('countreceive');

	    	this.summaryStatStore = Ext.create('Ext.data.Store', {
		        fields: ['title','name','model','service','module_id'],
		        data  : [
		        	{
						title    : this.invoicesToApproveText,
						name     : 'InvoicesToApprove',
						model    : 'invoice.Invoice',
						service  : 'InvoiceService',
						module_id: 1053
					},{
						title    : this.invoicesOnHoldText,
						name     : 'InvoicesOnHold',
						model    : 'invoice.Invoice',
						service  : 'InvoiceService',
						module_id: 6052
					},{
						title    : this.invoicesCompletedText,
						name     : 'InvoicesCompleted',
						model    : 'invoice.Invoice',
						service  : 'InvoiceService',
						module_id: 2004
					},{
						title    : this.invoicesRejectedText,
						name     : 'InvoicesRejected',
						model    : 'invoice.Invoice',
						service  : 'InvoiceService',
						module_id: 6036
					},{
						title    : this.invoicesMyText,
						name     : 'InvoicesByUser',
						model    : 'invoice.Invoice',
						service  : 'InvoiceService',
						module_id: 2060
					}
		        ],
		        proxy : {
		            type: 'memory',
		            reader: {
		                type: 'json'
		            }
		        }
		    });

	    	this.callParent(arguments);
	    },

		getStats: function() {
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

		getStat: function(name) {
			return this.summaryStatStore.findRecord('name', name);
		},

		updateCounts: function(filterType, selected) {
			Ext.log('Updating dashboard counts');

			var that = this;
			var stats = this.getStats();
			
			Ext.each(stats, function(item, idx) {
				NP.lib.core.Net.remoteCall({
					requests: {
						service         : 'UserService',
						action          : 'getDashboardStat',
						statService     : item.service,
						stat            : item.name,
						countOnly       : true,
						contextType     : filterType,
						contextSelection: selected,
						success: function(result, deferred) {
							that.fireEvent('countreceive', item.name, result);
						}
					}
				});
			});
		}
	}
});
// Override some functions to allow for interrupting view update when the store is updated
// by calling suspendViewUpdates()
Ext.define('overrides.view.AbstractView', {
	override: 'Ext.view.AbstractView',
	
	viewUpdatesSuspended: false,

	// Modification on line 18 to provide access to model in template
	collectData: function(records, startIndex){
        var data = [],
            i = 0,
            len = records.length,
            record;

        for (; i < len; i++) {
            record = records[i];
            data[i] = this.prepareData(record.data, startIndex + i, record);
            data[i]._rec = record;
        }
        return data;
    },

	suspendViewUpdates: function() {
		this.viewUpdatesSuspended = true;
	},

	resumeViewUpdates: function() {
		this.viewUpdatesSuspended = false;
	},

	onIdChanged: function() {
		if (!this.viewUpdatesSuspended) {
			this.callParent(arguments);
		}
	},
	
	onDataRefresh: function() {
		if (!this.viewUpdatesSuspended) {
			this.callParent(arguments);
		}
	},
	
	onAdd: function() {
		if (!this.viewUpdatesSuspended) {
			this.callParent(arguments);
		}
	},
	
	onRemove: function() {
		if (!this.viewUpdatesSuspended) {
			this.callParent(arguments);
		}
	},
	
	onUpdate: function() {
		if (!this.viewUpdatesSuspended) {
			this.callParent(arguments);
		}
	},
	
	refresh: function() {
		if (!this.viewUpdatesSuspended) {
			this.callParent(arguments);
		}
	}
});
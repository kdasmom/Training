/**
 * Model is a class that extends the base Ext.data.Model class to fix a bug in Ext JS 4.1 where idProperty
 * is not properly used.
 *
 * @author Thomas Messier
 */
Ext.define("NP.lib.data.Model", {
	extend: "Ext.data.Model",
	
	requires: ['NP.lib.core.Util','NP.lib.core.Config'],
	
	statics: {
		load: function(id, config) {
			config = Ext.apply({}, config);
			
			var params={};
			params[this.prototype.idProperty] = id;
			
			config = Ext.applyIf(config, {
				action: 'read',
				params: params
			});
			
			var operation  = Ext.create('Ext.data.Operation', config),
			scope      = config.scope || this,
			record     = null,
			callback;
			
			callback = function(operation) {
				if (operation.wasSuccessful()) {
					record = operation.getRecords()[0];
					Ext.callback(config.success, scope, [record, operation]);
				} else {
					Ext.callback(config.failure, scope, [record, operation]);
				}
				Ext.callback(config.callback, scope, [record, operation]);
			};
			
			this.proxy.read(operation, callback, this);
		}
	}
});
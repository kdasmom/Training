Ext.define("NP.lib.data.Store", {
	extend: "Ext.data.Store",
	
	getSlave: function() {
		var slaveStore = Ext.create(Ext.getClassName(this));
    	slaveStore.loadRawData(this.getProxy().getReader().rawData);
    	return slaveStore;
    }
});
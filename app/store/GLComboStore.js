Ext.define('NP.store.GLComboStore', {
	extend: 'Ext.data.Store',
	
	model: 'NP.model.GLAccount',
	
    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'gl.GLService',
			action: 'getForInvoiceItemComboBox'
		}
    }
});
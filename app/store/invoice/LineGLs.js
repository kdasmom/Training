Ext.define('NP.store.invoice.LineGLs', {
	extend: 'Ext.data.Store',
	
	model: 'NP.model.gl.GLAccount',
	
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
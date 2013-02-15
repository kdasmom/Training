Ext.define('NP.store.PriorityFlags', {
    extend: 'Ext.data.Store',
    
    model: 'NP.model.Picklist',
	
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'PicklistService',
			action: 'find',
			picklist_table_display: 'Priority'
		}
    }
});
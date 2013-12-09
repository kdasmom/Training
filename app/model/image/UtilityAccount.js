Ext.define('NP.model.image.UtilityAccount', {
    extend: 'Ext.data.Model',
	
    requires: ['NP.lib.core.Config'],

    idProperty: 'UtilityAccount_Id',
    fields: [
        { name: 'UtilityAccount_Id' },
        { name: 'UtilityAccount_Title'}
    ]
});
Ext.define('NP.model.image.Template', {
    extend: 'Ext.data.Model',
	
    requires: ['NP.lib.core.Config'],

    idProperty: 'invoice_id',
    fields: [
        { name: 'invoice_id'},
        { name: 'template_name'},
    ]
});
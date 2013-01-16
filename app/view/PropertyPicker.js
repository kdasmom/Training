Ext.define('NP.view.PropertyPicker', {
	extend: 'Ext.panel.Panel',
    alias: 'widget.propertypicker',
    
    layout: {
		type: 'hbox',
		align: 'middle'
	},
    
    border: 0,
    
    defaults: {
    	border: 0,
    	flex: 1
    },
    
    items: [
    	{
    		html: 'You are signed on as: '
    	},
    	{
    		html: 'View'
    	},
    	{
    		html: 'Current Property'
    	}
    ]
});
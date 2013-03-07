Ext.define('NP.view.Viewport', {
    extend: 'Ext.container.Viewport',
    
    requires: [
    	'NP.lib.ui.HoverButton'
		,'NP.lib.core.Config'
		,'NP.lib.core.Security'
		,'NP.view.viewport.TopToolbar'
		,'NP.view.viewport.TopMenu'
		,'NP.view.viewport.Home'
	],
	
	layout: 'border',
	
	initComponent: function() {
		this.items = {
	    	xtype: 'panel',
	    	itemId: 'viewportMainPanel',
	    	region: 'center',
	    	dockedItems: {
			    xtype: 'viewport.topmenu'
			},
			layout: {
	            type: 'vbox',
	            align: 'stretch'
	       	},
	       	border: false,
	       	items: [
		       	{
			        xtype: 'panel',
			        height: 51,
			        border: 0,
			        html: '<a href="#Viewport:home"><img src="resources/images/payables-top.gif" /></a>',
			        bodyStyle: {
			        	background: 'url(resources/images/headerspacer.gif) repeat-x'
			        }
			    },
			    {
			    	xtype: 'viewport.toptoolbar',
			    	itemId: 'viewportTopToolbar'
			    },
			    {
					xtype: 'panel',
					flex: 1,
			       	autoScroll: true,
			       	border: false,
			       	layout: 'fit',
			       	items: {
			       		itemId: 'contentPanel',
			       		layout: 'border',
			       		border: false,
			       		items: {
			       			region:'center',
			       			xtype: 'viewport.home'
			       		}
			       	}
				}
			]
	    };
	    
	    this.callParent(arguments);
	}
});
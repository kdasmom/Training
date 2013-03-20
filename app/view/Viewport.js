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
			        html: '<img id="npLogo" src="resources/images/payables-top.gif" />',
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
			       			html: ''
			       		}
			       	}
				}
			]
	    };
	    
	    this.addEvents('npLogoClicked');

	    var that = this;

	    // Add a listener for clicking on the NP logo
	    this.addListener('afterrender', function() {
	    	that.mon(Ext.get('npLogo'), 'click', function() {
	    		that.fireEvent('npLogoClicked');
			});
	    });

	    this.callParent(arguments);
	}
});
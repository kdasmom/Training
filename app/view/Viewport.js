/**
 * The main viewport panel. It's setup as a border layout with the top menu docked at the top.
 * The border layout is just in case we want to add some other side/bottom panels in the future.
 * The center region is setup as a vbox with the logo, toolbar, and content panel as containers.
 * 
 *
 * @author Thomas Messier
 */
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
	    var that = this;

		this.items = {
	    	xtype: 'panel',
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
	       		// This displays the NP logo at the top, right below the menu
		       	{
			        xtype: 'panel',
			        height: 51,
			        border: 0,
			        html: '<img id="npLogo" src="resources/images/payables-top.gif" />',
			        bodyStyle: {
			        	background: 'url(resources/images/headerspacer.gif) repeat-x'
			        }
			    },
			    // This displays the toolbar right below the image
			    {
			    	xtype: 'viewport.toptoolbar',
			    	itemId: 'viewportTopToolbar'
			    },
			    // This is the main content panel where all other things get loaded
			    {
					flex: 1,
			       	autoScroll: true,
			       	border: false,
			       	itemId: 'contentPanel',
		       		layout: 'border',
		       		border: false,
		       		items: {
		       			region:'center',
		       			html: ''
		       		}
				}
			]
	    };
	    
	    // Add custom event for clicking on the NP logo
	    this.addEvents('npLogoClicked');

	    // Add a listener for clicking on the NP logo so our controller can subscribe to it
	    this.addListener('afterrender', function() {
	    	that.mon(Ext.get('npLogo'), 'click', function() {
	    		/**
		         * @event npLogoClicked
				 * Fires whenever the NP logo is clicked
		         */
	    		that.fireEvent('npLogoClicked');
			});
	    });

	    this.callParent(arguments);
	}
});
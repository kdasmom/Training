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
    	'NP.lib.core.Translator',
    	'Ext.layout.container.Border',
    	'NP.lib.ui.HoverButton',
    	'NP.lib.core.Config',
    	'NP.lib.core.Security',
    	'NP.view.viewport.TopToolbar',
    	'NP.view.viewport.TopMenu',
    	'NP.view.viewport.Home',
    	'NP.view.viewport.ImagePanel',
    	'NP.view.shared.button.FavoriteGlobal'
	],
	
	layout: 'border',
	
	initComponent: function() {
	    var that = this;

		this.items = [
			{
		    	xtype: 'panel',
		    	region: 'center',
		    	layout: {
		            type: 'vbox',
		            align: 'stretch'
		       	},
		       	border: false,
		       	items: [
		       		// This displays the NP logo at the top, right below the menu
			       	{
				        xtype: 'container',
				        height: 70,
				        layout: {
				            type: 'hbox',
				            align: 'stretch'
				       	},
				       	items: [
				       		// This is the large NP Logo top left
				       		{
				       			xtype: 'component',
				       			html : '<img id="npHeaderLogo" src="resources/images/payables-top.jpg" />',
				       			width: 658
				       		},
				       		{
				       			xtype: 'container',
				       			style: {
						        	backgroundColor: '#1E244D'
						        },
						        flex: 1,
						        padding: '10 12 0 0',
						        layout: {
						        	type: 'vbox',
						        	align: 'right'
						        },
						        items: [
									{
						        		xtype : 'container',
						        		layout: 'hbox',
						        		items: [
						        			{
												xtype       : 'customcombo',
												itemId      : 'NP_locale',
												valueField  : 'val',
												displayField: 'name',
												iconClsField: 'icon',
												typeAhead   : false,
												editable    : false,
												value       : NP.Translator.getLocale(),
												store: Ext.create('Ext.data.Store', {
													fields: ['name', 'val', 'icon'],
													data  : [
														{ name: 'English', val: 'en', icon: 'locale-en' },
														{ name: 'Français', val: 'fr', icon: 'locale-fr' }
													]
												}),
												margin: '0 32 0 0'
						        			},{
						        				xtype: 'component',
						        				html : '<img id="learningNexusImg" src="resources/images/learningnexus.gif" align="top" />',
						        				width: 109,
						        				margin: '0 8 0 0'
						        			},{
						        				xtype: 'component',
						        				html : '<span id="npHeaderRightLinks">' + 
									        				'<a href="javascript:void(0)" id="npHomeLink">' + NP.Translator.translate('Home') + '</a>' + ' | ' + 
									        				'<a href="javascript:void(0);" id="npHelpLink">' + NP.Translator.translate('Help') + '</a>' + ' | ' + 
									        				'<a href="javascript:void(0);" id="npLogoutLink">' + NP.Translator.translate('Logout') + '</a>' + 
									        			'</span>'
						        			}
						        		]
						        	},
						        	{ xtype: 'viewport.delegationpicker' }
						        ]
						    }
				       	]
				    },
				    {
				    	xtype: 'viewport.topmenu'
				    },
				    // This is the main content panel where all other things get loaded
				    {
						flex: 1,
				       	autoScroll: true,
				       	border: false,
				       	itemId: 'contentPanel',
			       		layout: 'fit',
			       		border: false,
			       		items: {
			       			html: ''
			       		}
					}
				]
		    },
		    // Panels for loading invoice/po images into; it's easier to predefine for all regions
		    // than having to create on the fly
		    {
				xtype      : 'viewport.imagepanel',
				itemId     : 'westPanel',
				region     : 'west'
		    },{
				xtype      : 'viewport.imagepanel',
				itemId     : 'eastPanel',
				region     : 'east'
		    },{
				xtype      : 'viewport.imagepanel',
				itemId     : 'southPanel',
				region     : 'south'
		    },{
				xtype      : 'viewport.imagepanel',
				itemId     : 'northPanel',
				region     : 'north'
		    }
	    ];
	    
	    // Add custom event for clicking on the NP logo
	    this.addEvents('nplogoclicked','nphomelinkclick','nphelplink','nplogoutlink');

	    // Add a listener for clicking on the NP logo so our controller can subscribe to it
	    this.addListener('afterrender', function() {
	    	that.mon(Ext.get('npHeaderLogo'), 'click', function() {
	    		/**
		         * @event nplogoclicked
				 * Fires whenever the NP logo is clicked
		         */
	    		that.fireEvent('nplogoclicked');
			});

			that.mon(Ext.get('npHomeLink'), 'click', function() {
				/**
		         * @event nphomelinkclick
				 * Fires whenever the NP Home link is clicked
		         */
	    		that.fireEvent('nphomelinkclick');
			});

			that.mon(Ext.get('npHelpLink'), 'click', function() {
				/**
		         * @event nphelplink
				 * Fires whenever the NP Help link is clicked
		         */
	    		that.fireEvent('nphelplink');
			});

			that.mon(Ext.get('npLogoutLink'), 'click', function() {
				/**
		         * @event nplogoutlink
				 * Fires whenever the NP Logout link is clicked
		         */
	    		that.fireEvent('nplogoutlink');
			});

			that.mon(Ext.get('learningNexusImg'), 'click', function() {
				/**
		         * @event learningnexusimgclick
				 * Fires whenever the LearningNexus image is clicked
		         */
	    		that.fireEvent('learningnexusimgclick');
			});
	    });

	    this.callParent(arguments);
	}
});
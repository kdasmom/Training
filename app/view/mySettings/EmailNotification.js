/**
 * My Settings: Email Notification section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.EmailNotification', {
	extend: 'Ext.form.Panel',
	alias : 'widget.mysettings.emailnotification',
	
	requires: [
		'NP.lib.core.Security',
		'NP.view.mySettings.EmailAlerts'
	],

	title : 'Email Notification',
	
	layout: 'fit',

    initComponent: function() {
    	var permissions = NP.Security.getPermissions();
    	
    	var bar = [
	    	 { xtype: 'shared.button.save' }
	    ];

	    this.tbar = bar;
	    this.bbar = bar;

    	this.items = [{
			xtype   : 'verticaltabpanel',
			border  : false,
			defaults: {
	            padding: 8
	        },
	        items   : [
	            { xtype: 'mysettings.emailalerts', title: 'Status Alerts', emailalerttype_function: 2, permissions: permissions },
	            { xtype: 'mysettings.emailalerts', title: 'Frequency-Based Alerts', emailalerttype_function: 1, permissions: permissions }
	        ]
	    }];

    	this.callParent(arguments);
    }
});
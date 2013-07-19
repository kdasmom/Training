/**
 * User Manager > Users tab > Form > Email Alerts
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.UsersFormEmail', {
    extend: 'Ext.container.Container',
    alias: 'widget.user.usersformemail',

    requires: [
		'NP.lib.core.Security',
		'NP.view.mySettings.EmailAlerts',
		'NP.view.mySettings.EmailFrequency'
	],

	autoScroll: true,
	padding   : 8,

    // For localization
    title : 'Email Alerts',
    emailOverwriteLabel: 'Overwrite User Email Notification Settings',

    // Custom settings
    showEmailOverwrite: false,
    
    initComponent: function() {
    	var permissions = NP.Security.getPermissions();

    	this.defaults = { margin: '0 0 5 0' };
    	this.items = [
    		{ xtype: 'component', html: '<b>Status Alerts</b>' },
    		{ xtype: 'mysettings.emailalerts', emailalerttype_function: 2, permissions: permissions },
    		{ xtype: 'component', html: '<b>Frequency-Based Alerts</b>' },
            { xtype: 'mysettings.emailalerts', emailalerttype_function: 1, permissions: permissions },
            { xtype: 'component', html: '<b>Email Frequency</b>' },
            { xtype: 'mysettings.emailfrequency' }
    	];

        if (this.showEmailOverwrite) {
            this.items.push({
                xtype: 'checkbox',
                fieldLabel: this.emailOverwriteLabel,
                labelWidth: 280,
                name: 'email_overwrite'
            });
        }

    	this.callParent(arguments);
    }
});
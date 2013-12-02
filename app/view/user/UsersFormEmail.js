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
        'NP.lib.core.Translator',
		'NP.view.mySettings.EmailAlerts',
		'NP.view.mySettings.EmailFrequency'
	],

	autoScroll: true,
	padding   : 8,

    // Custom settings
    showEmailOverwrite: false,
    
    initComponent: function() {
    	var permissions = NP.Security.getPermissions();

        this.title = NP.Translator.translate('Status Email Alerts');

    	this.defaults = { margin: '0 0 5 0' };
    	this.items = [
    		{ xtype: 'component', html: '<b>Status Alerts</b>' },
    		{ xtype: 'mysettings.emailalerts', emailalerttype_function: 2, permissions: permissions }
    	];

        if (this.showEmailOverwrite) {
            this.items.push({
                xtype: 'checkbox',
                fieldLabel: NP.Translator.translate('Overwrite User Email Notification Settings'),
                labelWidth: 280,
                name: 'email_overwrite'
            });
        }

    	this.callParent(arguments);
    }
});
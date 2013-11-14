/**
 * Created by rnixx on 11/14/13.
 */

Ext.define('NP.view.user.UsersFrequentlyBasedEmailAlertsForm', {
	extend: 'Ext.container.Container',
	alias: 'widget.user.usersfrequentlybasedemailalertsform',

	requires: [
		'NP.lib.core.Security',
		'NP.view.mySettings.EmailAlerts',
		'NP.view.mySettings.EmailFrequency'
	],

	autoScroll: true,
	padding   : 8,

	// For localization
//	title : NP.Translator.translate('Frequency-Based Alerts'),
	emailOverwriteLabel: 'Overwrite User Email Notification Settings',

	// Custom settings
	showEmailOverwrite: false,

	initComponent: function() {
		var permissions = NP.Security.getPermissions();

		this.defaults = { margin: '0 0 5 0' };
		this.items = [
			{ xtype: 'component', html: '<b>Frequency-Based Alerts</b>' },
			{ xtype: 'mysettings.emailalerts', emailalerttype_function: 1, permissions: permissions },
//			{ xtype: 'component', html: '<b>Email Frequency</b>' },
//			{ xtype: 'mysettings.emailfrequency' }
		];

//		if (this.showEmailOverwrite) {
//			this.items.push({
//				xtype: 'checkbox',
//				fieldLabel: this.emailOverwriteLabel,
//				labelWidth: 280,
//				name: 'email_overwrite'
//			});
//		}

		this.callParent(arguments);
	}
});
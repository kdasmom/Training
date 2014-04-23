/**
 * My Settings: Mobile Settings section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mobileSetup.MobileForm', {
	extend: 'Ext.container.Container',
	alias: 'widget.mobilesetup.mobileform',

	requires: [
		'NP.lib.core.Security',
		'NP.lib.core.Translator'
	],

	userInputLabelText             : 'User',
	mobilePhoneNumberInputLabelText: 'Mobile Phone Number',
	phoneNumberInstructions        : 'Enter your 10 digit phone number as 7035551212',
	newPinInputLabelText           : 'New PIN',
	newPinConfirmInputLabelText    : 'Confirm New PIN',
	newPinInstructions             : '4 digit PIN required',

	defaults: {},

	initComponent: function() {
		var me = this;

		Ext.apply(me.defaults, {
			labelWidth      : 150,
			hideTrigger     : true,
			enforceMaxLength: true,
			validateOnChange: false
		});

		me.items = [
			{
				xtype     : 'textfield',
				fieldLabel: NP.Translator.translate(me.mobilePhoneNumberInputLabelText),
				name      : 'mobinfo_phone',
				margin    : '0 0 0 0',
				maxLength : 10,
				regex     : /^\d{10}$/,
				allowBlank: false
			},{
				xtype    : 'displayfield',
				value    : '<i>' + NP.Translator.translate(me.phoneNumberInstructions) + '</i>'
			},{
				xtype     : 'textfield',
				fieldLabel: NP.Translator.translate(me.newPinInputLabelText),
				inputType : 'password',
				name      : 'mobinfo_pin',
				maxLength : 4,
				regex     : /^\d{4}$/
			},{
				xtype    : 'displayfield',
				margin   : '-5 0 5 155',
				value    : '<i>' + NP.Translator.translate(me.newPinInstructions) + '</i>'
			},{
				xtype     : 'textfield',
				fieldLabel: NP.Translator.translate(me.newPinConfirmInputLabelText),
				inputType : 'password',
				name      : 'mobinfo_pin_confirm',
				maxLength : 4,
				regex     : /^\d{4}$/
			}
		];

		this.callParent(arguments);

		this.on('afterrender', function(el) {
			this.query('displayfield')[0].labelCell.setVisibilityMode(Ext.dom.Element.VISIBILITY).setVisible(false);
		}, this);
	},

	isValid: function() {
		var me      = this,
			form    = me.up('boundform'),
			isValid = true;

		// Do validation specific to an implementation
		var pinConfirmField = form.findField('mobinfo_pin_confirm');
		if (form.findField('mobinfo_pin').getValue() != pinConfirmField.getValue()) {
			pinConfirmField.markInvalid("Your PIN fields don't match");
			isValid = false;
		}

		return isValid;
	}
});
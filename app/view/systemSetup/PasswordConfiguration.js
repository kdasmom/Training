/**
 * System Setup: Password Configuration section
 *
 * @author Witold Frackiewicz - Testerix
 */
Ext.define('NP.view.systemSetup.PasswordConfiguration', {
	extend: 'Ext.form.Panel',
    alias: 'widget.systemsetup.passwordconfiguration',
    
    requires: [
      'NP.lib.core.Config',
      'NP.lib.core.Security',
      'NP.lib.core.Translator',
      'NP.view.shared.button.Save'
   ],
    
    layout: 'vbox',
    bodyPadding: 8,
    autoScroll: true,
    defaults : { 
    	labelWidth: 280,
    	allowBlank: false
    },
    
    initComponent: function() {	
    	var that = this;

      that.title = NP.Translator.translate('Password Configuration');

      that.translateText();

    	var bar = [
	    	 { xtype: 'shared.button.save' }
	    ];
	    this.tbar = bar;
	    this.bbar = bar;

    	// Build generic store for the password lenght that shows options from 6 to 12
        var lengthData = [];
        for (var i=6; i<=12; i++) {
        	lengthData.push({ chars: i });
        }
        
        this.items = [
              		{
              			xtype			: 'combo',
                        name			: 'cp.password_min_length',
                        fieldLabel		: this.passwordMinLengthText,
                        store			: Ext.create('Ext.data.Store', {
                            fields: ['chars'],
                            data  : lengthData
                        }),
                        queryMode		: 'local',
                        displayField	: 'chars',
                        valueField		: 'chars',
                        forceSelection	: true,
                        editable		: false,
                    	width	  		: 340
              		},{
        				xtype     : 'numberfield',
        				name      : 'cp.password_expire_interval',
        				fieldLabel: this.passwordExpireIntervalText,
                        minValue  : 0,
                        maxValue  : 999,
                    	width	  : 340
            		},{
        				xtype     : 'numberfield',
        				name      : 'cp.password_history_interval',
        				fieldLabel: this.passwordHistoryIntervalText,
                        minValue  : 0,
                        maxValue  : 999,
                    	width	  : 340
            		},{
              			xtype: 'radiogroup',
              			fieldLabel: this.passwordChangeOnLoginText,
              			defaults: { name: 'cp.password_change_on_login', margin: '0 5 0 0' },
              			layout: 'hbox',
              			items: [
              				{ boxLabel: this.passwordChangeOnLoginYesText, inputValue: 1, checked: true },
              				{ boxLabel: this.passwordChangeOnLoginNoText, inputValue: 0 }
              			]
              		},{
                        xtype     : 'displayfield',
                        itemId    : 'pwdCfgExplanationField',
                        value     : this.pwdCfgExplanationText
            		}
              	];
    	
    	this.callParent(arguments);
    },

    translateText: function() {
      var me = this;

      me.pwdCfgExplanationText        = NP.Translator.translate('Password security requires that a minimum of one letter, number and special character be used when setting up user passwords in the system. Special characters include !, @, $, %, &, *, and ?');
      me.passwordMinLengthText        = NP.Translator.translate('Please select the minimum password length');
      me.passwordExpireIntervalText   = NP.Translator.translate('Expiration Interval (days)');
      me.passwordHistoryIntervalText  = NP.Translator.translate('Days until same password can be reused');
      me.passwordChangeOnLoginText    = NP.Translator.translate('User must change password on login');
      me.passwordChangeOnLoginYesText = NP.Translator.translate('Yes');
      me.passwordChangeOnLoginNoText  = NP.Translator.translate('No');
    }
});
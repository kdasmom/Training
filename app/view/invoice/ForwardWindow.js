/**
 * The invoice forward window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.ForwardWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.invoice.forwardwindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
        'NP.lib.core.Security',
    	'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Message',
        'NP.view.shared.UserAssigner',
        'NP.store.user.Userprofiles'
    ],

    layout     : 'fit',
    width      : 800,
    height     : 600,
    border     : false,
    modal      : true,
    minimizable: false,
    autoScroll : true,

    initComponent: function() {
    	var me = this;

        me.title = NP.Translator.translate('Invoice Forward');

        me.items = [{
            xtype: 'form',
            bodyPadding: 8,
            tbar : [
                { xtype: 'shared.button.cancel', handler: function() { me.close(); } },
                { itemId: 'invoiceForwardSaveBtn', xtype: 'shared.button.message' }
            ],
            layout: {
                type : 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype     : 'displayfield',
                    fieldLabel: NP.Translator.translate('Current Email Address'),
                    value     : NP.Security.getUser().get('email_address')
                },{
                    xtype     : 'displayfield',
                    fieldLabel: NP.Translator.translate('Invoice Number'),
                    value     : me.invoice.get('invoice_ref')
                },{
                    xtype     : 'radiogroup',
                    fieldLabel: NP.Translator.translate('Forward To'),
                    defaults  : { name: 'forward_to' },
                    items     : [
                        { boxLabel: NP.Translator.translate('User'), inputValue: 'user', checked: true },
                        { boxLabel: NP.Translator.translate('Email Address'), inputValue: 'email' },
                        { boxLabel: NP.Translator.translate('Vendor'), inputValue: 'vendor' }
                    ],
                    listeners: {
                        change: me.changeForwardTo.bind(me)
                    }
                },{
                    xtype : 'container',
                    itemId: 'invoiceForwardCard',
                    layout: 'card',
                    items : [
                        {
                            xtype : 'shared.userassigner',
                            height: 120,
                            store : {
                                type   : 'user.userprofiles',
                                service: 'UserService',
                                action : 'getForForward',
                                extraParams: {
                                    table_name : 'invoice',
                                    tablekey_id: me.invoice.get('invoice_id')
                                },
                                autoLoad: true
                            }
                        },{
                            xtype     : 'textfield',
                            name      : 'email_address',
                            fieldLabel: NP.Translator.translate('Email'),
                            vtype     : 'email'
                        }
                    ]
                }
            ]
        }];

    	me.callParent(arguments);
    },

    changeForwardTo: function(field, newVal, oldVal) {
        var me         = this,
            cardPanel  = me.down('#invoiceForwardCard'),
            forward_to = newVal.forward_to,
            emailField = cardPanel.down('[name="email_address"]'),
            usedField  = cardPanel.down('[name="users"]');

        if (forward_to == 'user') {
            cardPanel.getLayout().setActiveItem(0);
            emailField.setAllowBlank(true);
            usedField.allowBlank = false;
        } else {
            cardPanel.getLayout().setActiveItem(1);
            emailField.setAllowBlank(false);
            usedField.allowBlank = true;

            if (forward_to == 'vendor') {
                emailField.setValue(me.vendor.get('email_address'));
                emailField.setReadOnly(true);
            } else {
                emailField.setReadOnly(false);
            }
        }
    }
});
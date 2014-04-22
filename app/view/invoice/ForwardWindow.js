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
    height     : 450,
    border     : false,
    modal      : true,
    minimizable: false,
    autoScroll : true,

    initComponent: function() {
    	var me         = this,
            labelWidth = 150;

        me.title = NP.Translator.translate('Invoice Forward');

        me.items = [{
            xtype: 'form',
            bodyPadding: 8,
            tbar : [
                { xtype: 'shared.button.cancel', handler: function() { me.close(); } },
                { itemId: 'invoiceForwardSendBtn', xtype: 'shared.button.message' }
            ],
            layout: 'column',
            items: [
                {
                    xtype: 'container',
                    columnWidth: 0.7,
                    layout: {
                        type : 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype     : 'displayfield',
                            fieldLabel: NP.Translator.translate('Current Email Address'),
                            labelWidth: labelWidth,
                            value     : NP.Security.getUser().get('email_address')
                        },{
                            xtype     : 'displayfield',
                            fieldLabel: NP.Translator.translate('Invoice Number'),
                            labelWidth: labelWidth,
                            value     : me.invoice.get('invoice_ref')
                        },{
                            xtype     : 'radiogroup',
                            fieldLabel: NP.Translator.translate('Forward To'),
                            labelWidth: labelWidth,
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
                            xtype   : 'container',
                            itemId  : 'invoiceForwardCard',
                            layout  : 'card',
                            defaults: { labelAlign: 'top' },
                            items   : [
                                {
                                    xtype     : 'shared.userassigner',
                                    height    : 150,
                                    allowBlank: false,
                                    store     : {
                                        type   : 'user.userprofiles',
                                        service: 'UserService',
                                        action : 'getForForward',
                                        extraParams: {
                                            table_name : 'invoice',
                                            tablekey_id: me.invoice.get('invoice_id')
                                        },
                                        sorters: [{
                                            property: 'person_lastname'
                                        }],
                                        autoLoad: true
                                    }
                                },{
                                    xtype     : 'textfield',
                                    name      : 'email_address',
                                    fieldLabel: NP.Translator.translate('Email'),
                                    vtype     : 'email'
                                }
                            ]
                        },{
                            xtype     : 'textarea',
                            name      : 'message',
                            fieldLabel: NP.Translator.translate('Message'),
                            labelAlign: 'top',
                            margin    : '16 0 0 0',
                            allowBlank: false,
                            maxLength : 2000
                        }
                    ]
                },{
                    xtype      : 'container',
                    layout     : {
                        type : 'vbox',
                        align: 'stretch'
                    },
                    columnWidth: 0.3,
                    margin     : '0 0 0 24',
                    items: [
                        {
                            xtype: 'component',
                            html : '<b>Include:</b> <a id="invoiceForwardCheckAll" class="inline-links">Check All</a> | <a id="invoiceForwardUncheckAll" class="inline-links">Uncheck All</a>'
                        },{
                            xtype     : 'checkboxgroup',
                            layout    : 'vbox',
                            name      : 'include_group',
                            defaults  : { name: 'include', padding: '0 8 0 0' },
                            items     : me.getIncludeOptions()
                        }
                    ]
                }
            ]
        }];

    	me.callParent(arguments);

        me.on('afterrender', function() {
            var checkEl   = Ext.get('invoiceForwardCheckAll'),
                uncheckEl = Ext.get('invoiceForwardUncheckAll');
            
            me.mon(checkEl, 'click', me.checkBoxClick.bind(me));
            me.mon(uncheckEl, 'click', me.checkBoxClick.bind(me));
        });
    },

    getIncludeOptions: function() {
        var me      = this,
            options = [
                { boxLabel: NP.Translator.translate('Payment History'), inputValue: 'payments' },
                { boxLabel: NP.Translator.translate('History Log'), inputValue: 'history' },
                { boxLabel: NP.Translator.translate('Notes'), inputValue: 'notes' },
                { boxLabel: NP.Translator.translate('Budget Overage Notes'), inputValue: 'overageNotes' }
            ];

        if (NP.Security.hasPermission(6001)) {
            options.push({ boxLabel: NP.Translator.translate('On Hold Reason'), inputValue: 'holdReason' });
        }

        options.push(
            { boxLabel: NP.Translator.translate('Include Main Image Only'), inputValue: 'mainImage' },
            { boxLabel: NP.Translator.translate('Include All Images'), inputValue: 'allImages' },
            { boxLabel: NP.Translator.translate('Header Custom Fields'), inputValue: 'headerCustom' },
            { boxLabel: NP.Translator.translate('Line Item Custom Fields'), inputValue: 'lineCustom' }
        );

        return options;
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
            }
        }
    },

    checkBoxClick: function(e) {
        var me      = this,
            boxes   = me.query('[name="include"]'),
            checked = (e.getTarget().id == 'invoiceForwardCheckAll') ? true : false;

        Ext.Array.each(boxes, function(box) {
            box.setValue(checked);
        });
    },

    getForwardValue: function() {
        var me         = this,
            form       = me.down('form').getForm(),
            forwardTo  = form.findField('forward_to').getGroupValue(),
            val;

        if (forwardTo == 'user') {
            val = form.findField('users').getValue();
        } else {
            val = form.findField('email_address').getValue();
        }

        return val;
    },

    getIncludes: function() {
        var me       = this,
            includes = me.down('[name="include_group"]').getValue();

        if (includes.include) {
            if (Ext.isArray(includes.include)) {
                return includes.include;
            } else {
                return [includes.include];
            }
        }

        return [];
    },

    isValid: function() {
        var me         = this,
            form       = me.down('form').getForm(),
            isValid    = form.isValid(),
            emailField = form.findField('email_address'),
            forwardTo  = form.findField('forward_to').getGroupValue();

        return isValid;
    }
});
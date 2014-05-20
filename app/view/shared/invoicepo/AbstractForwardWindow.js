/**
 * The invoice/PO forward window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.AbstractForwardWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.shared.invoicepo.abstractforwardwindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
        'NP.lib.core.Security',
    	'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Message',
        'NP.view.shared.UserAssigner',
        'NP.store.user.Userprofiles',
        'NP.view.shared.YesNoField'
    ],

    layout     : 'fit',
    width      : 800,
    height     : 475,
    border     : false,
    modal      : true,
    minimizable: false,
    autoScroll : true,
    isVendorFwd: false,

    initComponent: function() {
    	var me = this;

        // Set a default width for fields to be used in all functions
        me.labelWidth = 150;

        me.title = NP.Translator.translate(me.getDisplayName() + ' Forward');

        me.items = [{
            xtype: 'form',
            bodyPadding: 8,
            tbar : [
                { xtype: 'shared.button.cancel', handler: function() { me.close(); } },
                { xtype: 'shared.button.message' }
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
                    items: me.getLeftColumn()
                },
                me.getRightColumn()
            ]
        }];

    	me.callParent(arguments);

        me.on('afterrender', function() {
            var checkEl   = Ext.get(me.getShortName() + 'ForwardCheckAll'),
                uncheckEl = Ext.get(me.getShortName() + 'ForwardUncheckAll');
            
            if (checkEl) {
                me.mon(checkEl, 'click', me.checkBoxClick.bind(me));
                me.mon(uncheckEl, 'click', me.checkBoxClick.bind(me));
            }
        });
    },

    getLeftColumn: function() {
        var me  = this,
            col = [
                {
                    xtype     : 'displayfield',
                    fieldLabel: NP.Translator.translate('Current Email Address'),
                    labelWidth: me.labelWidth,
                    value     : NP.Security.getUser().get('email_address')
                },{
                    xtype     : 'displayfield',
                    fieldLabel: NP.Translator.translate(me.getDisplayName() + ' Number'),
                    labelWidth: me.labelWidth,
                    value     : me.entity.get(me.getLongName() + '_ref')
                }
            ];

        if (me.isVendorFwd) {
            col.push(
                {
                    xtype     : 'displayfield',
                    fieldLabel: NP.Translator.translate('Vendor Name'),
                    labelWidth: me.labelWidth,
                    value     : me.vendor.get('vendor_name')
                },{
                    xtype: 'hidden',
                    name : 'forward_to',
                    value: 'vendor'
                }
            );
        } else {
            col.push({
                xtype     : 'radiogroup',
                fieldLabel: NP.Translator.translate('Forward To'),
                labelWidth: me.labelWidth,
                defaults  : { name: 'forward_to' },
                columns   : [50,105,70],
                items     : [
                    { boxLabel: NP.Translator.translate('User'), inputValue: 'user', checked: true },
                    { boxLabel: NP.Translator.translate('Email Address'), inputValue: 'email' },
                    { boxLabel: NP.Translator.translate('Vendor'), inputValue: 'vendor' }
                ],
                listeners: {
                    change: me.changeForwardTo.bind(me)
                }
            });
        }

        col.push(me.getRecipientOptions());

        if (me.isVendorFwd) {
            col.push({
                xtype     : 'shared.yesnofield',
                fieldLabel: NP.Translator.translate('Combine split lines'),
                labelWidth: me.labelWidth,
                name      : 'combine_split',
                value     : 0
            });
        } else {
            col.push({
                xtype: 'hidden',
                name : 'combine_split',
                value: 0
            });
        }

        col.push({
            xtype     : 'textarea',
            name      : 'message',
            fieldLabel: NP.Translator.translate('Message'),
            labelAlign: 'top',
            margin    : '16 0 0 0',
            allowBlank: false,
            maxLength : 2000
        });

        return col;
    },

    getRecipientOptions: function() {
        var me         = this,
            emailField = {
                xtype     : 'textfield',
                name      : 'email_address',
                fieldLabel: NP.Translator.translate('Email'),
                labelWidth: me.labelWidth,
                vtype     : 'email',
                allowBlank: (me.isVendorFwd) ? false : true,
                value     : (me.isVendorFwd) ? me.vendor.get('email_address') : ''
            };

        if (me.isVendorFwd) {
            return emailField;
        } else {
            return {
                xtype     : 'container',
                itemId    : me.getShortName() + 'ForwardCard',
                layout    : 'card',
                defaults  : { labelAlign: 'top' },
                items     : [
                    {
                        xtype     : 'shared.userassigner',
                        height    : 150,
                        allowBlank: false,
                        store     : {
                            type   : 'user.userprofiles',
                            service: 'UserService',
                            action : 'getForForward',
                            extraParams: {
                                table_name : me.getLongName(),
                                tablekey_id: me.entity.get(me.getLongName() + '_id')
                            },
                            sorters: [{
                                property: 'person_lastname'
                            }],
                            autoLoad: true
                        }
                    },
                    emailField
                ]
            };
        }
    },

    getRightColumn: function() {
        var me = this;

        return {
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
                    html : '<b>Include:</b> <a id="' + me.getShortName() + 'ForwardCheckAll" class="inline-links">Check All</a> | <a id="' + me.getShortName() + 'ForwardUncheckAll" class="inline-links">Uncheck All</a>'
                },{
                    xtype     : 'checkboxgroup',
                    layout    : 'vbox',
                    name      : 'include_group',
                    defaults  : { name: 'include', padding: '0 8 0 0' },
                    items     : me.getIncludeOptions()
                }
            ]
        };
    },

    changeForwardTo: function(field, newVal, oldVal) {
        var me         = this,
            cardPanel  = me.down('#' + me.getShortName() + 'ForwardCard'),
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
            checked = (e.getTarget().id == me.getShortName() + 'ForwardCheckAll') ? true : false;

        Ext.Array.each(boxes, function(box) {
            box.setValue(checked);
        });
    },

    getCombineSplit: function() {
        var me           = this,
            combineSplit = me.down('form').getForm().findField('combine_split');

        if (combineSplit.getGroupValue) {
            return combineSplit.getGroupValue();
        } else {
            return combineSplit.getValue();
        }
    },

    getForwardTo: function() {
        var me        = this,
            forwardTo = me.down('form').getForm().findField('forward_to');

        if (forwardTo.getGroupValue) {
            return forwardTo.getGroupValue();
        } else {
            return forwardTo.getValue();
        }
    },

    getForwardValue: function() {
        var me         = this,
            form       = me.down('form').getForm(),
            forwardTo  = me.getForwardTo(),
            val;

        if (forwardTo == 'user') {
            val = form.findField('users').getValue();
        } else {
            val = form.findField('email_address').getValue();
        }

        return val;
    },

    getIncludes: function() {
        var me            = this,
            includes      = me.down('[name="include_group"]'),
            includeSubmit = [];

        if (includes) {
            includes = includes.getValue();
            if (includes.include) {
                if (Ext.isArray(includes.include)) {
                    includeSubmit = includes.include;
                } else {
                    includeSubmit = [includes.include];
                }
            }
        }

        if (me.getCombineSplit() == 1) {
            includeSubmit.push('combineSplit');
        }

        return includeSubmit;
    },

    isValid: function() {
        return this.down('form').getForm().isValid();
    },

    getDisplayName: function() {
        throw 'You must override abstract getDisplayName() function in concrete class';
    },

    getShortName: function() {
        throw 'You must override abstract getShortName() function in concrete class';
    },

    getLongName: function() {
        throw 'You must override abstract getLongName() function in concrete class';
    },

    getIncludeOptions: function() {
        throw 'You must override abstract getIncludeOptions() function in concrete class';
    }
});
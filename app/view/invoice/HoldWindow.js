/**
 * The invoice on hold window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.HoldWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.invoice.holdwindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
        'NP.lib.ui.ComboBox',
    	'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save',
        'Ext.form.Panel',
        'NP.store.shared.Reasons'
    ],

    layout     : 'fit',
    width      : 640,
    height     : 480,
    border     : false,
    modal      : true,
    minimizable: false,
    autoScroll : true,

    initComponent: function() {
    	var me           = this;

        me.title = NP.Translator.translate('Put Invoice On Hold');

        me.tbar = [
            { itemId: 'invoiceOnHoldCancelBtn', xtype: 'shared.button.cancel' },
            { itemId: 'invoiceOnHoldSaveBtn', xtype: 'shared.button.save' }
        ];

        me.items = [{
            xtype      : 'form',
            bodyPadding: 8,
            layout     : {
                type : 'vbox',
                align: 'stretch'
            },
            items      : [
                {
                    xtype       : 'customcombo',
                    fieldLabel  : NP.Translator.translate('Reason'),
                    labelAlign  : 'top',
                    name        : 'reason_id',
                    displayField: 'reason_text',
                    valueField  : 'reason_id',
                    store       : {
                        type       : 'shared.reasons',
                        service    : 'PicklistService',
                        action     : 'getHoldReasons',
                        autoLoad   : true
                    },
                    margin    : '0 0 8 0',
                    allowBlank: false
                },{
                    xtype     : 'textarea',
                    name      : 'note',
                    fieldLabel: NP.Translator.translate('Hold Note'),
                    labelAlign: 'top',
                    flex      : 1,
                    maxLength : 2000
                }
            ]
        }];

    	me.callParent(arguments);
    }
});
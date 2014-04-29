/**
 * The invoice/PO reject window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.ChangePropertyWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.shared.invoicepo.changepropertywindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
        'NP.view.shared.PropertyCombo',
    	'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save'
    ],

    layout     : 'fit',
    width      : 480,
    height     : 100,
    modal      : true,
    minimizable: false,
    autoScroll : true,

    // Type can be set to invoice or po
    type: null,

    initComponent: function() {
    	var me = this;

        if (!Ext.Array.contains(['invoice','po'], me.type)) {
            throw 'The "type" config is required and must be set to either "invoice" or "po"';
        }

        me.title = NP.Translator.translate('Change Property');

        me.tbar = [
            { xtype: 'shared.button.cancel', handler: function() { me.close(); } },
            { itemId: me.type + 'ChangePropertySaveBtn', xtype: 'shared.button.save' }
        ];

        me.items = [{
            xtype      : 'panel',
            bodyPadding: 8,
            border     : false,
            layout     : 'form',
            items      : [{
                xtype: 'shared.propertycombo',
                store: me.propertyStore
            }]
                
        }];

    	me.callParent(arguments);
    }
});
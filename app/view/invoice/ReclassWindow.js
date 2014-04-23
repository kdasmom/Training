/**
 * The invoice void window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.ReclassWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.invoice.reclasswindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
    	'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save'
    ],

    layout     : 'fit',
    width      : 480,
    height     : 360,
    border     : false,
    modal      : true,
    minimizable: false,
    autoScroll : true,

    initComponent: function() {
    	var me = this;

        me.title = NP.Translator.translate('Reclass Invoice');

        me.items = [{
            xtype      : 'panel',
            layout     : 'fit',
            bodyPadding: '0 8 8 8',
            tbar       : [
                { xtype: 'shared.button.cancel', handler: function() { me.close() } },
                { itemId: 'invoiceReclassSaveBtn', xtype: 'shared.button.save' }
            ],
            items: [{
                xtype     : 'textarea',
                name      : 'reclass_notes',
                fieldLabel: NP.Translator.translate('Reclass Notes'),
                labelAlign: 'top',
                allowBlank: false,
                maxLength : 2000
            }]
        }];

    	me.callParent(arguments);
    }
});
/**
 * Window for Use Template functionality
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.UseTemplateWindow', {
    extend: 'Ext.window.Window',
    alias:  'widget.invoice.usetemplatewindow',

    requires: [
    	'NP.lib.core.Translator',
    	'NP.lib.core.Net'
    ],

    title      : 'Use Template',
    width      : 800,
    height     : 600,
    bodyPadding: 8,
    modal      : true,
    layout     : {
        type : 'vbox',
        align: 'stretch'
    },

	hideTemplateRemoveBtn: true,
	invoice_id           : '',
	property_id          : null,
	vendorsite_id        : null,
	utilityaccount_id    : null,

    initComponent: function() {
    	var me = this;

    	me.title = NP.Translator.translate(me.title);

    	me.tbar = [
	        {
	            xtype: 'shared.button.cancel',
	            text: NP.Translator.translate('Cancel'),
	            listeners: {
	                click: function() {
	                    me.close();
	                }
	            }
	        },{
	            itemId   : 'templateUseBtn',
	            xtype    : 'shared.button.save',
	            text     : NP.Translator.translate('Use'),
	            disabled : true,
	            listeners: {
	                click: function() {
	                	var invoice_id = me.down('[name="invoice_id"]').getValue();

	                	me.fireEvent('usetemplate', me, invoice_id);
	                }
	            }
	        },{
	            itemId   : 'templateRemoveBtn',
	            xtype    : 'shared.button.delete',
	            text     : NP.Translator.translate('Remove Selected Template'),
	            hidden   : me.hideTemplateRemoveBtn,
	            disabled : (me.invoice_id == '') ? true : false,
	            listeners: {
	                click: function() {
	                	me.fireEvent('removetemplate', me);
	                }
	            }
	        }
	    ];

	    me.items = [
	        {
	            xtype            : 'customcombo',
	            fieldLabel       : NP.Translator.translate('Choose a template'),
	            name             : 'invoice_id',
	            valueField       : 'invoice_id',
	            displayField     : 'template_name',
	            store            : {
	                type       : 'invoice.invoices',
	                service    : 'InvoiceService',
	                action     : 'getTemplatesByCriteria',
	                extraParams : {
	                    'property_id'      : me.property_id,
	                    'vendorsite_id'    : me.vendorsite_id,
	                    'utilityaccount_id': me.utilityaccount_id
	                },
	                autoLoad: true,
	                listeners: {
	                    load: function() {
	                        var combo = me.down('[name="invoice_id"]'),
	                            store = combo.getStore(),
	                            rec;

	                        if (me.invoice_id != '') {
	                            rec = store.findRecord('invoice_id', me.invoice_id);
	                            combo.setValue(rec);
	                            combo.fireEvent('select', combo, [rec]);
	                        }
	                    }
	                }
	            },
	            listeners        : {
	                select: function(combo, recs) {
	                    var panel  = me.down('#invoicePrintView'),
	                        useBtn = me.down('#templateUseBtn');

	                    if (recs.length) {
	                        NP.Net.remoteCall({
	                            requests: {
                                    service   : 'InvoiceService',
                                    action    : 'getInvoiceAsHtml',
                                    invoice_id: recs[0].get('invoice_id')
                                },
	                            success: function(result) {
	                                panel.update(result);
	                                panel.show();
	                                useBtn.enable();
	                            }
	                        });
	                    } else {
	                        useBtn.disable();
	                        panel.update('');
	                        panel.hide();
	                    }
	                }
	            }
	        },{
	            xtype      : 'panel',
	            itemId     : 'invoicePrintView',
	            bodyPadding: 8,
	            hidden     : true,
	            flex       : 1,
	            autoScroll : true,
	            html       : ''
	        }
	    ];

	    me.callParent(arguments);

	    me.addEvents('usetemplate','removetemplate');
    }
});
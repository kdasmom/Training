/**
 * The notes part of the invoice view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.ViewNotes', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.shared.invoicepo.viewnotes',

    requires: [
    	'NP.lib.core.Config',
    	'Ext.layout.container.Table'
    ],

    layout: {
		type   : 'table',
		columns: 2,
		tableAttrs: {
			style: {
				width : '100%'
			}
		},
		tdAttrs: {
			style: {
				width : '50%',
				padding: '0 8px 4px 0'
			},
			valign: 'top'
		}
    },
    
    initComponent: function() {
    	var me = this;

    	if (Ext.isEmpty(me.type) || !Ext.Array.contains(['po','invoice'], me.type)) {
    		throw 'Invalid "type" config value specified. "type" must be set to either "invoice" or "po"';
    	}

        me.longName = (me.type == 'invoice') ? 'invoice' : 'purchaseorder';

    	me.title = NP.Translator.translate('Notes');

    	me.defaults = { labelAlign: 'top', width: '100%' };

    	me.items = [
    		{
				xtype     : 'textarea',
				fieldLabel: NP.Translator.translate('Notes'),
				name      : me.longName + '_note'
    		}
    	];

    	if (
    		(me.type == 'invoice' && NP.Config.getSetting('PN.InvoiceOptions.BudgetOverNotesOn', '0') == '1')
    		|| (me.type == 'po' && NP.Config.getSetting('PN.POOptions.BudgetOverNotesOn', '0') == '1')
    	) {
    		me.items.push({
    			xtype     : 'textarea',
				fieldLabel: NP.Translator.translate('Budget Overage Notes'),
				name      : me.longName + '_budgetoverage_note'
    		});
    	}

    	if (me.type == 'invoice' && NP.Config.getSetting('PN.InvoiceOptions.HoldOn') == '1') {
    		me.items.push({
    			xtype     : 'displayfield',
    			fieldLabel: NP.Translator.translate('On Hold Notes'),
    			name      : 'invoice_onhold_notes',
				hidden    : true,
				listeners: {
					change: me.onNoteFieldChange
				}
    		});
    	}

        me.items.push(
            {
                xtype     : 'displayfield',
                fieldLabel: NP.Translator.translate('Rejection Notes'),
                name      : me.longName + '_reject_note',
                hidden    : true,
                listeners: {
                    change: me.onNoteFieldChange
                }
            },{
                xtype     : 'displayfield',
                fieldLabel: NP.Translator.translate('Rejection Reason'),
                name      : 'reject_reason',
                hidden    : true,
                listeners: {
                    change: me.onNoteFieldChange
                }
            }
        );

    	if (me.type == 'invoice') {
	    	me.items.push({
	    		xtype     : 'displayfield',
				fieldLabel: NP.Translator.translate('VendorConnect Notes'),
				name      : 'vendoraccess_notes',
				hidden    : true,
				listeners: {
					change: me.onNoteFieldChange
				}
			});
		}

    	me.callParent(arguments);
    },

    onNoteFieldChange: function(field, newVal) {
        if (newVal === null || newVal == '') {
			field.hide();
		} else {
			field.show();
		}
    }
});
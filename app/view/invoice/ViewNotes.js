/**
 * The notes part of the invoice view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.ViewNotes', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.invoice.viewnotes',

    requires: [
    	'NP.lib.core.Config',
    	'Ext.layout.container.Table'
    ],

    // For localization
	title               : 'Notes',
	noteFieldLbl        : 'Notes',
	rejectNoteFieldLbl  : 'Rejection Notes',
	rejectReasonFieldLbl: 'Rejection Reason',
	budgetNoteFieldLbl  : 'Budget Overage Notes',
	holdNoteFieldLbl    : 'On Hold Notes',
	vcNoteFieldLbl      : 'VendorConnect Notes',

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

    	me.defaults = { labelAlign: 'top', width: '100%' };

    	me.items = [
    		{
				xtype     : 'textarea',
				fieldLabel: me.noteFieldLbl,
				name      : 'invoice_note'
    		},{
    			xtype     : 'displayfield',
    			fieldLabel: me.rejectNoteFieldLbl,
    			name      : 'invoice_reject_note',
				hidden    : true,
				listeners: {
					change: me.onNoteFieldChange
				}
    		},{
    			xtype     : 'displayfield',
    			fieldLabel: me.rejectReasonFieldLbl,
    			name      : 'invoice_reject_reason',
				hidden    : true,
				listeners: {
					change: me.onNoteFieldChange
				}
    		}
    	];

    	if (NP.Config.getSetting('PN.InvoiceOptions.BudgetOverNotesOn') == '1') {
    		me.items.push({
    			xtype     : 'textarea',
				fieldLabel: me.budgetNoteFieldLbl,
				name      : 'invoice_budgetoverage_note'
    		});
    	}

    	if (NP.Config.getSetting('PN.InvoiceOptions.HoldOn') == '1') {
    		me.items.push({
    			xtype     : 'displayfield',
    			fieldLabel: me.holdNoteFieldLbl,
    			name      : 'invoice_hold_note',
				hidden    : true,
				listeners: {
					change: me.onNoteFieldChange
				}
    		});
    	}

    	me.items.push({
    		xtype     : 'displayfield',
			fieldLabel: me.vcNoteFieldLbl,
			name      : 'vendoraccess_notes',
			hidden    : true,
			listeners: {
				change: me.onNoteFieldChange
			}
		});

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
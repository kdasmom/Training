/**
 * Created by Andrey Baranov
 * date: 2/5/14 11:56 AM
 */

Ext.define('NP.view.systemSetup.TemplateObjectsPicker', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.systemsetup.templateobjectspicker',

	requires: [
		'NP.lib.core.Security',
		'Ext.grid.plugin.DragDrop'
	],

	enableDragDrop: true,
	hideHeaders   : true,
	columns       : [
		{
			header: 'Title',
			dataIndex: 'title',
			flex: 1
		}
	],
	viewConfig    : {
		plugins: {
			ddGroup   : 'templates',
			ptype     : 'gridviewdragdrop',
			enableDrop: false
		}
	},

	title  : 'Unassigned objects',
	data: [],

	initComponent: function() {
		var me = this,
			title = NP.Translator.translate(me.title);

		me.data = [
				[0, 'po_items_logo', 'Logo'],
				[1, 'po_items_createdby', 'Created By'],
				[2, 'po_items_lastapprover', 'Last Approver'],
				[3, 'po_items_status', 'Status'],
				[4, 'po_items_date', 'PO Date'],
				[5, 'po_items_number', 'PO Number'],
				[6, 'po_items_vendor', 'Vendor'],
				[7, 'po_items_billto', 'Bill To'],
				[8, 'po_items_shipto', 'Ship To'],
				[9, 'po_items_headercustomfields', 'Header Custom Fields'],
				[10, 'po_items_poheadertext', 'PO Header Text'],
				[11, 'po_items_pofootertext', 'PO Footer Text'],
				[12, 'po_items_additionaltext', 'Additional Text'],
				[13, 'po_items_lineitemdetails', 'Line Item Details'],
				[14, 'po_items_pagenumber', 'Page 1 of X'],
				[15, 'po_items_history', 'History'],
				[16, 'po_items_poforwards', 'PO Forwards'],
				[17, 'po_items_posenttovendor', 'PO Sent to Vendors'],
				[18, 'po_items_notes', 'Notes'],
				[19, 'po_items_initials', 'Initials'],
				[20, 'po_items_overagenotes', 'Budget Overage Notes']
			];


		if (!me.store) {

			me.store = Ext.create('Ext.data.ArrayStore', {
				fields: [
					{ name: 'index' },
					{ name: 'field' },
					{ name: 'title' }
				],
				data: me.data,
				autoLoad: true
			});
		}

		this.callParent(arguments);
	},

	removeRecord: function(index) {
		var me = this;

		me.data.splice(index, 1);
		me.getStore().reload();
	},

	addRecord: function(index, record) {
		var me = this,
			insertindex = 0;

		Ext.each(me.data, function(recorditem, cIndex) {
			if (recorditem[0] > index) {
				insertindex = cIndex;
				return false;
			}
		});

		me.data.splice(insertindex, 0, record);
		me.getStore().reload();
	}
});
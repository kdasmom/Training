/**
 * Created by Andrey Baranov
 * date: 12/2/13 3:11 PM
 */

Ext.define('NP.view.catalog.VcOrdersGrid', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.catalog.vcordersgrid',

	requires: [
		'NP.view.shared.gridcol.ButtonImg',
		'NP.lib.core.Util'
	],

	paging: true,
	overflowY: 'scroll',

	initComponent: function() {
		var that = this;

		this.columns = [
			{
				xtype: 'shared.gridcol.buttonimg',
				renderer: function(val, meta, rec) {
					return '<div class="remove"><img src="resources/images/buttons/delete.gif" title="Remove" alt="Remove" class="remove"/>&nbsp; Remove</div>';
				},
				flex: 0.2
			},
			{
				dataIndex: 'vcitem_number',
				text: NP.Translator.translate('Item number'),
				flex: 0.2
			},
			{
				dataIndex:'vcitem_desc',
				text: NP.Translator.translate('Item description'),
				flex: 0.5
			},
			{
				text: NP.Translator.translate('Item details'),
				xtype: 'actioncolumn',
				items: [
					{
						icon   : 'resources/images/buttons/search.gif',
						tooltip: 'Details',
						handler: function(gridView, rowIndex, colIndex) {
							var grid = gridView.ownerCt;
							grid.fireEvent('showdetails', grid, grid.getStore().getAt(rowIndex), rowIndex);
						}
					}
				],
				align: 'center',
				flex: 0.2
			},
			{
				dataindex: 'vcitem_price',
				renderer: function(val, meta, rec) {
					return NP.Util.currencyRenderer(rec.get('vcitem_price'));
				},
				text: NP.Translator.translate('Item price'),
				flex: 0.2,
				align: 'right'
			},
			{
				dataIndex: 'vcitem_uom',
				text: NP.Translator.translate('Unit of measurement'),
				flex: 0.2
			},
			{
				dataIndex: 'vcorder_qty',
				text: NP.Translator.translate('Quantity'),
				align: 'center',
				flex: 0.1
			},
			{
				text: NP.Translator.translate('Item to total'),
				renderer: function (val, meta, record) {
					return NP.Util.currencyRenderer(record.get('vcitem_price') * record.get('vcorder_qty'));
				},
				summaryType: function(records){
					var i = 0,
						length = records.length,
						total = 0,
						record;

					for (; i < length; ++i) {
						record = records[i];
						total += record.get('vcitem_price') * record.get('vcorder_qty');
					}
					return total;
				},
				summaryRenderer: function (val) {
					return 'Subtotal: ' + NP.Util.currencyRenderer(val);
				},
				flex: 0.2,
				align: 'right'
			},
			{
				flex: 0.2,
				align: 'center',
				renderer: function(val, meta, rec) {
					return Ext.String.format('<input name="po_' + rec.get('vc_id') + '[]" type="checkbox" value="{0}">',rec.get('vcorder_id'));
				},
				summaryType: function(records) {
					return records[0].get('vc_id');
				},
				summaryRenderer: function(val) {
					return '<input type="button" class="createpo" data-vc="' + val + '" value="' + NP.Translator.translate('CREATE PO') + '"/>';
				}
			}
		];

		this.listeners = {
			click: {
				element: 'body',
				delegate: '.x-grid-cell',
				fn: function(e, target, rec, rec2) {
//					create po action
					var btn = Ext.fly(target).down('.createpo');
					var vcid;

					if (btn) {
						vcid = Ext.fly(btn).getAttribute('data-vc');
						var aunarray = "";
						var check = document.getElementsByName('po_'+ vcid +'[]');
						var checkLength = check.length;
						for(var i=0; i < checkLength; i++){
							if(check[i].checked){
								aunarray = aunarray+","+check[i].value;
							}
						}
						if (aunarray == "") {
							Ext.Msg.alert(NP.Translator.translate('Error'), NP.Translator.translate('You must select at least one item.'));
						} else {

						}
					}
				}
			}
		};
		var groupingSummary = Ext.create('Ext.grid.feature.GroupingSummary', {
			groupHeaderTpl: '{name}<div style="float: right; margin-right: 20px;"><a id="selectAll" data-vc="{vc_id}" href="javascript:void(0)">Select all</a>/<a href="javascript:void(0)">Unselect all</a></div>',
			ftype: 'groupingsummary',
			collapsible: false
		});

		this.store = Ext.create('NP.store.catalog.VcOrders', {
			service    	: 'CatalogService',
			action     	: 'getOrders',
			groupField	: 'vc_catalogname',
			extraParams: {
				userprofile_id: NP.Security.getUser().get('userprofile_id')
			},
			paging     	: true,
			autoLoad	: true
		});

		this.features = [groupingSummary];

//		this.listeners = {
//			afterrender: function() {
//				that.mon(Ext.get('selectAll'), 'click', function() {
//					that.fireEvent('selectall');
//				});
//			}
//		};

		this.callParent(arguments);
	}

});
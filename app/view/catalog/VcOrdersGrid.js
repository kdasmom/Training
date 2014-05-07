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

	border: false,

	paging: true,
	stateful: true,
	stateId : 'vcorders_grid',
	changedRecords: {},

	initComponent: function() {
		var that = this;

//		plugins and features
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1,
			listeners: {
				edit: function(editor, e, eOpts) {
					that.changedRecords[e.record.get('vcorder_id')] = {
						vc_id:  e.record.get('vc_id'),
						value:  e.value
					};
				}
			}
		});

		var groupingSummary = Ext.create('Ext.grid.feature.GroupingSummary', {
			groupHeaderTpl: '<div style="height: 15px;"><div style="float: left;">{name}</div><div style="float: right; margin-right: 20px;"><a class="select-all" data-vc="{[values.rows[0].data.vc_id]}" href="javascript:void(0)">Select all</a>/<a href="javascript:void(0)" data-vc="{[values.rows[0].data.vc_id]}" href="javascript:void(0)" class="unselect-all">Unselect all</a></div></div>',
			ftype: 'groupingsummary',
			collapsible: false
		});

//		columns
		this.columns = [
			{
				xtype: 'shared.gridcol.buttonimg',
				dataIndex: 'removebutton',
				renderer: function(val, meta, rec) {
					return '<div class="remove" style="cursor: pointer;"><img src="resources/images/buttons/delete.gif" title="Remove" alt="Remove" class="remove"/>&nbsp; Remove</div>';
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
				flex: 0.5,
				renderer: function(val, meta, rec) {
					if (!rec.raw.vcitem_status) {
						val += '<br/><b style="color: red;">This item is no longer available for order</b>';
					}

					return val;
				}
			},
			{
				text: NP.Translator.translate('Item details'),
				xtype: 'actioncolumn',
				dataIndex:'actioncolumn',
				getClass: function (v, meta, rec, rowIndex) {
					if (rec.raw.vc_catalogtype !== 'excel') {
						return '';
					} else {
						return 'search-btn';
					}
				},
				handler: function(gridView, rowIndex, colIndex) {
					var grid = gridView.ownerCt;
					grid.fireEvent('showdetails', grid, grid.getStore().getAt(rowIndex), rowIndex, true);
				},
				align: 'center',
				flex: 0.2
			},
			{
				dataIndex: 'vcitem_price',
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
				xtype: 'numbercolumn',
				text: NP.Translator.translate('Quantity'),
				align: 'center',
				flex: 0.1,
				border: 1,
				format: '0',
				editor: {
					xtype: 'numberfield',
					allowBlank: false,
					minValue: 0,
					maxValue: 100000,
					decimalPrecision: 0
				},
				summaryType: function(records) {
					return records[0].get('vc_id');
				},
				summaryRenderer: function(val) {
					return '<input type="button" class="updatepo" data-vc="' + val + '" value="' + NP.Translator.translate('Update') + '"/>';
				}
			},
			{
				text: NP.Translator.translate('Item to total'),
				dataIndex: 'itemtototal',
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
				dataIndex: 'createpo',
				renderer: function(val, meta, rec) {
					if (rec.raw.vcitem_status) {
						return Ext.String.format('<input name="po_' + rec.get('vc_id') + '[]" type="checkbox" value="{0}">',rec.get('vcorder_id'));
					}
					return '';
				},
				summaryType: function(records) {
					return records[0].get('vc_id');
				},
				summaryRenderer: function(val) {
					return '<input type="button" class="createpo" data-vc="' + val + '" value="' + NP.Translator.translate('Create PO') + '"/>';
				}
			}
		];

		this.listeners = {
			click: {
				element: 'body',
				delegate: '.x-grid-cell',
				fn: function(e, target) {
					var btnpo = Ext.fly(target).down('.createpo');
					var btnupdate = Ext.fly(target).down('.updatepo');
					var vcid;

//					create po action
					if (btnpo) {
						vcid = Ext.fly(btnpo).getAttribute('data-vc');
						var aunarray = [];
						var check = document.getElementsByName('po_'+ vcid +'[]');
						var checkLength = check.length;
						for(var i=0; i < checkLength; i++){
							if(check[i].checked){
								aunarray.push(check[i].value);
							}
						}
						if (aunarray.length == 0) {
							Ext.Msg.alert(NP.Translator.translate('Error'), NP.Translator.translate('You must select at least one item.'));
						} else {
							that.fireEvent('createorder', vcid, aunarray.join());
						}
					}
//					update action
					if (btnupdate) {
						vcid = Ext.fly(btnupdate).getAttribute('data-vc');
						that.fireEvent('updateorder', that.changedRecords, vcid);
						that.changedRecords = {};
					}
				}
			},
			groupclick: function (view, node, group, e, eOpts) {
				var link = Ext.fly(e.target);
				var vcid;
				var setChecked = false;

				if (link.hasCls('select-all') || link.hasCls('unselect-all')) {
					if (link.hasCls('select-all')) {
						setChecked = true;
					}

					vcid = Ext.fly(link).getAttribute('data-vc');
					var check = document.getElementsByName('po_'+ vcid +'[]');
					var checkLength = check.length;
					for(var i=0; i < checkLength; i++){
						check[i].checked = setChecked;
					}
				}
			}
		};

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
		this.plugins = [cellEditing];

		this.callParent(arguments);
	}

});
/**
 * Created by Andrey Baranov
 * date: 2/11/14 5:48 PM
 */

Ext.define('NP.view.systemSetup.TemplatesGrid', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.systemsetup.templatesgrid',

	requires: [
		'NP.lib.core.Config'
	],

	initComponent: function() {
		var me = this;

		me.tbar = [
			{
				xtype: 'shared.button.new',
				text: NP.Translator.translate('New template')
			}
		];

		me.columns = [
			{
				dataIndex: 'Print_Template_Name',
				text: NP.Translator.translate('Template name'),
				flex: 1
			},
			{
				text: NP.Translator.translate('Assigned To'),
				flex: 0.5,
				renderer: function(val, meta, record) {
					return NP.Translator.translate('View Assignments')
				},
				tdCls: 'grid-clickable-col'
			},
			{
				dataIndex: 'Print_Template_LastUpdateDt',
				xtype: 'datecolumn',
				text: NP.Translator.translate('Last Updated Date'),
				flex: 0.3,
				format: 'm/d/Y'
			},
			{
				dataIndex: 'Print_Template_LastUpdateByUserName',
				text: NP.Translator.translate('Updated By'),
				flex: 0.5,
				renderer: function(val, meta, record) {
					return record.raw['Print_Template_LastUpdateByUserName'];
				}
			},
			{
				text: NP.Translator.translate('Edit'),
				flex: 0.2,
				renderer: function(val, meta, rec){
					return NP.Translator.translate('Edit')
				},
				tdCls: 'grid-clickable-col'
			},
			{
				xtype: 'actioncolumn',
				items: [
					{
						icon   : 'resources/images/buttons/copy.gif',
						tooltip: 'copy',
						handler: function(gridView, rowIndex, colIndex) {
							var grid = gridView.ownerCt;
							grid.fireEvent('deleterow', grid, grid.getStore().getAt(rowIndex), rowIndex);
						}
					}
				],
				align: 'center',
				text: NP.Translator.translate('Copy'),
				flex: 0.2
			},
			{
				dataIndex: 'isActive',
				text: NP.Translator.translate('Status'),
				flex: 0.2,
				renderer: function(val, meta, record) {
					return val == 1 ? NP.Translator.translate('Active') : NP.Translator.translate('Inactive')
				}
			},
			{
				text: NP.Translator.translate('View Sample'),
				flex: 0.2,
				renderer: function(val, meta, rec){
					return NP.Translator.translate('View Sample')
				},
				tdCls: 'grid-clickable-col'
			},
			{
				text: NP.Translator.translate('View Attachment'),
				flex: 0.3,
				renderer: function(val, meta, record) {
					var templateObj = JSON.parse(record.get('Print_Template_Data'));
					if (!templateObj.template_attachment || parseInt(templateObj.template_attachment) == 0) {
						return '';
					}

					return NP.Translator.translate('View Attachment');;
				},
				tdCls: 'grid-clickable-col'
			}
		];

		me.store = Ext.create('NP.store.system.PrintTemplates', {
			service : 'PrintTemplateService',
			action  : 'getAll',
			autoLoad: true
		});

		me.callParent(arguments);
	}
});
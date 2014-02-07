/**
 * Created by Andrey Baranov
 * date: 2/3/14 7:17 AM
 */
Ext.define('NP.view.systemSetup.POPrintSettings', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.poprintsettings',

	requires: [
		'NP.lib.core.Translator',
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.New',
		'NP.view.systemSetup.TemplatesManager'
	],

	title: 'PO Print Settings',
	layout: {
		type: 'fit',
		align: 'stretch'
	},
	autoScroll: true,

	initComponent: function() {
		var me = this;

		me.title = NP.Translator.translate(me.title);

		me.tbar = [
			{
				xtype: 'shared.button.cancel',
				name: 'backToOverview'
			},
			{
				xtype: 'shared.button.new',
				text: NP.Translator.translate('New template')
			}
		];

		me.items = [
			{
				xtype: 'customgrid',
				columns: [
					{
						dataIndex: 'Print_Template_Name',
						text: NP.Translator.translate('Template name'),
						flex: 1
					},
					{
						text: NP.Translator.translate('Assigned To'),
						flex: 0.5
					},
					{
						dataIndex: 'Print_Template_LastUpdateDt',
						text: NP.Translator.translate('Last Updated Date'),
						flex: 0.3
					},
					{
						dataIndex: 'Print_Template_LastUpdateByUserName',
						text: NP.Translator.translate('Updated By'),
						flex: 0.5
					},
					{
						text: NP.Translator.translate('Edit'),
						flex: 0.2,
						renderer: function(val, meta, rec){
							return NP.Translator.translate('Edit')
						}
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
							return val == 1 ? NP.Translator.translate('Active') : NP.Translator.translate('InActive')
						}
					},
					{
						text: NP.Translator.translate('View Sample'),
						flex: 0.2,
						renderer: function(val, meta, rec){
							return NP.Translator.translate('View Sample')
						}
					},
					{
						text: NP.Translator.translate('View Attachment'),
						flex: 0.3
					}
				],
				store: Ext.create('NP.store.system.PrintTemplates', {
					service : 'PrintTemplateService',
					action  : 'getAll',
					autoLoad: true
				})
			},
			{
				xtype: 'systemsetup.templatesmanager',
				hidden: true,
				name: 'templatemanager',
				width: '100%'
			}
		];

		me.callParent(arguments);
	}
});
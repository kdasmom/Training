/**
 * Top bar that shows the Jump To Catalog option and quick Search for all catalog pages
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalog.TopBar', {
	extend: 'Ext.container.Container',
	alias: 'widget.catalog.topbar',

	requires: [
		'NP.view.catalog.JumpToCatalogForm',
		'NP.view.catalog.UserOrder',
		'NP.view.catalog.SearchForm'
	],

	layout: {
		type : 'vbox',
		align: 'stretch'
	},

	advancedSearch: false,

	initComponent: function() {
		var me = this;

		me.style = 'border-bottom-style: solid; border-bottom-width: 1px;';
		me.cls = 'x-toolbar-default';

		me.items = [
			{
				xtype: 'container',
				layout: 'hbox',
				items: [
					{
						xtype: 'container',
						layout: {
							type : 'vbox',
							align:'stretch'
						},
						flex: 1,
						items: [
							{
								xtype : 'catalog.jumptocatalogform',
								margin: '8px 0 8px 0'
							},
							{
								xtype: 'catalog.searchform',
								advancedSearch: me.advancedSearch,
								vc_id: me.vc_id
							}
						]
					},
					{
						xtype: 'catalog.userorder',
						align: 'right'
					}
				],
				padding: '5'
			}
		];

		me.callParent(arguments);
	}
});
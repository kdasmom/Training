/**
 * Created by Andrey Baranov
 * date: 2/6/14 4:26 AM
 */

Ext.define('NP.view.systemSetup.TemplateBodyCanvas', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.templatebodycanvas',

	requires: [
		'NP.lib.core.Translator',
		'NP.view.systemSetup.CanvasPanel'
	],

	layout: {
		type: 'vbox',
		align: 'stretch'
	},

	padding: '0 10',
	border: false,
	autoScroll: true,

	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate('Assigned Objects');

		me.items = [
			{

				items: [
					{
						xtype: 'panel',
						title: NP.Translator.translate('Logo'),
						layout: {
							type: 'hbox',
							align: 'stretch'
						},
						padding: '15 15 0 15',
						items: [
							{
								xtype    : 'systemsetup.canvaspanel',
								flex: 0.3,
								minHeight: 30
							},
							{
								xtype    : 'systemsetup.canvaspanel',
								flex: 0.3,
								minHeight: 30
							},
							{
								xtype    : 'systemsetup.canvaspanel',
								flex: 0.3,
								minHeight: 30
							}

						]
					},
					{
						xtype: 'panel',
						title: NP.Translator.translate('Header (repeats on each page)'),
						layout: {
							type: 'hbox',
							align: 'stretch'
						},
						padding: '15 15 0 15',
						items: [
							{
								xtype    : 'systemsetup.canvaspanel',
								flex: 0.5,
								minHeight: 30
							},
							{
								xtype    : 'systemsetup.canvaspanel',
								flex: 0.5,
								minHeight: 30
							}

						]
					},
					{
						xtype: 'panel',
						title: NP.Translator.translate('Header (first page only)'),
						layout: {
							type: 'hbox',
							align: 'stretch'
						},
						padding: '15 15 0 15',
						items: [
							{
								xtype    : 'systemsetup.canvaspanel',
								flex: 1,
								minHeight: 30
							}
						]
					},
					{
						xtype: 'panel',
						title: NP.Translator.translate('Footer (repeats on each page)'),
						layout: {
							type: 'hbox',
							align: 'stretch'
						},
						padding: '15 15 0 15',
						items: [
							{
								xtype    : 'systemsetup.canvaspanel',
								flex: 0.5,
								minHeight: 30
							},
							{
								xtype    : 'systemsetup.canvaspanel',
								flex: 0.5,
								minHeight: 30
							}
						]
					},
					{
						xtype: 'panel',
						title: NP.Translator.translate('Footer (last page only)'),
						layout: {
							type: 'hbox',
							align: 'stretch'
						},
						padding: '15',
						items: [
							{
								xtype    : 'systemsetup.canvaspanel',
								flex: 1,
								minHeight: 30
							}
						]
					}
				]
			}
		];

		this.callParent(arguments);
	}
});
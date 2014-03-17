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
	autoScroll: true,

	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate('Assigned Objects');

		me.items = [
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
						name: 'template_logo_left',
						flex: 0.3,
						minHeight: 30
					},
					{
						xtype    : 'systemsetup.canvaspanel',
						name: 'template_logo_center',
						flex: 0.3,
						minHeight: 30
					},
					{
						xtype    : 'systemsetup.canvaspanel',
						name: 'template_logo_right',
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
						name: 'template_header_left',
						flex: 0.5,
						minHeight: 30
					},
					{
						xtype    : 'systemsetup.canvaspanel',
						name: 'template_header_right',
						flex: 0.5,
						minHeight: 30
					}

				]
			},
			{
				xtype: 'panel',
				title: NP.Translator.translate('Header (first page only)'),
				layout: 'fit',
				padding: '15 15 0 15',
				items: [
					{
						xtype    : 'systemsetup.canvaspanel',
						flex: 1,
						minHeight: 30,
						name: 'template_header'
					}
				]
			},
			{
				xtype: 'panel',
				title: NP.Translator.translate('Body'),
				layout: 'fit',
				padding: '15 15 0 15',
				items: [
					{
						xtype    : 'systemsetup.canvaspanel',
						flex: 1,
						minHeight: 30,
						name: 'template_body'
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
						minHeight: 30,
						name: 'template_footer_left'
					},
					{
						xtype    : 'systemsetup.canvaspanel',
						flex: 0.5,
						minHeight: 30,
						name: 'template_footer_right'
					}
				]
			},
			{
				xtype: 'panel',
				title: NP.Translator.translate('Footer (last page only)'),
				layout: 'fit',
				padding: '15',
				items: [
					{
						xtype    : 'systemsetup.canvaspanel',
						name: 'template_footer',
						minHeight: 30,
						flex: 1
					}
				]
			}
		];

		this.callParent(arguments);
	}
});
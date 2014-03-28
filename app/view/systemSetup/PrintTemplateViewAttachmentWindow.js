/**
 * Created by Andrey Baranov
 * date: 2/19/14 2:17 PM
 */

Ext.define('NP.view.systemSetup.PrintTemplateViewAttachmentWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.systemsetup.printtemplateviewattachmentwindow',

	requires: [
		'NP.lib.core.Config'
	],

	title     : 'Print Template Attachment',

	width     : 640,
	height    : 480,
	autoScroll: true,
	
	modal     : true,
	draggable : true,

	initComponent: function() {
		var me = this;

		me.title = NP.Translator.translate(me.title);

		me.items = [
			{
				xtype : 'component',
				itemId: 'punchoutCatalogIFrame',
				width : '100%',
				height: '100%',
				autoEl: {
					tag: 'iframe',
					src: 'clients/' + NP.lib.core.Config.getAppName() + '/web/images/print_pdf/poprint_additional_' + me.templateid + '.pdf',
					width: '100%',
					height: '100%'
				}
			}
		];

		me.callParent(arguments);
	}
});
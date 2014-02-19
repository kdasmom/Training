/**
 * Created by Andrey Baranov
 * date: 2/19/14 1:55 PM
 */

Ext.define('NP.view.systemSetup.PrintTemplateViewImageWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.systemsetup.printtemplateviewimagewindow',

	requires: [
		'NP.lib.core.Config'
	],

	title           : 'Print Template Image',

	width           : '30%',
	height          : '30%',
	autoScroll		: true,

	modal           : true,
	draggable       : true,

	initComponent: function() {
		var me = this;

		me.title = NP.Translator.translate(me.title);

		me.items = [
			{
				xtype: 'image',
				name: 'templateimage',
				src: 'clients/' + NP.lib.core.Config.getAppName() + '/web/images/print_pdf/poprint_additional_image_' + me.templateid + '.jpg'
			}
		];

		me.callParent(arguments);
	}
});
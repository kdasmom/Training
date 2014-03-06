/**
 * Created by Andrey Baranov
 * date: 3/3/14 10:32 PM
 */

Ext.define('NP.view.integration.FailedSynchDetailsWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.integration.failedsynchdetailswindow',

	requires: [
		'NP.lib.core.Config'
	],

	layout          : 'fit',

	title           : 'Failed Synch Details',

	width           : '45%',
	height          : '40%',

	modal           : true,
	draggable       : true,
	resizable       : true,

	initComponent: function() {
		var me = this;

		me.title = NP.Translator.translate(me.title);

		if (me.transferred_datetm) {
			me.title += '<br/>' + Ext.util.Format.date(me.transferred_datetm, "m-d-Y") + ' ' + Ext.util.Format.date(me.transferred_datetm, "H:i:s");
		}

		me.items = [
			{
				xtype: 'customgrid',
				columns: [
					{
						text: NP.Translator.translate('Invoice Ref Number'),
						flex: 0.5
					},
					{
						text: NP.Translator.translate('Vendor Name(Vendor ID)'),
						flex: 0.5
					},
					{
						text: NP.Translator.translate('Header Property'),
						flex: 0.5
					},
					{
						text: NP.Translator.translate('Message'),
						flex: 1
					}
				],
				store: []
			}
		];
		me.callParent(arguments);
	}
});
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

		me.callParent(arguments);
	}
});
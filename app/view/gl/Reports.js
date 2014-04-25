/**
 * Created by Andrey Baranov
 * date: 4/4/2014 1:54 PM
 */

Ext.define('NP.view.gl.Reports', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.gl.reports',

	title: 'Reports',

	requires: [
		'NP.view.shared.button.Report'
	],

	autoScroll: true, 

	initComponent: function() {
		var me =  this;

		me.title = NP.Translator.translate(me.title);

		me.callParent(arguments);
	}
});
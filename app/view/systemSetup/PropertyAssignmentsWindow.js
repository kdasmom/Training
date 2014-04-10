/**
 * Created by Andrey Baranov
 * date: 2/13/14 3:55 PM
 */

Ext.define('NP.view.systemSetup.PropertyAssignmentsWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.systemsetup.propertyassignmentswindow',

	requires: [
		'NP.lib.core.Config'
	],

	layout          : {
		type: 'fit',
		align: 'center'
	},

	title           : 'Current Assignments',

	width           : '30%',
	height          : '30%',
	autoScroll		: true,

	modal           : true,
	draggable       : false,

	initComponent: function() {
		var that = this;

		that.title = NP.Translator.translate(that.title);

		this.items = [
			{
				xtype: 'displayfield',
				name: 'propertyassignments',
				value: ''
			}
		];

		this.callParent(arguments);
	}
});
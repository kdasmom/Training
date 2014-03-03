/**
 * Created by Andrey Baranov
 * date: 3/3/14 5:35 PM
 */


Ext.define('NP.view.integration.TasksToRunGrid', {
	extend: 'NP.lib.ui.Grid',
	alias: 'widget.integration.taskstorungrid',

	requires: [
		'NP.lib.core.Config'
	],

	paging  : true,

	initComponent: function() {
		var me = this;


		me.columns = [];

		me.store = [];

		me.callParent(arguments);
	}
});
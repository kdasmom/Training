/**
 * Created by Andrey Baranov
 * date: 2/6/14 12:04 PM
 */


Ext.define('NP.view.systemSetup.templates.AbstractTemplate', {
	extend: 'Ext.container.Container',

	/**
	 * @return {String} The name of the tile, which will be shown in the title of the panel
	 */
	getName: function() {
		throw 'You must implement the getName() function in your tile. It defines the name of your tile';
	},

	/**
	 * @return {Object|Ext.Component} A component to be diplayed in the My Settings > Dashboard section to preview the dashboard config; can be a fully initialized component or a definition object with an xtype.
	 */
	getPreview: function() {
		throw 'You must implement the getPreview() function in your tile. It defines what shows in a column when you drop the tile in it.';
	}
});
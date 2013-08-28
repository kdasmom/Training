/**
 * A portal configuration panel where you can use drag and drop to put tiles elements on a canvas
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.Dashboard', {
	extend: 'Ext.panel.Panel',
	alias : 'widget.mysettings.dashboard',
	
	requires: [
		'NP.view.shared.PortalCanvas',
		'NP.view.shared.PortalTilePicker',
		'NP.view.shared.button.Save'
	],

	layout: 'border',
	title : 'Dashboard',

	items: [
		{
			xtype : 'panel',
			border: false,
			bodyPadding: 8,
			region: 'north',
			html  : 'Please use the tool below to create your dashboard view.'
		},{
			xtype : 'shared.portalcanvas',
			region: 'center'
		},{
			xtype : 'shared.portaltilepicker',
			region: 'east',
			width : 250
		}
	],

	initComponent: function() {
		var bar = [{ xtype: 'shared.button.save' }];

		this.tbar = bar;
		this.bbar = bar;

		this.callParent(arguments);
	}
});
/**
 * A portal configuration panel where you can use drag and drop to put tiles elements on a canvas
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.GroupsFormDashboard', {
	extend: 'Ext.panel.Panel',
	alias : 'widget.user.groupsformdashboard',
	
	requires: [
		'NP.view.shared.PortalCanvas',
		'NP.view.shared.PortalTilePicker'
	],

	layout: 'border',
	title : 'Dashboard',

	initComponent: function() {
		this.items = [
			{
				xtype : 'panel',
				border: false,
				bodyPadding: 8,
				region: 'north',
				html  : 'Please use the tool below to create a default dashboard view for this user group.'
			},{
				xtype : 'shared.portalcanvas',
				region: 'center'
			},{
				xtype : 'shared.portaltilepicker',
				region: 'east',
				width : 250
			}
		];

		this.callParent(arguments);
	}
});
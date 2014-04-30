/**
 * Generic component to assign units
 *
 * @author Renat Gatyatov
 */
Ext.define('NP.view.systemSetup.UnitAssigner', {
	extend: 'NP.lib.ui.Assigner',
	alias: 'widget.systemSetup.unitassigner',

	fieldLabel: 'Units',

	name         : 'units',
	displayField : 'unit_display',
	valueField   : 'unit_id',

	tpl          : '<tpl for="."><div class="x-boundlist-item">{property_name} - {unit_display}</div></tpl>',
	fromTitle    : 'Unassigned',
	toTitle      : 'Assigned',
	buttons      : ['add','remove'],
	msgTarget    : 'under',
	autoLoad     : true,


	initComponent: function() {
		if (!this.store) {
			this.store = Ext.create('NP.lib.data.Store', {
				service	 : 'WFRuleService',
				action	 : 'getUnits',
				autoLoad : this.autoLoad,
				fields	 : ['property_name', 'unit_id', 'unit_display']
			});
		}

		this.callParent(arguments);
	}
});
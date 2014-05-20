Ext.define('NP.view.systemSetup.gridcol.Property', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.systemsetup.gridcol.property',
	
	requires: ['NP.lib.core.Config'],

	dataIndex: 'count_properties',

    initComponent: function() {
    	this.text = NP.Config.getPropertyLabel();

    	this.callParent(arguments);
    },

	renderer : function(val, meta, rec) {
		var rulePropertyType = NP.Translator.translate('REGION');

		if (rec.data.region_id == null) {
			rulePropertyType = rec.data.all_properties_selected ?
				NP.Translator.translate('ALL') :
				NP.Translator.translate('SPECIFIC');
		}

		return rulePropertyType;
	}
});
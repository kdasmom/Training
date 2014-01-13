/**
 * Grid column for Delegation Start Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.gridcol.DelegationEndDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.user.gridcol.delegationenddate',

	requires: ['NP.lib.core.Translator'],

	text     : 'End Date',
	dataIndex: 'Delegation_StopDate',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
		this.renderer = function(val, meta, record) {
			if (val == undefined) {
				return record.raw['Delegation_StopDate'];
			}
			return val;
		};
    	
    	this.callParent(arguments);
    }
});
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
    	
    	this.callParent(arguments);
    }
});
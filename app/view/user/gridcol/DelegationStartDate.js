/**
 * Grid column for Delegation Start Date
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.gridcol.DelegationStartDate', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.user.gridcol.delegationstartdate',

	requires: ['NP.lib.core.Translator'],

	text     : 'Start Date',
	dataIndex: 'Delegation_StartDate',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});
/**
 * Grid column for Delegation Status
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.gridcol.DelegationStatus', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.user.gridcol.delegationstatus',

	requires: ['NP.lib.core.Translator'],

	text     : 'Status',
	dataIndex: 'delegation_status_name',

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});
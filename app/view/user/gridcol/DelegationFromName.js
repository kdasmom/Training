/**
 * Grid column for Delegation From Name
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.gridcol.DelegationFromName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.user.gridcol.delegationfromname',

	requires: ['NP.lib.core.Translator'],

	text     : 'Name',
	dataIndex: 'userprofile_username',
	renderer : function(val, meta, rec) {
		return rec.get('person_lastname') + ', ' + rec.get('person_firstname') + ' (' + val + ')';
	},

    initComponent: function() {
    	this.text = NP.Translator.translate(this.text);
    	
    	this.callParent(arguments);
    }
});
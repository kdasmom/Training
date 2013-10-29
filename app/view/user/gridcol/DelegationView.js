/**
 * Grid column for Delegation Cancel button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.gridcol.DelegationView', {
	extend: 'NP.view.shared.gridcol.ButtonImg',
	alias: 'widget.user.gridcol.delegationview',

	requires: ['NP.lib.core.Translator'],

	text     : 'View',
	dataIndex: 'delegation_status_name',
	sortable : false,
	hideable : false,

	initComponent: function() {
		var that = this;
		
		this.text = NP.Translator.translate(this.text);
				
		this.renderer = function(val) {
			if (val == 'Future' || val == 'Active') {
		        return '<img src="resources/images/buttons/view.gif" title="'+that.text+'" alt="'+that.text+'" class="view" />';
		    } else {
		    	return '';
		    }
	    };

	    this.callParent(arguments);
	}
});
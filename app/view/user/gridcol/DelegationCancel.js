/**
 * Grid column for Delegation Cancel button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.gridcol.DelegationCancel', {
	extend: 'NP.view.shared.gridcol.ButtonImg',
	alias: 'widget.user.gridcol.delegationcancel',

	text     : 'Cancel',
	dataIndex: 'delegation_status_name',
	sortable : false,
	hideable : false,

	initComponent: function() {
		var that = this;
		
		this.renderer = function(val) {
			if (val == 'Future' || val == 'Active') {
				return '<img src="resources/images/buttons/delete.gif" title="'+that.text+'" alt="'+that.text+'" class="cancel" />';
		    } else {
		    	return '';
		    }
	    };

	    this.callParent(arguments);
	}
});
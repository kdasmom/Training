/**
 * User Delegation grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.UserDelegationGrid', {
    extend: 'NP.lib.ui.Grid',
    alias : 'widget.mysettings.userdelegationgrid',
    
    requires: [
        'NP.view.user.gridcol.DelegationToName',
        'NP.view.user.gridcol.DelegationFromName',
        'NP.view.user.gridcol.DelegationStartDate',
        'NP.view.user.gridcol.DelegationEndDate',
        'NP.view.user.gridcol.DelegationCreatedBy',
        'NP.view.user.gridcol.DelegationStatus',
        'NP.view.user.gridcol.DelegationCancel',
        'NP.view.user.gridcol.DelegationView'
    ],

	paging    : true,
	border    : false,
	viewConfig: { markDirty: false },

    emptyText: 'No delegations found.',

    initComponent: function() {
    	if (this.toOrFrom != 'to' && this.toOrFrom != 'from') {
    		throw 'Invalid "toOrFrom" attribute. Valid values for "toOrFrom" attribute are "to" and "from"';
    	}

    	var firstCol = (this.toOrFrom == 'to') ? 'from' : 'to';

        // Add the base columns for the grid
        this.columns = [
        	{ xtype: 'user.gridcol.delegation' + firstCol + 'name', flex: 2 },
        	{ xtype: 'user.gridcol.delegationstartdate', flex: 1 },
            { xtype: 'user.gridcol.delegationenddate', flex: 1 },
            { xtype: 'user.gridcol.delegationcreatedby', flex: 2 },
            { xtype: 'user.gridcol.delegationstatus', flex: 1 },
            { xtype: 'user.gridcol.delegationcancel', flex: (this.toOrFrom == 'to') ? 0.5 : 1 }
        ];

        // Create the store, only thing that changes between stores is the vc_status
        this.store = Ext.create('NP.store.user.Delegations', {
            service    : 'UserService',
            action     : 'getDelegations',
            paging     : true,
            extraParams: {
            	toOrFrom: this.toOrFrom
            }
        });

        // Dynamic state ID so each iteration has its own
        this.stateId = 'user_delegation_grid_' + this.toOrFrom;
        this.stateful = true;

        // Custom columns for Activated grid
        if (this.toOrFrom == 'from') {
            this.columns.push({ xtype: 'user.gridcol.delegationview', flex: 0.5 });
        }

        this.callParent(arguments);
    }

});
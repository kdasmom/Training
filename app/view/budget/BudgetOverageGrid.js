/**
 * A component to easily create a Budget Overage Grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.budget.BudgetOverageGrid', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.budget.budgetoveragegrid',

    requires: [
//        'NP.lib.core.Config',
        'NP.view.shared.button.New'
//        'NP.view.shared.button.Delete',
//        'NP.lib.ui.Grid'
    ],

    // For localization
    propertyColText: 'Property',
    categoryColText: 'Category',
    periodColText  : 'Period',
    amountColText: 'Amount',
    createNewBudgetOverageBtnLabel: 'New Budget Overage',

    paging  : true,
    stateful: true,
    stateId : 'budgetoverage_grid',

    title: 'Budget Overage',

    initComponent: function() {
        this.pagingToolbarButtons = [{ xtype: 'shared.button.new', text: this.createNewBudgetOverageBtnLabel }];

        // Add the base columns for the grid
        this.columns = [
            { text: this.propertyColText, dataIndex: 'property_name' },
            { text: this.categoryColText, dataIndex: 'category_name' },
            { xtype: 'datecolumn', text: this.periodColText, dataIndex: 'budgetoverage_period', format: 'd/m/Y', align: 'right' },
            { xtype: 'numbercolumn', text: this.amountColText, dataIndex: 'budgetoverage_amount', format: '$0,000', align: 'right' },
            { xtype: 'actioncolumn',
                items: [
                    {
                        icon: '/NexusPayablesPHP/resources/images/buttons/delete.gif',
                        tooltip: 'Delete'
                    }
                ],
                align: 'center'
            }
        ];

        // Create the store, only thing that changes between stores is the vc_status
        this.store = Ext.create('NP.store.budget.BudgetOverage', {
            service    : 'MessageService',
            action     : 'getAllMessages',
            paging     : true
        });
        /*this.store = Ext.create('NP.store.system.UserMessages', {
            service    : 'MessageService',
            action     : 'getAllMessages',
            paging     : true
        });*/

        this.callParent(arguments);
    }
    /*extend: 'NP.lib.ui.Grid',
 	alias : 'widget.budget.budgetoveragegrid',

    requires: ['NP.lib.core.Config'],
    
    // For localization
	propertyColText: 'Property',
	categoryColText: 'Category',
	periodColText  : 'Period',
	amountColText: 'Amount',

    initComponent: function() {
    	this.columns = {
    		defaults: { flex: 1 },
    		items: [
    			{ text: this.propertyColText, dataIndex: 'property_name' },
    			{ text: this.categoryColText, dataIndex: 'category_name' },
	    		{ xtype: 'datecolumn', text: this.periodColText, dataIndex: 'budgetoverage_period', format: 'd/m/Y', align: 'right' },
	    		{ xtype: 'numbercolumn', text: this.amountColText, dataIndex: 'budgetoverage_amount', format: '$0,000', align: 'right' },
	    		{ xtype: 'actioncolumn',
                    items: [
                        {
                            icon: '../resources/images/buttons/delete.gif',
                            tooltip: 'Delete'
                        }
                    ]
                }
    		]
    	};
    	
    	this.callParent(arguments);
    }*/
});
/**
 * A component to easily create a Budget Overage Grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.budget.BudgetOverageGrid', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.budget.budgetoveragegrid',

    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.New',
        'NP.lib.ui.ComboBox'
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

//    for localization
    title: 'Budget Overage',
    propertyFilterLabel: 'Property',

    initComponent: function() {

        var propertyStore = Ext.create('NP.store.property.Properties', {
            service: 'PropertyService',
            action : 'getByStatus',
            paging: true,
            extraParams: {property_status: 1, pageSize: null}
        });

        propertyStore.load();

        this.pagingToolbarButtons = [
            {
                xtype: 'shared.button.new',
                text: this.createNewBudgetOverageBtnLabel
            },
            {
                xtype: 'tbseparator'
            },
            {
                xtype           : 'customcombo',
                name            : 'property_id',
                fieldLabel      : this.propertyFilterLabel,
                displayField    : 'property_name',
                valueField      : 'property_id',
                store           : propertyStore,
                width           : 500,
                emptyText       : 'All ' + NP.Config.getPropertyLabel(true)

            }
        ];

        // Add the base columns for the grid
        this.columns = [
            {
                text: this.propertyColText,
                dataIndex: 'property_name',
                flex: 1,
                renderer: function(val, meta, rec) {
                    return rec.getProperty().get('property_name');
                }
            },
            {
                text: this.categoryColText,
                dataIndex: 'glaccount_name',
                flex: 1,
                renderer: function(val, meta, rec) {
                    return rec.getGlAccount().get('glaccount_name');
                }
            },
            { xtype: 'datecolumn', text: this.periodColText, dataIndex: 'budgetoverage_period', format: 'm/Y', align: 'right' },
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

        this.store = Ext.create('NP.store.budget.BudgetOverage', {
            service    : 'BudgetOverageService',
            action     : 'budgetOverageList',
            paging     : true,
            extraParams: {property_id: null, pageSize: null}
        });

        this.callParent(arguments);
    }
});
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
        'NP.lib.ui.ComboBox',
        'NP.model.gl.GlAccount',
        'NP.view.property.gridcol.PropertyName'
    ],

    // For localization
    propertyColText: 'Property',
    categoryColText: 'GL Code',
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
        this.pagingToolbarButtons = [
            {
                xtype: 'shared.button.new',
                text: this.createNewBudgetOverageBtnLabel
            },{
                xtype: 'tbseparator'
            },{
                xtype       : 'customcombo',
                name        : 'property_id',
                fieldLabel  : this.propertyFilterLabel,
                displayField: 'property_name',
                valueField  : 'property_id',
                store       : 'property.AllProperties',
                width       : 500,
                labelWidth  : 65,
                emptyText   : 'All ' + NP.Config.getPropertyLabel(true)
            }
        ];

        // Add the base columns for the grid
        this.columns = [
            {
                xtype    : 'property.gridcol.propertyname',
                flex     : 1
            },{
                text     : this.categoryColText,
                dataIndex: 'glaccount_name',
                flex     : 1,
                renderer : function(val, meta, rec) {
                    return NP.model.gl.GlAccount.formatName(rec.get('glaccount_number'), rec.get('glaccount_name'));
                }
            },{
                xtype: 'datecolumn',
                text: this.periodColText,
                dataIndex: 'budgetoverage_period',
                format: 'm/Y',
                align: 'right'
            },{
                xtype    : 'numbercolumn',
                text     : this.amountColText,
                dataIndex: 'budgetoverage_amount',
                renderer : NP.Util.currencyRenderer,
                align    : 'right'
            },{
                xtype: 'actioncolumn',
                items: [
                    {
                        icon   : 'resources/images/buttons/delete.gif',
                        tooltip: 'Delete',
                        handler: function(gridView, rowIndex, colIndex) {
                            var grid = gridView.ownerCt;
                            grid.fireEvent('deleterow', grid, grid.getStore().getAt(rowIndex), rowIndex);
                        }
                    }
                ],
                align: 'center',
                flex : 0.1
            }
        ];

        this.store = Ext.create('NP.store.budget.BudgetOverages', {
            service    : 'BudgetService',
            action     : 'getBudgetOveragesByProperty',
            paging     : true,
            extraParams: { property_id: null }
        });

        this.callParent(arguments);

        this.addEvents('deleterow');
    }
});
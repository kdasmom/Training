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
        'NP.lib.core.Translator',
        'NP.view.shared.button.New',
        'NP.lib.ui.ComboBox',
        'NP.model.gl.GlAccount',
        'NP.view.property.gridcol.PropertyName'
    ],

    paging  : true,
    stateful: true,
    stateId : 'budgetoverage_grid',

    initComponent: function() {
        this.title = NP.Translator.translate('Budget Overage');

        this.pagingToolbarButtons = [
            {
                xtype: 'shared.button.new',
                text: NP.Translator.translate('New Budget Overage')
            },{
                xtype: 'tbseparator'
            },{
                xtype       : 'customcombo',
                name        : 'property_id',
                fieldLabel  : NP.Config.getPropertyLabel(),
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
				flex     : 0.4
            },{
                text     : NP.Translator.translate('Category'),
                dataIndex: 'category_name',
                flex     : 0.4
            },{
                text     : NP.Translator.translate('GL Code'),
                dataIndex: 'glaccount_name',
                flex     : 0.5,
                renderer : function(val, meta, rec) {
                    return NP.model.gl.GlAccount.formatName(rec.get('glaccount_number'), rec.get('glaccount_name'));
                }
            },{
                xtype    : 'datecolumn',
                text     : NP.Translator.translate('Period'),
                dataIndex: 'budgetoverage_period',
                format   : 'm/Y',
                align    : 'right',
                width    : 75
            },{
                xtype    : 'numbercolumn',
                text     : NP.Translator.translate('Original Budget Amount'),
                dataIndex: 'budget_amount',
                renderer : NP.Util.currencyRenderer,
                align    : 'right',
                width    : 125
            },{
                xtype    : 'numbercolumn',
                text     : NP.Translator.translate('Overage Amount'),
                dataIndex: 'budgetoverage_amount',
                renderer : NP.Util.currencyRenderer,
                align    : 'right',
                width    : 125
            },{
                xtype    : 'numbercolumn',
                text     : NP.Translator.translate('New Budget Amount'),
                dataIndex: 'new_budget_amount',
                sortable : false,
                align    : 'right',
                width    : 125,
                renderer : function(val, meta, rec) {
                    val = rec.get('budget_amount');

                    if (val === null) {
                        val = 0;
                    }
                    val += rec.get('budgetoverage_amount');

                    return NP.Util.currencyRenderer(val);
                }
            },{
                dataIndex: 'budgetoverage_note',
                text     : NP.Translator.translate('Reason'),
                flex     : 0.7
			},{
                dataIndex: 'budgetoverage_created',
                text     : NP.Translator.translate('Added By'),
                flex     : 0.6,
                renderer : function (val, meta, record) {
                    var person = '';
                    if (record.get('person_id') !== null) {
                        person = ' (' + record.get('person_lastname') + ', ' + record.get('person_firstname') + ')';
                    }
					return Ext.Date.format(record.get('budgetoverage_created'), NP.Config.getDefaultDateTimeFormat()) + person;
				}
			},
			{
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
                width: 25
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
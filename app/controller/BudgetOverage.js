/**
 * Controller provide operations with budgetOverage entities
 *
 * Created by rnixx on 9/18/13.
 */

Ext.define('NP.controller.BudgetOverage', {
    extend: 'NP.lib.core.AbstractController',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.lib.core.Net',
        'NP.lib.core.Util',
    ],

//  for localization
    saveSuccessText      : 'Your changes were saved.',

    /**
     * Init
     */
    init: function(){
        Ext.log('BudgetOverageController init');

        var app = this.application;

        // Setup event handlers
        this.control({
            // The New Budget Overage button
            '[xtype="budget.budgetoveragegrid"] [xtype="shared.button.new"]': {
                click: function() {
                    app.addHistory('BudgetOverage:showBudgetOverageForm');
                }
            },
            // The Cancel button on the New Budget Overage Form
            '[xtype="budget.budgetoverageform"] [xtype="shared.button.cancel"]': {
                click: function() {
                    app.addHistory('BudgetOverage:showBudgetOverage');
                }
            },
            // The Save button on the New Budget Overage Form
            '[xtype="budget.budgetoverageform"] [xtype="shared.button.save"]': {
                click: this.saveBudgetOverage
            }
        });
    },

    /**
     * show budget overage grid
     */
    showBudgetOverage: function() {
        // Create the view
        var grid = this.setView('NP.view.budget.BudgetOverageGrid');

        // Load the store
        grid.reloadFirstPage();
    },

    /**
     * Show budget overage form
     * @param id
     */
    showBudgetOverageForm: function(id) {

        var viewCfg = { bind: { models: ['budget.BudgetOverage'] }};
        if (arguments.length) {
            Ext.apply(viewCfg.bind, {
                service    : 'BudgetOverageService',
                action     : 'getBudgetOverage',
                extraParams: {
                    id: id
                }
            });
        }

        var form = this.setView('NP.view.budget.BudgetOverageForm', viewCfg);
        if (arguments.length) {

        } else {
           Ext.getCmp('budgetoverage_period').bindStore(this.setPeriodRange());
        }

        this.setPeriodRange();
    },

    /**
     * Receive period range for the form value "Period"
     *
     * @param startdate
     */
    setPeriodRange: function(budget_overage_startdate) {
        var startdate = new Date();
        if (budget_overage_startdate) {
            startdate = new Date(budget_overage_startdate);
        }

        Ext.define('DateRange', {
            extend: 'Ext.data.Model',
            fields: [
                {type: 'string', name: 'budgetoverage_period'},
                {type: 'string', name: 'period'}
            ]
        });
        var daterange = [
            {'budgetoverage_period': Ext.Date.format(startdate, 'Y-m-1'), 'period': Ext.Date.format(startdate, 'm/Y')}
        ];

        for (var index = 1; index < 7; index++) {
            var nextdate = Ext.Date.add(startdate, Ext.Date.MONTH, index);
            daterange.push({"budgetoverage_period": "" + Ext.Date.format(nextdate, 'Y-m-1') + "", "period": Ext.Date.format(nextdate, 'm/Y')});
        }

        var store = new Ext.data.Store(
            {
                model: 'DateRange',
                data: daterange
            }
        );
        return store;
    },

    /**
     * save budget overage
     */
    saveBudgetOverage: function() {
        var that = this;

        var form = this.getCmp('budget.budgetoverageform');

        if (form.isValid()) {
            form.submitWithBindings({
                service: 'BudgetOverageService',
                action: 'saveBudgetOverage',
                extraParams: {
                    userprofile_id: NP.Security.getUser().get('userprofile_id'),
                    role_id:        NP.Security.getRole().get('role_id')
                },
                success: function(result, deferred) {
                    NP.Util.showFadingWindow({ html: that.saveSuccessText });
                    that.application.addHistory('BudgetOverage:showBudgetOverage');
                }
            });
        }
    }
});

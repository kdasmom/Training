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
        'Ext.ux.form.field.BoxSelect',
        'NP.view.shared.PortalCanvas'
    ],

    init: function(){
        Ext.log('BudgetOverageController init');

        var app = this.application;

        // Setup event handlers
        this.control({
            // The New Message button
            '[xtype="budget.budgetoveragegrid"] [xtype="shared.button.new"]': {
                click: function() {
                    app.addHistory('BudgetOverage:showBudgetOverageForm');
                }
            }
        });
    },

    showBudgetOverage: function() {
        // Create the view
        var grid = this.setView('NP.view.budget.BudgetOverageGrid');

        // Load the store
        grid.reloadFirstPage();
    },

    showBudgetOverageForm: function(id) {
        var viewCfg = { bind: { models: ['budget.BudgetOverage'] }};

        var form = this.setView('NP.view.budget.BudgetOverageForm', viewCfg);
    }
});

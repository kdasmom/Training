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
        'NP.lib.core.Util'
    ],

    models: ['budget.BudgetOverage'],

    views: [
        'budget.BudgetOverageGrid',
        'budget.BudgetOverageForm'
    ],

    refs: [
        { ref: 'overageGrid', selector: '[xtype="budget.budgetoveragegrid"]' }
    ],

    //  for localization
    saveSuccessText      : 'Your changes were saved.',
    saveDuplicateText    : 'There is already a Budget Overage amount set up for that property, GL code, and period.',
    deleteDialogTitleText: 'Delete budget overage?',
    deleteDialogText     : 'Are you sure you want to delete this budget overage?',
    deleteSuccessText    : 'Budget overage successfully deleted',
    deleteFailureText    : 'There was an error deleting the budget overage. Please try again.',
    errorDialogTitleText : 'Error',

    /**
     * Init
     */
    init: function(){
        Ext.log('BudgetOverageController init');

        // Setup event handlers
        this.control({
            // The New Budget Overage button
            '[xtype="budget.budgetoveragegrid"] [xtype="shared.button.new"]': {
                click: function() {
                    this.addHistory('BudgetOverage:showBudgetOverageForm');
                }
            },
            // The Cancel button on the New Budget Overage Form
            '[xtype="budget.budgetoverageform"] [xtype="shared.button.cancel"]': {
                click: function() {
                    this.addHistory('BudgetOverage:showBudgetOverage');
                }
            },
            // The Save button on the New Budget Overage Form
            '[xtype="budget.budgetoverageform"] [xtype="shared.button.save"]': {
                click: this.saveBudgetOverage
            },
            // The Property grid drop down
            '[xtype="budget.budgetoveragegrid"] [name="property_id"]': {
                select: this.filterByPropertyName
            },
            // override delete row event
            '[xtype="budget.budgetoveragegrid"]': {
                deleterow: this.deleteBudgetOverageItem,
                itemclick: function (grid, rec, item, index, e, eOpts) {
                    if (e.target.tagName != 'IMG') {
                        this.addHistory('BudgetOverage:showBudgetOverageForm:' + rec.get('budgetoverage_id'));
                    }
                }
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
                service    : 'BudgetService',
                action     : 'getBudgetOverage',
                extraParams: {
                    id: id
                }
            });

            viewCfg.listeners = {
                dataloaded: function(boundForm, data) {
                    var periodField  = boundForm.findField('budgetoverage_period'),
                        periodStore  = periodField.getStore(),
                        periodRecVal = boundForm.getModel('budget.BudgetOverage').get('budgetoverage_period'),
                        periodName   = Ext.Date.format(periodRecVal, 'm/Y'),
                        periodVal    = Ext.Date.format(periodRecVal, 'm/d/Y');
                    
                    if (periodStore.find('period_name', periodName) === -1) {
                        periodStore.add({
                            period_name : periodName,
                            period_value: periodVal
                        });
                    }

                    periodField.setValue(periodVal);
                }
            };
        }

        var form = this.setView('NP.view.budget.BudgetOverageForm', viewCfg);
    },

    /**
     * save budget overage
     */
    saveBudgetOverage: function() {
        var that = this;

        var form = this.getCmp('budget.budgetoverageform');

        if (form.isValid()) {
            form.submitWithBindings({
                service: 'BudgetService',
                action: 'saveBudgetOverage',
                extraFields: {
                    budgetoverage_period: 'budgetoverage_period'
                },
                extraParams: {
                    userprofile_id: NP.Security.getUser().get('userprofile_id'),
                    role_id:        NP.Security.getRole().get('role_id')
                },
                success: function(result) 
                {
                        NP.Util.showFadingWindow({ html: that.saveSuccessText });
                        that.application.addHistory('BudgetOverage:showBudgetOverage');
                },
                failure: function(result) {
                   if (result.errors == 'repeatRec') 
                    {
                        Ext.MessageBox.alert('Error',  that.saveDuplicateText);
                    }
                }
            });
        }
    },

    /**
     *  Reload grid after filter property combobox's value changed
     */
    filterByPropertyName: function(combo, recs) {
        var property_id = (recs.length) ? recs[0].get('property_id') : null;

        this.getOverageGrid().addExtraParams({ property_id: property_id });
        this.getOverageGrid().reloadFirstPage();
    },

    /**
     * Delete selected row and refresh grid on success
     *
     * @param grid
     * @param rec
     * @param rowIndex
     */
    deleteBudgetOverageItem: function(grid, rec, rowIndex) {
        var that = this;
        Ext.Msg.confirm(this.deleteDialogTitleText, this.deleteDialogText, function(buttonText) {
            if (buttonText == "yes") {

                var id = rec.internalId;

                NP.lib.core.Net.remoteCall({
                    requests: {
                        service: 'BudgetService',
                        action : 'budgetOverageDelete',
                        id     : id,
                        success: function(success) {
                            if (success) {
                                NP.Util.showFadingWindow({ html: that.deleteSuccessText });
                                grid.getStore().remove(rec);
                                grid.getView().refresh();
                            } else {
                                Ext.MessageBox.alert(that.errorDialogTitleText, that.deleteFailureText);
                            }
                        }
                    }
                });
            }
        });
    }
});

/**
 * GL Budget import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.importing.types.GLBudget', {
    extend  : 'NP.view.importing.types.AbstractImportType',
    
    fieldName  : 'file_upload_gl_budget',

    // For localization
    tabTitle            : 'Budgets',
    entityName          : 'GLBudget',
    sectionName         : 'GL Account Setup',
    businessUnitColText : 'Business Unit',
    glAccountColText    : 'GL Account',
    periodMonthCoText   : 'Period Month',
    periodYearCoText    : 'Period Year',
    amountCoText        : 'Amount',
    intPkgColText       : 'Integration Package',

    getGrid: function() {
        return {
            columns: {
                items   : [
                    {
                        text     : this.businessUnitColText,
                        dataIndex: 'property_id_alt'
                    },{
                        text     : this.glAccountColText,
                        dataIndex: 'glaccount_number'
                    },{
                        text     : this.periodMonthCoText,
                        dataIndex: 'period_month'
                    },{
                        text     : this.periodYearCoText,
                        dataIndex: 'glaccountyear_year'
                    },{
                        text     : this.amountCoText,
                        dataIndex: 'amount'
                    },{
                        text     : this.intPkgColText, 
                        dataIndex: 'integration_package_name'
                    }
                ]
            }
        };
    }

});
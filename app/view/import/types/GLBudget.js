/**
 * GL Budget import type definition
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.import.types.GLBudget', {
    extend  : 'NP.view.import.types.AbstractImportType',
    
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
            columns: [
                {
                    text     : this.businessUnitColText,
                    dataIndex: 'BusinessUnit',
                    flex     : 1,
                    renderer : function(val, meta, rec) {
                        var value = val.split(';');
                        if (value[1]) {
                            meta.tdAttr = 'data-qtip="' + value[1] + '"';
                            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                        } else {
                            return val;
                        }
                    }},
                {
                    text     : this.glAccountColText,
                    dataIndex: 'GLAccount',
                    flex     : 1,
                    renderer : function(val, meta, rec) {
                        var value = val.split(';');
                        if (value[1]) {
                            meta.tdAttr = 'data-qtip="' + value[1] + '"';
                            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                        } else {
                            return val;
                        }
                    }},
                {
                    text     : this.periodMonthCoText,
                    dataIndex: 'PeriodMonth',
                    flex     : 1,
                    renderer : function(val, meta, rec) {
                        var value = val.split(';');
                        if (value[1]) {
                            meta.tdAttr = 'data-qtip="' + value[1] + '"';
                            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                        } else {
                            return val;
                        }
                    }},
                {
                    text     : this.periodYearCoText,
                    dataIndex: 'PeriodYear',
                    flex     : 1,
                    renderer : function(val, meta, rec) {
                        var value = val.split(';');
                        if (value[1]) {
                            meta.tdAttr = 'data-qtip="' + value[1] + '"';
                            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                        } else {
                            return val;
                        }
                    }},
                  {
                    text     : this.amountCoText,
                    dataIndex: 'Amount',
                    flex     : 1,
                    renderer : function(val, meta, rec) {
                        var value = val.split(';');
                        if (value[1]) {
                            meta.tdAttr = 'data-qtip="' + value[1] + '"';
                            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                        } else {
                            return val;
                        }
                    }},
                {
                    text     : this.intPkgColText, 
                    dataIndex: 'IntegrationPackage',
                    flex     : 1,
                    renderer : function(val, meta, rec) {
                        var value = val.split(';');
                        if (value[1]) {
                            meta.tdAttr = 'data-qtip="' + value[1] + '"';
                            return "<span style='color:red;font-weight:bold' >" + value[0] + "</span>";
                        } else {
                            return val;
                        }
                    }
                }
            ]
        };
    }

});
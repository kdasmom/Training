/**
 * The line items view for the invoice or PO page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.ViewLines', {
    extend: 'Ext.view.View',
    alias: 'widget.shared.invoicepo.viewlines',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
    	'NP.lib.core.Util'
    ],

    type: null,

    // For localization

    initComponent: function() {
    	var me = this;
        
        me.fieldPrefix  = me.type + 'item';
        me.itemSelector = 'tbody tr';
        me.emptyText    = 'No lines found';

        me.tpl = new Ext.XTemplate(me.buildTpl(), {
            getSetting: function(name, defaultVal) {
                defaultVal = defaultVal || '';
                return NP.Config.getSetting(name, defaultVal);
            },
            getStoreCount: function() {
                return me.getStore().getCount();
            },
            showBudgetComparison: function(invoiceitem_jobflag) {
                return NP.Config.getSetting("PN.InvoiceOptions.showBudgetComparison") == '1' && (
                        NP.Config.getSetting("PN.InvoiceOptions.showBudgetComparisonJC") == '1'
                        || invoiceitem_jobflag != 1
                );
            },
            getInvoiceRecord: function() {
                return me.up('[xtype="'+me.type+'.view"]').getInvoiceRecord();
            },
            getSum: function(field) {
                var total = 0;
                for (var i=0; i<me.getStore().getCount(); i++) {
                    total += me.getStore().getAt(i).get(field);
                }

                return total.toFixed(2);
            },
            arrayContains: function() {
                var item = arguments[0],
                    collection = [];

                for (var i=1; i<arguments.length; i++) {
                    collection.push(arguments[i]);
                }                

                return Ext.Array.contains(collection, item);
            },
            renderCurrency: function(val) {
                return NP.Util.currencyRenderer(val);
            },
            isLineEditable: function() {
                return this.getInvoiceRecord().isLineEditable();
            },
            isEditable: function() {
                return this.getInvoiceRecord().isEditable();
            }
        });

    	this.callParent(arguments);
    },

    buildTpl: function() {
        var me = this;

        return '<table width="100%" id="lineItemTable">' +
            '<thead>' +
            '<tr>' +
                '<th width="1%">QTY</th>' +
                '<th width="55%">Description</th>' +
                '<th width="36%">GL Account</th>' +
                '<th width="1%">MTD Budget</th>' +
                '<th width="1%">MTD Remaining</th>' +
                '<th width="1%">Item Price</th>' +
                '<th width="5%">Amount</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tpl for=".">' +
                '<tr>' +
                    me.buildQuantityCol() +
                    me.buildDescriptionCol() +
                    me.buildGlCol() +
                    me.buildBudgetCol() +
                    me.buildBudgetRemainingCol() +
                    me.buildItemPriceCol() +
                    me.buildAmountCol() +
                '</tr>' +
            '</tpl>' +
            '</tbody>' +
            '<tfoot>' +
            me.buildFooter() +
            '</tfoot>' +
            '</table>';
    },

    buildQuantityCol: function() {
        var me = this,
            html;

        html = 
            '<td>' +
                '<div>{[values.'+me.fieldPrefix+'_quantity_long*1]}</div>';

        if (me.type == 'invoice') {
            html +=
                '<tpl if="utilitycolumn_usagetype_id !== null">' +
                    '<div>{usageType.UtilityColumn_UsageType_Name}</div>' +
                '</tpl>';
        }

        html += '</td>';
        
        return html;
    },

    buildDescriptionCol: function() {
        var me   = this,
            html = '<td>';

        if (me.type == 'invoice') {
            html +=
                '<tpl if="utilityaccount_id !== null">' +
                    '<div><b>Account Number:</b> {utilityAccount.UtilityAccount_AccountNumber}</div>' +
                    '<tpl if="utilityAccount.UtilityAccount_MeterSize !== null">' +
                        '<div><b>Meter Number:</b> {utilityAccount.UtilityAccount_MeterSize}</div>' +
                    '</tpl>' +
                '</tpl>';
        }

        html +=
            '<div>' +
                '{'+me.fieldPrefix+'_description}' +
                '<tpl if="'+me.fieldPrefix+'_description_alt !== \'\'">' +
                    ' - {'+me.fieldPrefix+'_description_alt}' +
                '</tpl>' +
            '</div>' +
            '<tpl if="vcitem_number !== null && vcitem_number !== \'\'">' +
                '<div><b>Item Number:</b> {vcitem_number}</div>' +
            '</tpl>' +
            '<tpl if="vcitem_uom !== null && vcitem_uom !== \'\'">' +
                '<div>' +
                    '<b>UOM:</b>' +
                    '<tpl if="unittype_material_id !== null">' +
                        ' {material.unittype_material_name}' +
                    '</tpl>' +
                    ' {vcitem_uom}' +
                '</div>' +
            '</tpl>' + 
            me.buildCustomFields() +
            '<tpl if="unit_id !== null">' +
                '<div>' +
                    '<b>{[this.getSetting("PN.InvoiceOptions.UnitAttachDisplay")]}:</b>' +
                    ' {unit.unit_number}' +
                '</div>' +
            '</tpl>' +
            '<tpl if="dfsplit_id !== null">' +
                '<div>' +
                    '<b>Default Split:</b> {split.dfsplit_name}' +
                '</div>' +
            '</tpl>' +
            me.buildJobCosting() +
        '</td>';

        return html;
    },

    buildCustomFields: function() {
        var me              = this,
            customFieldType = (me.type == 'invoice') ? 'inv' : 'po',
            customFields    = NP.Config.getCustomFields().line.fields,
            html            = '';

        for (var i=1; i<=8; i++) {
            if (customFields[i][customFieldType+'On']) {
                html +=
                    '<tpl if="universal_field'+i+' !== null && universal_field'+i+' !== \'\'">' +
                        '<div>' +
                            '<b>'+customFields[i].label+':</b>' +
                            ' {universal_field'+i+'}' +
                        '</div>' +
                    '</tpl>';
            }
        }

        return html;
    },

    buildJobCosting: function() {
        return '<tpl if="invoiceitem_jobflag == 1">' +
                '<tpl if="this.getSetting(\'pn.jobcosting.useContracts\', \'0\') == \'1\' && job.jbcontract_id !== null">' +
                    '<div>' +
                        '<b>{[this.getSetting("PN.jobcosting.contractTerm")]}:</b>' +
                        ' {job.contract.display_name}' +
                    '</div>' +
                '</tpl>' +
                '<tpl if="job.jbchangeorder_id !== null">' +
                    '<div>' +
                        '<b>{[this.getSetting("PN.jobcosting.changeOrderTerm")]}:</b>' +
                        ' {job.changeOrder.display_name}' +
                    '</div>' +
                '</tpl>' +
                '<tpl if="job.jbjobcode_id !== null">' +
                    '<div>' +
                        '<b>{[this.getSetting("PN.jobcosting.jobCodeTerm")]}:</b>' +
                        ' {job.jobCode.display_name}' +
                    '</div>' +
                '</tpl>' +
                '<tpl if="job.jbphasecode_id !== null">' +
                    '<div>' +
                        '<b>{[this.getSetting("PN.jobcosting.phaseCodeTerm")]}:</b>' +
                        ' {job.phaseCode.display_name}' +
                    '</div>' +
                '</tpl>' +
                '<tpl if="this.getSetting(\'pn.jobcosting.useCostCodes\', \'0\') == \'1\' && job.jbcostcode_id !== null">' +
                    '<div>' +
                        '<b>{[this.getSetting("PN.jobcosting.costCodeTerm")]}:</b>' +
                        ' {job.costCode.display_name}' +
                    '</div>' +
                '</tpl>' +
                '<tpl if="job.jbassociation_retamt !== 0">' +
                    '<div>' +
                        '<b>Retention:</b> {[NP.Util.currencyRenderer(values.job.jbassociation_retamt)]}' +
                    '</div>' +
                '</tpl>' +
            '</tpl>';
    },

    buildGlCol: function() {
        return '<td>' +
                '<div>' +
                    '{glaccount.glaccount_number}' +
                    '<tpl if="this.arrayContains(this.getInvoiceRecord().get(\'invoice_status\'), \'saved\',\'paid\',\'submitted\',\'sent\') == false">' +
                        '' + // TODO: add code for budget icon
                    '</tpl>' +
                    '<tpl if="this.getSetting(\'CP.INVOICE_ORDER_LINE_ITEM\', \'0\') == \'1\' && this.getStoreCount() &gt; 1">' +
                        '' + // TODO: add code to do re-ordering
                    '</tpl>' +
                '</div>' +
                '<div>{glaccount.glaccount_name}</div>' +
                '<tpl if="jbcontractbudget_id !== null">' +
                    '<tpl if="job.jbcontract_id !== null">' +
                        '<div>{job.contract.jbcontract_name}</div>' +
                    '<tpl else>' +
                        '<div>{job.jobCode.jbjobcode_name}</div>' +
                    '</tpl>' +
                    // TODO: add icon to show job costing budget here
                '</tpl>' +
            '</td>';
    },

    buildBudgetCol: function() {
        return '<td>' +
                '<tpl if="this.showBudgetComparison()">' +
                    '<tpl if="this.getSetting(\'PN.jobcosting.budgetlineitemcompare\') == \'1\' && job.jbjobcode_id !== null">' +
                        '{[this.renderCurrency(values.jbcontractbudget_amt)]}' +
                    '<tpl else>' +
                        '{[this.renderCurrency(values.budget_amount)]}' +
                    '</tpl>' +
                '</tpl>' +
            '</td>';
    },

    buildBudgetRemainingCol: function() {
        return '<td>' +
                '<tpl if="this.showBudgetComparison()">' +
                    '<tpl if="this.getSetting(\'PN.jobcosting.budgetlineitemcompare\') == \'1\' && job.jbjobcode_id !== null">' +
                        '{[this.renderCurrency(values.jbcontractbudget_amt - (values.jbcontractbudget_amt_actual + values.jbcontractbudget_amt_pnactual))]}' +
                    '<tpl else>' +
                        '{[this.renderCurrency(values.budget_variance)]}' +
                    '</tpl>' +
                '</tpl>' +
            '</td>';
    },

    buildItemPriceCol: function() {
        var me = this;
        return '<td>' +
                '{[this.renderCurrency(values.'+me.fieldPrefix+'_unitprice_long)]}' +
                '<tpl if="invoiceitem_taxflag == \'Y\'">' +
                    '<div class="taxableFlag">Taxable</div>' +
                '</tpl>' +
            '</td>';
    },

    buildAmountCol: function() {
        var me = this;
        return '<td>' +
                '{[this.renderCurrency(values.'+me.fieldPrefix+'_amount)]}' +
                '<tpl if="this.isLineEditable()">' +
                    '<div>' +
                        '<tpl if="invoiceitem_split != 1">' +
                            '<tpl if="invoiceitem_jobflag != 1">' +
                                '<a href="#" class="splitLineBtn">Split</a> ' +
                            '</tpl>' +
                            /*'<a href="#" class="editLineBtn">Edit</a>' +*/ // TODO: cleanup once confirmed we don't need this button
                        '<tpl else>' +
                            '<tpl if="invoiceitem_jobflag != 1">' +
                                '<a href="#" class="editSplitBtn">Edit Split</a>' +
                            /*'<tpl else>' +
                                '<a href="#" class="editLineBtn">Edit</a>' +*/  // TODO: cleanup once confirmed we don't need this button
                            '</tpl>' +
                        '</tpl>' +
                    '</div>' +
                    '<tpl if="this.getInvoiceRecord().get(\'invoice_status\') != \'paid\'">' +
                        '<a href="#" class="deleteLineBtn">Delete</a> ' +
                    '</tpl>' +
                    // TODO: complete this condition
                    '<tpl if="this.getInvoiceRecord().get(\'invoice_status\') != \'paid\'">' +
                        '<a href="#" class="linkLineBtn">Link</a>' +
                    '</tpl>' +
                // TODO: complete this condition
                '<tpl elseif="this.getInvoiceRecord().get(\'invoice_status\') == \'forapproval\'">' +
                    '<a href="#" class="modifyGlBtn">Modify GL</a>' +
                '</tpl>' +
            '</td>';
    },

    buildFooter: function() {
        var me= this;

        return '<tr>' +
                '<th colspan="6">SHIPPING:</th>' +
                '<th>' +
                    '<input type="text" name="shipping_amount" value="{[this.getSum(\'invoiceitem_shipping\', 0)]}" size="9" />' +
                '</th>' +
            '</tr>' +
            '<tr>' +
                '<th colspan="6">' +
                    '* A portion of the {[this.getSetting(\'PN.General.salesTaxTerm\', \'sales tax\')]} and shipping charges are allocated to the G/L account' +
                    '&nbsp;&nbsp; {[this.getSetting(\'PN.General.salesTaxTerm\', \'sales tax\')]}:' +
                '</th>' +
                '<th>' +
                    '<input type="text" name="tax_amount" value="{[this.getSum(\'invoiceitem_salestax\', 0)]}" size="9" />' +
                '</th>' +
            '</tr>';
    }
});
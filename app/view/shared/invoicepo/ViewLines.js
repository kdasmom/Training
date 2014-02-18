/**
 * The line items view for the invoice or PO page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.ViewLines', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.shared.invoicepo.viewlines',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.lib.core.Util',
        'Ext.view.View',
        'NP.view.shared.button.Edit',
        'NP.model.jobcosting.JbContract',
        'NP.model.jobcosting.JbChangeOrder',
        'NP.model.jobcosting.JbJobCode',
        'NP.model.jobcosting.JbPhaseCode',
        'NP.model.jobcosting.JbCostCode'
    ],

    layout     : 'fit',
    border     : false,
    bodyPadding: 0,
    autoScroll : true,
    
    type       : null,

    // For localization

    initComponent: function() {
        var me = this;
        
        me.tbar = [
            { xtype: 'shared.button.edit', itemId: 'invoiceLineEditBtn', disabled: true }
        ];

        me.fieldPrefix  = me.type + 'item';

        me.items = [{
            xtype       : 'dataview',
            itemSelector: 'tbody tr',
            store       : me.store,
            listeners   : {
                refresh: me.renderTaxShippingFields.bind(me)
            },
            tpl         : new Ext.XTemplate(me.buildTpl(), {
                getSetting: function(name, defaultVal) {
                    defaultVal = defaultVal || '';
                    return NP.Config.getSetting(name, defaultVal);
                },
                hasPermission: function(moduleId) {
                    return NP.Security.hasPermission(moduleId);
                },
                getStoreCount: function() {
                    return me.store.getCount();
                },
                showBudgetComparison: function(invoiceitem_jobflag) {
                    return NP.Config.getSetting("PN.InvoiceOptions.showBudgetComparison") == '1' && (
                            NP.Config.getSetting("PN.InvoiceOptions.showBudgetComparisonJC") == '1'
                            || invoiceitem_jobflag != 1
                    );
                },
                getInvoiceView: function() {
                    return me.up('[xtype="'+me.type+'.view"]');
                },
                getInvoiceRecord: function() {
                    return this.getInvoiceView().getInvoiceRecord();
                },
                getFormDataVal: function(key) {
                    var data = me.up('boundform').getLoadedData();

                    if (data) {
                        return data[key];
                    }

                    return null;
                },
                getSum: function(field) {
                    var total = 0;
                    
                    for (var i=0; i<me.store.getCount(); i++) {
                        total += me.store.getAt(i).get(field);
                    }

                    return total;
                },
                getGrossTotal: function() {
                    me.totalAmount = this.getSum(me.fieldPrefix + '_amount') +
                            this.getShippingTotal() +
                            this.getTaxTotal();

                    return me.totalAmount;
                },
                getShippingTotal: function() {
                    return this.getSum(me.fieldPrefix + '_shipping');
                },
                getTaxTotal: function() {
                    return this.getSum(me.fieldPrefix + '_salestax');
                },
                getRetentionTotal: function() {
                    var total = 0;
                    for (var i=0; i<me.store.getCount(); i++) {
                        total += me.store.getAt(i).get('jbassociation_retamt');
                    }

                    return total;
                },
                getNetAmount: function() {
                    me.totalAmount = this.getGrossTotal() - this.getRetentionTotal();

                    return me.totalAmount;
                },
                updateTotals: function() {
                    if (this.getSetting('pn.jobcosting.jobcostingEnabled', '0') == '1') {
                        Ext.get('entity_net_amount').update(
                            this.renderCurrency(this.getNetAmount())
                        );
                    }

                    Ext.get('entity_gross_total').update(
                        this.renderCurrency(this.getGrossTotal())
                    );
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
                },
                getValueFromStore: function(storeName, idField, id, field) {
                    var rec = Ext.getStore(storeName).findRecord(idField, id, 0, false, false, true);
                    if (rec) {
                        return rec.get(field);
                    } else {
                        return '';
                    }
                }
            })
        }];

    	this.callParent(arguments);

        this.addLineListeners();
    },

    renderTaxShippingFields: function(view) {
        var me = this;

        if (Ext.ComponentQuery.query('#entity_tax_amount').length) {
            Ext.ComponentQuery.query('#entity_tax_amount')[0].destroy();
            Ext.ComponentQuery.query('#entity_shipping_amount')[0].destroy();
        }

        if (Ext.get('entity_tax_amount') === null) {
            Ext.defer(function() {
                me.renderTaxShippingFields(view);
            }, 100);

            return;
        }

        Ext.create('Ext.form.field.Number', {
            renderTo        : 'entity_tax_amount',
            itemId          : 'entity_tax_amount',
            width           : 75,
            decimalPrecision: 2,
            hideTrigger     : true,
            value           : view.tpl.getSum(me.fieldPrefix + '_salestax', 0).toFixed(2),
            listeners       : {
                blur: function() {
                    me.fireEvent('changetaxtotal');
                }
            }
        });

        Ext.create('Ext.form.field.Number', {
            renderTo        : 'entity_shipping_amount',
            itemId          : 'entity_shipping_amount',
            width           : 75,
            decimalPrecision: 2,
            hideTrigger     : true,
            value           : view.tpl.getSum(me.fieldPrefix + '_shipping', 0).toFixed(2),
            listeners       : {
                blur: function() {
                    me.fireEvent('changeshippingtotal');
                }
            }
        });

        view.updateLayout();
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
            '<tpl if="this.getStoreCount() &gt; 0">' +
                '<tbody>' +
                    '<tpl for=".">' +
                        '<tr id="lineItem_{#}">' +
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
            '<tpl else>' +
                '<tbody>' +
                    '<tr>' +
                        '<td colspan="7">There are no line items for this invoice.</td>' +
                    '</tr>' +
                '</tbody>' +
            '</tpl>' +
            '</table>';
    },

    buildQuantityCol: function() {
        var me = this,
            html;

        html = 
            '<td>' +
                '<div>{[values.'+me.fieldPrefix+'_quantity*1]}</div>';

        if (me.type == 'invoice') {
            html +=
                '<tpl if="utilitycolumn_usagetype_id !== null">' +
                    '<div>{UtilityColumn_UsageType_Name}</div>' +
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
                    '<div><b>Account Number:</b> {UtilityAccount_AccountNumber}</div>' +
                    '<tpl if="UtilityAccount_MeterSize !== null">' +
                        '<div><b>Meter Number:</b> {UtilityAccount_MeterSize}</div>' +
                    '</tpl>' +
                '</tpl>';
        }

        html +=
            '<div>' +
                '{'+me.fieldPrefix+'_description}' +
                '<tpl if="!Ext.isEmpty('+me.fieldPrefix+'_description_alt)">' +
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
                        ' {unittype_material_name}' +
                    '</tpl>' +
                    ' {vcitem_uom}' +
                '</div>' +
            '</tpl>' + 
            me.buildCustomFields() +
            // TODO: add calendar alerts here
            '<tpl if="property_id !== this.getInvoiceRecord().get(\'property_id\')">' +
                '<b>{[this.getSetting(\'PN.Main.PropertyLabel\', \'Property\')]}:</b> ' +
                '{[this.getValueFromStore(\'property.AllProperties\', \'property_id\', values.property_id, \'property_name\')]}' +
            '</tpl>' +
            '<tpl if="unit_id !== null">' +
                '<div>' +
                    '<b>{[this.getSetting("PN.InvoiceOptions.UnitAttachDisplay")]}:</b>' +
                    ' {[this.getValueFromStore(\'property.AllUnits\', \'unit_id\', values.unit_id, \'unit_number\')]}' +
                '</div>' +
            '</tpl>' +
            '<tpl if="purchaseorder_id !== null">' +
                '<div>' +
                    '<b>PO:</b> ' +
                    // TODO: fix the link to the PO and add the readonly condition (latter might not be needed)
                    '<a class="poRefBtn">{purchaseorder_ref}</a>' +
                    '<tpl if="poitem_amount &gt; 0">' +
                        ' - <i>{[NP.Util.currencyRenderer(values.poitem_amount)]}</i>' +
                    '</tpl>' +
                '</div>' +
            '</tpl>' +
            '<tpl if="dfsplit_id !== null">' +
                '<div>' +
                    '<b>Default Split:</b> {dfsplit_name}' +
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
                '<tpl if="this.getSetting(\'pn.jobcosting.useContracts\', \'0\') == \'1\' && jbcontract_id !== null">' +
                    '<div>' +
                        '<b>{[this.getSetting("PN.jobcosting.contractTerm")]}:</b>' +
                        ' {[NP.model.jobcosting.JbContract.formatName(values)]}' +
                    '</div>' +
                '</tpl>' +
                '<tpl if="jbchangeorder_id !== null">' +
                    '<div>' +
                        '<b>{[this.getSetting("PN.jobcosting.changeOrderTerm")]}:</b>' +
                        ' {[NP.model.jobcosting.JbChangeOrderCode.formatName(values)]}' +
                    '</div>' +
                '</tpl>' +
                '<tpl if="jbjobcode_id !== null">' +
                    '<div>' +
                        '<b>{[this.getSetting("PN.jobcosting.jobCodeTerm")]}:</b>' +
                        ' {[NP.model.jobcosting.JbJobCode.formatName(values)]}' +
                    '</div>' +
                '</tpl>' +
                '<tpl if="jbphasecode_id !== null">' +
                    '<div>' +
                        '<b>{[this.getSetting("PN.jobcosting.phaseCodeTerm")]}:</b>' +
                        ' {[NP.model.jobcosting.JbPhaseCode.formatName(values)]}' +
                    '</div>' +
                '</tpl>' +
                '<tpl if="this.getSetting(\'pn.jobcosting.useCostCodes\', \'0\') == \'1\' && jbcostcode_id !== null">' +
                    '<div>' +
                        '<b>{[this.getSetting("PN.jobcosting.costCodeTerm")]}:</b>' +
                        ' {[NP.model.jobcosting.JbCostCode.formatName(values)]}' +
                    '</div>' +
                '</tpl>' +
                '<tpl if="jbassociation_retamt !== 0">' +
                    '<div>' +
                        '<b>Retention:</b> {[NP.Util.currencyRenderer(values.jbassociation_retamt)]}' +
                    '</div>' +
                '</tpl>' +
            '</tpl>';
    },

    buildGlCol: function() {
        return '<td>' +
                '<div>' +
                    '{[this.getValueFromStore(\'gl.AllGlAccounts\', \'glaccount_id\', values.glaccount_id, \'glaccount_number\')]}' +
                    '<tpl if="this.arrayContains(this.getInvoiceRecord().get(\'invoice_status\'), \'saved\',\'paid\',\'submitted\',\'sent\') == false">' +
                        '' + // TODO: add code for budget icon
                    '</tpl>' +
                    '<tpl if="this.getSetting(\'CP.INVOICE_ORDER_LINE_ITEM\', \'0\') == \'1\' && this.getStoreCount() &gt; 1">' +
                        '' + // TODO: add code to do re-ordering
                    '</tpl>' +
                '</div>' +
                '<div>{[this.getValueFromStore(\'gl.AllGlAccounts\', \'glaccount_id\', values.glaccount_id, \'glaccount_name\')]}</div>' +
                '<tpl if="jbcontractbudget_id !== null">' +
                    '<tpl if="jbcontract_id !== null">' +
                        '<div>{jbcontract_name}</div>' +
                    '<tpl else>' +
                        '<div>{jbjobcode_name}</div>' +
                    '</tpl>' +
                    // TODO: add icon to show job costing budget here
                '</tpl>' +
            '</td>';
    },

    buildBudgetCol: function() {
        return '<td align="right">' +
                '<tpl if="this.showBudgetComparison()">' +
                    '<tpl if="this.getSetting(\'PN.jobcosting.budgetlineitemcompare\') == \'1\' && jbjobcode_id !== null">' +
                        '{[this.renderCurrency(values.jbcontractbudget_amt)]}' +
                    '<tpl else>' +
                        '{[this.renderCurrency(values.budget_amount)]}' +
                    '</tpl>' +
                '</tpl>' +
            '</td>';
    },

    buildBudgetRemainingCol: function() {
        return '<td align="right">' +
                '<tpl if="this.showBudgetComparison()">' +
                    '<tpl if="this.getSetting(\'PN.jobcosting.budgetlineitemcompare\') == \'1\' && jbjobcode_id !== null">' +
                        '{[this.renderCurrency(values.jbcontractbudget_amt - (values.jbcontractbudget_amt_actual + values.jbcontractbudget_amt_pnactual))]}' +
                    '<tpl else>' +
                        '{[this.renderCurrency(values.budget_variance)]}' +
                    '</tpl>' +
                '</tpl>' +
            '</td>';
    },

    buildItemPriceCol: function() {
        var me = this;
        return '<td align="right">' +
                '{[this.renderCurrency(values.'+me.fieldPrefix+'_unitprice)]}' +
                '<tpl if="invoiceitem_taxflag == \'Y\'">' +
                    '<div class="taxableFlag">Taxable</div>' +
                '</tpl>' +
            '</td>';
    },

    buildAmountCol: function() {
        var me = this;
        return '<td align="right">' +
                '{[this.renderCurrency(values.'+me.fieldPrefix+'_amount)]}' +
                '<tpl if="this.isLineEditable()">' +
                    '<div>' +
                        '<tpl if="invoiceitem_split != 1">' +
                            '<tpl if="invoiceitem_jobflag != 1">' +
                                '<a class="splitLineBtn">Split</a> ' +
                            '</tpl>' +
                            /*'<a href="#" class="editLineBtn">Edit</a>' +*/ // TODO: cleanup once confirmed we don't need this button
                        '<tpl else>' +
                            '<tpl if="invoiceitem_jobflag != 1">' +
                                '<a class="editSplitBtn">Edit Split</a>' +
                            /*'<tpl else>' +
                                '<a href="#" class="editLineBtn">Edit</a>' +*/  // TODO: cleanup once confirmed we don't need this button
                            '</tpl>' +
                        '</tpl>' +
                    '</div>' +
                    '<div>' +
                        '<tpl if="this.getInvoiceRecord().get(\'invoice_status\') != \'paid\'">' +
                            '<a class="deleteLineBtn">Delete</a> ' +
                        '</tpl>' +
                        // TODO: still need to see if we need to add the reclass condition
                        '<tpl if="(this.getInvoiceRecord().get(\'invoice_status\') != \'paid\') ' +
                                    '&& purchaseorder_id === null && this.getFormDataVal(\'has_linkable_pos\') ' +
                                    '&& this.hasPermission(2038)">' +
                            '<a class="linkLineBtn">Link</a>' +
                        '</tpl>' +
                    '</div>' +
                '<tpl elseif="this.getInvoiceRecord().get(\'invoice_status\') == \'forapproval\' ' +
                                '&& this.getFormDataVal(\'is_approver\') && this.hasPermission(3001)">' +
                    '<div>' +
                        '<a class="modifyGlBtn">Modify&nbsp;GL</a>' +
                    '</div>' +
                '</tpl>' +
            '</td>';
    },

    buildFooter: function() {
        var me= this;

        return '<tr>' +
                '<th colspan="6">Shipping:</th>' +
                '<td>' +
                    '<div id="entity_shipping_amount" class="footer_field"></div>' +
                '</td>' +
            '</tr>' +
            '<tr>' +
                '<th colspan="6">' +
                    '<span>* A portion of the {[this.getSetting(\'PN.General.salesTaxTerm\', \'sales tax\')]} and shipping charges are allocated to the G/L account</span>' +
                    '{[this.getSetting(\'PN.General.salesTaxTerm\', \'sales tax\')]}:' +
                '</th>' +
                '<td>' +
                    '<div id="entity_tax_amount" class="footer_field"></div>' +
                '</td>' +
            '</tr>' +
            '<tr>' +
                '<th colspan="6">' +
                    '<tpl if="this.getSetting(\'pn.jobcosting.jobcostingEnabled\', \'0\') == \'1\'">' +
                        'Gross ' +
                    '</tpl>' +
                    'Total:' +
                '</th>' +
                '<td id="entity_gross_total">' +
                    '{[this.renderCurrency(this.getGrossTotal())]}' +
                '</td>' +
            '</tr>' +
            '<tpl if="this.getSetting(\'pn.jobcosting.jobcostingEnabled\', \'0\') == \'1\'">' +
                '<tr>' +
                    '<th colspan="6">' +
                        'Net Amount:' +
                    '</th>' +
                    '<td id="entity_net_amount">' +
                        '{[this.renderCurrency(this.getNetAmount())]}' +
                    '</td>' +
                '</tr>' +
            '</tpl>';
    },

    getTotalAmount: function() {
        return this.totalAmount;
    },

    addLineListeners: function() {
        var me = this;

        me.addEvents('clicksplitline','clickeditsplit','clickmodifygl',
                        'clicklinkline','clickdeleteline','clickporef');

        // Add a generic event handler on the body element to make things more efficient
        me.mon(Ext.getBody(), 'click', function(e, target) {
            var clickedEl  = Ext.get(target),
                btnClasses = ['splitLineBtn','editSplitBtn','modifyGlBtn','linkLineBtn',
                                'deleteLineBtn','poRefBtn'];
            
            for (var i=0; i<btnClasses.length; i++) {
                var btnClass = btnClasses[i];

                if (clickedEl.hasCls(btnClass)) {
                    var rowEl   = Ext.get(target).up('tr'),
                        row     = parseInt(rowEl.id.split('_')[1]),
                        rec     = me.store.getAt(row-1),
                        evtName = 'click' + btnClass.replace('Btn', '').toLowerCase();

                    me.fireEvent(evtName, rec);
                    e.stopEvent();
                }
            }
            
        });

        me.addEvents('taxchange','shippingchange');
    }
});
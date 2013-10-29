/**
 * The history log grid for invoice and PO view pages
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.ViewPayments', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.invoice.viewpayments',
    
    requires: [
    	'NP.lib.core.Config',
    	'NP.lib.core.Security',
    	'NP.lib.core.Util',
    	'NP.store.invoice.InvoicePayments'
    ],

    frame      : true,
    bodyPadding: 0,

    // Additional config
    totalAmount: 0,         // This should be overriden with the total invoice amount

    // For localization
	title                 : 'Payments',
	paymentNumColName     : 'Payment Number',
	dateColName           : 'Date',
	statusColName         : 'Status',
	paidByColName         : 'Paid By',
	payMethodColName      : 'Payment Method',
	clearDateColName      : 'Cleared Date',
	amountColName         : 'Payment Amount',
	appliedAmountColName  : 'Applied Amount',
	amountRemainingColName: 'Amount Remaining',
	emptyText             : 'No payments found',

    initComponent: function() {
        var me = this;

        me.store = {
            type   : 'invoice.invoicepayments',
            service: 'InvoiceService',
            action : 'getPayments'
        };

        me.columns = {
        	defaults : { flex: 1 },
            items    : [
                {
                    text     : me.paymentNumColName,
                    dataIndex: 'invoicepayment_number',
                    flex     : 0.5
                },{
                	xtype    : 'datecolumn',
                    text     : me.dateColName,
                    dataIndex: 'invoicepayment_datetm',
                    flex     : 0.5
                },{
                    text     : me.statusColName,
                    dataIndex: 'invoicepayment_status',
                    flex     : 0.5
                },{
                    text     : me.paidByColName,
                    dataIndex: 'person_firstname',
                    renderer: function(val, meta, rec) {
                    	var name          = rec.get('person_firstname') + ' ' + rec.get('person_lastname'),
                    		paid_by       = rec.get('invoicepayment_paid_by'),
                    		paid_by_deleg = rec.get('invoicepayment_paid_by_delegation_to');

                    	if (paid_by !== paid_by_deleg && paid_by !== null && paid_by_deleg !== null) {
                    		name += ' (done by ' + rec.get('delegation_to_userprofile_username') +
                    				' on behalf of ' + rec.get('userprofile_username') + ')'
                    	}

                    	return name;
                    }
                },{
                    text     : me.payMethodColName,
                    dataIndex: 'invoicepayment_type',
                    renderer: function(val, meta, rec) {
                    	var paymentType = rec.get('invoicepayment_type'),
                    		checkName   = NP.Config.getSetting('PN.Intl.checkName', 'Check'),
                    		method      = (paymentType == 'Check') ? checkName : paymentType,
                    		checkNum    = rec.get('invoicepayment_checknum');

                    	if (checkNum !== '') {
                    		method += ' #' + checkNum;
                    	}

                    	return method;
                    }
                }
            ]
        };

        if (NP.Config.getSetting('CP.invoicepayment_checkcleared_on', '0') == '1') {
        	me.columns.items.push({
            	xtype    : 'datecolumn',
                text     : me.clearDateColName,
                dataIndex: 'invoicepayment_checkcleared_datetm'
            });
        }

        me.columns.items.push({
        	xtype    : 'numbercolumn',
            text     : me.amountColName,
            dataIndex: 'invoicepayment_amount',
            renderer : NP.Util.currencyRenderer,
            align    : 'right'

        });

        // Only show these columns if the amount remaining setting is on
        if (NP.Config.getSetting('PN.InvoiceOptions.amountRemaining', '0') == '1') {
	        me.columns.items.push(
	        	{
	        		xtype    : 'numbercolumn',
		            text     : me.appliedAmountColName,
		            dataIndex: 'invoicepayment_applied_amount',
		            renderer : function(val, meta, rec) {
		            	var amount = val;
		            	if (amount === null) {
		            		amount = rec.get('invoicepayment_amount');
		            	}

		            	return NP.Util.currencyRenderer(amount);
		            },
		            align    : 'right'
		        },{
		        	xtype    : 'numbercolumn',
		            text     : me.amountRemainingColName,
		            dataIndex: 'amount_remaining',
		            renderer : function(val, meta, rec, rowIndex) {
		            	// We need to compute the amount remaining by looping over all records, so only
		            	// do it once, no need to do it every single time
		            	if (!('amountRemaining' in me)) {
		            		me._hasEditable = false;

		            		var recs = me.getStore().getRange(),
		            			current_balance = me.totalAmount,
		            			increment_amount;
		            		
		            		me.amountRemaining = [];
		            		for (var i=0; i<recs.length; i++) {
		            			var status = recs[i].get('invoicepayment_status');
		            			if (recs[i].get('invoicepayment_applied_amount') !== null) {
		            				increment_amount = recs[i].get('invoicepayment_applied_amount');
		            			} else {
		            				increment_amount = recs[i].get('invoicepayment_amount');
		            			}
		            			if (status == 'paid')	{
		            				current_balance -= increment_amount
		            			} else if (status == 'nsf' || status == 'void') {
		            				current_balance += increment_amount;
		            			}
		            			me.amountRemaining[i] = current_balance;
		            		}
		            	}

		            	return NP.Util.currencyRenderer(me.amountRemaining[rowIndex]);
		            },
            		align    : 'right'
		        }
		    );

			if (NP.Security.hasPermission(6064)) {
				//me.columns.items.push();
			}
		}

        me.callParent(arguments);
    }
});
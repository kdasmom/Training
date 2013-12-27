Ext.define('NP.view.invoice.InvoicePrintView', {
    extend: 'Ext.XTemplate',
    alias:  'widget.invoice.invoiceprintview',

    requires: [
    	'NP.lib.core.Config',
    	'NP.lib.core.Util',
    	'NP.view.shared.invoicepo.ViewLines'
    ],

    constructor: function() {
    	var me = this;

    	me.callParent([me.buildTpl()]);
    },

    getSetting: function(name, defaultVal) {
        defaultVal = defaultVal || '';
        return NP.Config.getSetting(name, defaultVal);
    },

    displayIfNotBlank: function(val, label, type, format) {
    	label = label || '';
    	type = type || 'string';
    	format = format || (type == 'date') ? 'm/d/Y' : null;
    	if (val != '' && val !== null) {
    		if (type == 'date') {
    			val = Ext.Date.format(Ext.Date.parse(val, NP.Config.getServerDateFormat()), format);
    		} else if (type == 'currency') {
    			val = NP.Util.currencyRenderer(val);
    		}

    		if (label != '') {
    			label += ': ';
    		}
    		return '<div>' + label + val + '</div>';
    	}

    	return ''
    },

    buildTpl: function() {
    	var me = this;

    	return '<table width="100%" id="entityPrintTable">' +
	    			me.buildHeader() +
	    			me.buildSpacer() +
				    me.buildLine() +
				    me.buildSpacer() +
	    			me.buildSubHeader() +
	    		'</table>' +
	    		'<br />' +
    			me.buildLines();
    },

    buildLine: function() {
    	return '<tr><td colspan="2" class="blackLine"></td></tr>';
    },

    buildSpacer: function() {
    	return '<tr><td colspan="2" class="spacer"></td></tr>';
    },

    getPropertyAddress: function(data) {
    	return {
			address_line1  : data['property_address_line1'],
			address_line2  : data['property_address_line2'],
			address_city   : data['property_address_city'],
			address_state  : data['property_address_state'],
			address_zip    : data['property_address_zip'],
			address_zipext : data['property_address_zipext'],
			address_country: data['property_address_country']
    	};
    },

    getPropertyPhone: function(data) {
    	return {
			phone_number   : data['property_phone_number'],
			phone_ext  : data['property_phone_ext'],
			phone_countrycode  : data['property_phone_countrycode']
    	};
    },

    buildHeader: function() {
    	return '<tr>' +
    			'<td width="75%">' +
		    		'<tpl if="this.getSetting(\'PN.Main.ClientShortName\', \'\') != \'\'">' +
		    			'<span id="clientShortName">{[this.getSetting("PN.Main.ClientShortName")]}</span>' +
		    		'</tpl>' +
		    		'<br />' +
		    		'Status: {[NP.model.invoice.Invoice.getDisplayStatus(values.invoice_status)]}' +
		    	'</td>' +
		    	'<td>' +
		    		'<span id="propertyName">{property_name}</span>' +
		    		'{[NP.model.contact.Address.getHtml(this.getPropertyAddress(values))]}' +
		    		'<div>{[NP.model.contact.Phone.getFullPhone(this.getPropertyPhone(values))]}</div>' +
		    	'</td>' +
		    '</tr>';
    },

    buildSubHeader: function() {
    	return '<tr>' +
    				'<td id="vendorInfo">' +
    					'{vendor_name}' +
    					'<div>Vendor ID: {vendor_id_alt}</div>' +
    					'{[NP.model.contact.Address.getHtml(values)]}' +
		    			'<div>{[NP.model.contact.Phone.getFullPhone(values)]}</div>' +
    				'</td>' +
    				'<td>' +
    					'Invoice: {invoice_ref}' +
    					'{[this.displayIfNotBlank(values.invoice_datetm, "Invoice Date", "date")]}' +
    					'{[this.displayIfNotBlank(values.invoice_duedate, "Due Date", "date")]}' +
    					'{[this.displayIfNotBlank(values.entity_amount, "Invoice Total", "currency")]}' +
    					'{[this.displayIfNotBlank(values.created_by, "Created By")]}' +
    					'{[this.displayIfNotBlank(values.invoice_createddatetm, "Created Date", "date")]}' +
    					'{[this.displayIfNotBlank(values.invoice_period, this.getSetting(\'PN.General.postPeriodTerm\'), "date", "m/Y")]}' +
    					'{[this.displayCustomFields(values, "header")]}' +
    				'</td>' +
    			'</tr>';
    },

    displayCustomFields: function(data, type) {
    	var me           = this,
    		html         = '',
    		customFields = NP.Config.getCustomFields()[type].fields,
    		field,
    		i;

    	for (i=1; i<=customFields.length; i++) {
    		field = customFields[i];
    		if (field.invOn) {
    			html += me.displayIfNotBlank(data['universal_field'+i], field.label);
    		}
    	}

    	return html;
    },

    buildLines: function() {
    	return '<table width="100%" id="entityPrintLines">' +
				'<tr>' +
					'<th width="150px">GL Account</th>' +
					'<th width="50px">QTY</th>' +
					'<th width="400px">Description</th>' +
					'<th width="100px">Item Price</th>' +
					'<th width="100px">Amount</th>' +
				'</tr>' +
				'<tpl for="lines">' +
					'<tr>' +
						'<td>{glaccount_number}<br />{glaccount_name}</td>' +
						'<td>' +
							'{[values.invoiceitem_quantity*1]}' +
							'{[this.displayIfNotBlank(values.UtilityColumn_UsageType_Name)]}' +
						'</td>' +
						'<td>' +
							'<tpl if="utilityaccount_id != null">' +
								'<div>Account Number: {UtilityAccount_AccountNumber}</div>' +
								'{[this.displayIfNotBlank(values.UtilityAccount_MeterSize, "Meter Number")]}' +
							'</tpl>' +
							'<div>{invoiceitem_description}</div>' +
							'{[this.displayIfNotBlank(values.invoiceitem_description_alt)]}' +
							'{[this.displayIfNotBlank(values.vcitem_number, "Item Number")]}' +
							'<tpl if="vcitem_uom != null && vcitem_uom != \'\'">' +
								'<div>' +
									'UOM: ' +
									'<tpl if="vcitem_uom != null && vcitem_uom != \'\'">' +
										'{unittype_material_name} ' +
									'</tpl>' +
									'{vcitem_uom}' +
								'</div>' +
							'</tpl>' +
							'{[this.displayCustomFields(values, "line")]}' +
							this.buildJobCosting() +
							'{[this.displayIfNotBlank(values.purchaseorder_ref, "PO")]}' +
						'</td>' +
						'<td class="align-right">{[NP.Util.currencyRenderer(values.invoiceitem_unitprice)]}</td>' +
						'<td class="align-right">{[NP.Util.currencyRenderer(values.invoiceitem_amount)]}</td>' +
					'</tr>' +
				'</tpl>' +
				this.buildLineFooter() +
				'</table>';
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
	                        ' {[NP.model.jobcosting.JbChangeOrder.formatName(values)]}' +
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

    getSum: function(data, field) {
        var total = 0,
        	val;
        
        for (var i=0; i<data.lines.length; i++) {
        	val = data.lines[i][field];
        	if (val !== null && val != '' && !isNaN(val)) {
            	total += parseFloat(data.lines[i][field]);
            }
        }

        return total;
    },

    renderCurrency: function(val) {
        return NP.Util.currencyRenderer(val);
    },

    getGrossTotal: function(data) {
        var totalAmount = this.getSum(data, 'invoiceitem_amount') +
                this.getSum(data, 'invoiceitem_shipping') +
                this.getSum(data, 'invoiceitem_salestax');

        return totalAmount;
    },

    getNetAmount: function(data) {
        return this.getGrossTotal(data) - this.getRetentionTotal(data);

        return totalAmount;
    },

    getRetentionTotal: function(data) {
    	return this.getSum(data, 'jbassociation_retamt');
    },

    buildLineFooter: function(data) {
        return '<tfoot>' +
	        		'<tr>' +
	                '<th colspan="4">' +
	                    '<div>{[this.getSetting("PN.General.salesTaxTerm", "Sales Tax").toUpperCase()]}</div>' +
	                    '<div>SHIPPING</div>' +
	                    '<div>' +
		                    '<tpl if="this.getSetting(\'pn.jobcosting.jobcostingEnabled\', \'0\') == \'1\'">' +
		                        'GROSS ' +
		                    '</tpl>' +
		                    'TOTAL' +
		                '</div>' +
	                    '<tpl if="this.getSetting(\'pn.jobcosting.jobcostingEnabled\', \'0\') == \'1\'">' +
	                    	'<div>NET AMOUNT</div>' +
	                    '</tpl>' +
	                '</th>' +
	                '<td>' +
	                    '<div>{[this.renderCurrency(this.getSum(values, "invoiceitem_salestax"))]}</div>' +
	                    '<div>{[this.renderCurrency(this.getSum(values, "invoiceitem_shipping"))]}</div>' +
	                    '<div>{[this.renderCurrency(this.getGrossTotal(values))]}</div>' +
	                    '<tpl if="this.getSetting(\'pn.jobcosting.jobcostingEnabled\', \'0\') == \'1\'">' +
	                    	'<div>{[this.renderCurrency(this.getNetAmount(values))]}</div>' +
	                    '</tpl>' +
	                '</td>' +
	            '</tr>' +
	        '</tfoot>';
    }
});
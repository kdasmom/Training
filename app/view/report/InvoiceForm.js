/**
 * View that displays form for choosing which invoice report to run
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.report.InvoiceForm', {
	extend: 'Ext.form.Panel',
	alias : 'widget.report.invoiceform',

	requires: [
		'NP.lib.ui.ComboBox',
		'NP.lib.data.Store',
		'NP.view.shared.button.Report',
		'NP.view.report.ReportFormatField',
		'NP.view.shared.VendorAutoComplete',
		'NP.view.report.DateFilterField',
		'NP.lib.ui.ListPicker',
		'NP.view.shared.ContextPickerMulti',
		'NP.store.user.Userprofiles',
		'NP.store.report.InvoiceReports'
	],

	border     : false,
	bodyPadding: 8,

	initComponent: function() {
		var me = this;

		me.title = NP.Translator.translate('Invoice Register Report Tool');

		me.tbar = [
			{ iconCls: 'register-yellow-btn', text: NP.Translator.translate('Invoice Register') },
			{ xtype: 'shared.button.report', text: NP.Translator.translate('Generate Report') }
		];

		me.defaults = { labelWidth: 260 };
		me.items = [
			{
				xtype            : 'customcombo',
				fieldLabel       : NP.Translator.translate('Report Type'),
				itemId           : 'report_type',
				name             : 'report_type',
				displayField     : 'report_display_name',
				valueField       : 'report_name',
				width            : 520,
				store            : { type: 'report.invoicereports' },
				selectFirstRecord: true
			},
			{ xtype: 'report.reportformatfield', itemId: 'report_format' },
			{
				xtype     : 'shared.vendorautocomplete',
				itemId    : 'vendor_id',
				allowBlank: true,
				emptyText : NP.Translator.translate('ALL'),
				width     : 520
			},
			{ xtype: 'report.datefilterfield', itemId: 'date_filter' },
			{
				xtype       : 'listpicker',
				itemId      : 'invoice_status',
				title       : null,
				fieldLabel  : NP.Translator.translate('Status'),
				name        : 'invoice_status',
				displayField: 'invoice_status_display',
				valueField  : 'invoice_status',
				store       : me.getStatusStore(),
				width       : 520,
				height      : 90
			},
			me.getUserField('created_by', 'Created By'),
			me.getUserField('approved_by', 'Approved By'),
			{
				xtype     : 'checkbox',
				itemId    : 'only_without_pos',
				name      : 'only_without_pos',
				fieldLabel: NP.Translator.translate('Only Invoices without Purchase Orders'),
				inputValue: 1
			},
			{
				xtype     : 'checkbox',
				itemId    : 'only_cap_ex',
				name      : 'only_cap_ex',
				fieldLabel: NP.Translator.translate('Only include Capital Expenditures'),
				inputValue: 1
			},
			{
				xtype     : 'fieldcontainer',
				fieldLabel: NP.Config.getPropertyLabel(),
				items     : [{ xtype: 'shared.contextpickermulti', itemId: 'property_picker' }]
			}
		];

		this.callParent(arguments);
	},

	getStatusStore: function() {
		return Ext.create('Ext.data.Store', {
			fields: ['invoice_status', 'invoice_status_display'],
			data: [
				{ invoice_status: 'open', invoice_status_display: NP.Translator.translate('In Progress') },
				{ invoice_status: 'forapproval', invoice_status_display: NP.Translator.translate('Pending Approval') },
				{ invoice_status: 'saved', invoice_status_display: NP.Translator.translate('Completed') },
				{ invoice_status: 'rejected', invoice_status_display: NP.Translator.translate('Rejected') },
				{ invoice_status: 'hold', invoice_status_display: NP.Translator.translate('On Hold') },
				{ invoice_status: 'submitted', invoice_status_display: NP.Translator.translate('Submitted for Payment') },
				{ invoice_status: 'sent', invoice_status_display: NP.Translator.translate('In') },
				{ invoice_status: 'posted', invoice_status_display: NP.Translator.translate('Posted In') },
				{ invoice_status: 'paid', invoice_status_display: NP.Translator.translate('Paid') },
				{ invoice_status: 'void', invoice_status_display: NP.Translator.translate('Void') }
			]
		});
	},

	getUserField: function(name, label) {
		return {
				xtype       : 'customcombo',
				itemId      : name,
				name        : name,
				fieldLabel  : NP.Translator.translate(label),
				displayField: 'userprofile_username',
				valueField  : 'userprofile_id',
				emptyText   : NP.Translator.translate('ALL'),
				store       : this.getUserStore(),
				width       : 520
			}
	},

	getUserStore: function() {
		var me = this;

		if (!me.userStore) {
			me.userStore = Ext.create('NP.store.user.Userprofiles', {
				service    : 'UserService',
				action     : 'getAll',
				extraParams: {
					sort: 'userprofile_username'
				},
				autoLoad   : true,
				sorters    : 'userprofile_username'
			});
		}

		return me.userStore;
	}
});
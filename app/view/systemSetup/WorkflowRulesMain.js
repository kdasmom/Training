Ext.define('NP.view.systemSetup.WorkflowRulesMain', {
	extend: 'Ext.panel.Panel',
	alias:  'widget.systemsetup.workflowrulesmain',

	layout: 'fit',
	border: false,

	requires: [
		'NP.view.systemSetup.WorkflowRulesGrid',
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.CreateRule',
		'NP.view.shared.button.Print',
		'NP.view.shared.button.Report',
		'NP.view.shared.button.Activate',
		'NP.view.shared.button.Inactivate',
		'NP.view.shared.button.Copy',
		'NP.view.shared.button.Delete'
	],

	initComponent: function() {
		this.items = [
			{
				xtype: 'tabpanel',
				items: [
					{
						xtype: 'panel',
						title: NP.Translator.translate('Workflow Rules'),
						items: [
							{
								xtype: 'systemsetup.workflowrulesgrid'
							}
						]
					},
					{
						xtype: 'panel',
						title: NP.Translator.translate('Workflow Definitions'),
						bodyPadding: 10,
						html:[
							'<p>Workflow Manager holds the rules that govern various NexusPayables activities.  Through workflow rules, the administrator indicates the appropriate routing for purchase orders and invoices and whether users should be permitted to delegate their approval authority to other users.  This section explains the types of rules that can be defined and the process used for setting them up.  There are three main types of rules: rules for Invoice and Purchase Order routing, a rule for Delegation, and a rule for Optional Workflow.  Please reference the Rule Types section for specific definitions of each rule type.</p>',
							'<p>A list of rules in use in NexusPayables can be found by clicking on Current Workflow Rules.  From this area, rules can be easily printed, searched across, and reported on.</p>',
							'<strong>Rules for Invoice and Purchase Order Routing</strong>',
							'<p>The majority of the workflow rules fall into this category.  These rules indicate when invoices or purchase orders should be sent from one user to another for approval.  The following rules are available:</p>',
							'<ul>',
								'<li><strong>Budget amount (by GL category)</strong> - applies to both invoices and purchase orders; route the invoice or PO if it puts the selected GL category over budget by the specified amount.</li>',
								'<li><strong>Budget amount (by GL code)</strong> - applies to both invoices and purchase orders; route the invoice or PO if it puts the selected GL code over budget by the specified amount.</li>',
								'<li><strong>Invoice item amount (by GL category)</strong> - route an invoice if more than the specified amount is charged to the selected GL category.</li>',
								'<li><strong>Invoice item amount (by GL code)</strong> - route an invoice if more than the specified amount is charged to the selected GL account.</li>',
								'<li><strong>Invoice total amount</strong> - route an invoice if the total amount of the invoice exceeds the specified amount.</li>',
								'<li><strong>Purchase Order item total (by GL category)</strong> - route a purchase order if more than the specified amount is charged to the selected GL category.</li>',
								'<li><strong>Purchase Order item total (by GL code)</strong> - route a purchase order if more than the specified amount is charged to the selected GL code.</li>',
								'<li><strong>Purchase Order total amount</strong> - route a purchase order if the total amount of the purchase order exceeds the specified amount.</li>',
								'<li><strong>Specific vendor</strong> - applies to both invoices and purchase orders; route the invoice or purchase order according to the specified vendor and the total amount exceeds the specified amount.</li>',
								'<li><strong>Specific vendor master</strong> - works like the specific vendor workflow rule except that purchase orders or invoices applied to the vendor designated in this rule do not route based on any other rule in the system except for this rule type.</li>',
								'<li><strong>Yearly Budget amount (by GL Category)</strong>-applies to both invoices and purchase orders; routes the invoice or purchase order if it puts the selected GL category over the specified amount.</li>',
								'<li><strong>Yearly Budget amount (by GL Code)</strong>- applies to both invoices and purchase orders; routes the invoice or purchase order if it puts the selected GL code over the specified amount.</li>',
								'<li><strong>Converted Invoices - Master (by total amount)</strong> - applies only to invoices converted from a purchase order; routes the invoice according to the total dollar amount designated in this rule and does not route the invoice based on any other rule type  in the system.</li>',
								'<li><strong>Invoice Item Amount (by Job Code)</strong> - this rule will route the invoice for approval based on the job code assigned to any one invoice line item.</li>',
								'<li><strong>PO Item Amount (by Job Code)</strong> - this rule will route the purchase order for approval based on the job code assigned to any one purchase order line item.</li>',
								'<li><strong>Receipt Total Amount</strong> - this rule will route a receipt for approval based on the total receipt amount.</li>',
								'<li><strong>Invoice Item Amount (by Contract)</strong> - this rule will route the invoice for approval based on the contract assigned to any one invoice line item.</li>',
								'<li><strong>PO Item Amount (by Contract)</strong> - this rule will route the purchase order for approval based on the contract assigned to any one purchase order line item.</li>',
								'<li><strong>Invoice Item Amount (by Contract) - Master</strong>  - this rule will route the invoice for approval based on the contract assigned to any one invoice line item and override any other rules (except the Vendor Master rule).  If this rule applies, no other workflow rules (except the Vendor Master) will apply.</li>',
								'<li><strong>PO Item Amount (by Contract) - Master</strong>- this rule will route the purchase order for approval based on the contract assigned to any one purchase order line item and override any other rules (except the Vendor Master rule).  If this rule applies, no other workflow rules (except the Vendor Master) will apply.</li>',
								'<li><strong>YTD % Overage Budget Variance (by GL category)</strong> - this rule will route POs and invoices based on the amount entered on the line item that exceeds the budget amount by the assigned percentage for the designated GL Category(s). This rule will look at year-to-date budget overage to compare against the year-to-date combined budget amount up to and including the current period.</li>',
								'<li><strong>YTD % Overage Budget Variance (by GL code)</strong> - this rule will route POs and invoices based on the amount entered on the line item that exceeds the budget amount by the assigned percentage for the designated GL Code(s). This rule will look at year-to-date budget overage to compare against the year-to-date combined budget amount up to and including the current period.</li>',
								'<li><strong>Invoice Total by Pay By-Master Rule</strong> - this rule will route invoices based on the header summary information and values entered into the pay by field on invoices.</li>',
								'<li><strong>YTD Budget % Overage (by GL Code)</strong> - this rule will route POs and invoices based on the amount entered on the line item that exceeds the budget amount by the assigned percentage for the designated GL Code(s) This rule will look at year-to-date budget overage to compare against the year-to-date combined budget amount up to and including the current period.</li>',
								'<li><strong>YTD Budget % Overage (by GL Category)</strong> -  this rule will route POs and invoices based on the amount entered on the line item that exceeds the budget amount by the assigned percentage for the designated GL Category(s). This rule will look at year-to-date budget overage to compare against the year-to-date combined budget amount up to and including the current period.</li>',
								'<li><strong>MTD Budget % Overage (by GL category)</strong> - this rule will route POs and invoices based on the amount entered on the line item that exceeds the budget amount by the assigned percentage for the designated GL Category(s). This rule will look at month-to-date budget overage to compare against the month-to-date combined budget amount up to and including the current period.</li>',
								'<li><strong>MTD Budget % Overage (by GL code)</strong> - this rule will route POs and invoices based on the amount entered on the line item that exceeds the budget amount by the assigned percentage for the designated GL Code(s). This rule will look at month-to-date budget overage to compare against the month-to-date combined budget amount up to and including the current period.</li>',
								'<li><strong>YTD Budget Overage (by GL category)</strong> - this rule will route POs and invoices based on the amount entered on the line item that exceeds the budget amount by the assigned amount for the designated GL Category(s). This rule will look at year-to-date budget overage to compare against the year-to-date combined budget amount up to and including the current period.</li>',
								'<li><strong>YTD Budget Overage (by GL code)</strong> - this rule will route POs and invoices based on the amount entered on the line item that exceeds the budget amount by the assigned amount for the designated GL Code(s). This rule will look at year-to-date budget overage to compare against the year-to-date combined budget amount up to and including the current period.</li>',
								'<li><strong>PO Item Amount by Department</strong> - route a purchase order if more than the specified amount is charged to the selected department.</li>',
								'<li><strong>Invoice item amount by department</strong> - route an invoice if more than the specified amount is charged to the selected department.</li>',
								'<li><strong>Receipt item total (by GL category) </strong>- route a receipt if more than the specified amount is charged to the selected GL category.</li>',
								'<li><strong>Receipt item total (by GL code)</strong> - route a receipt if more than the specified amount is charged to the selected GL code.</li>',
							'</ul>',
							'<strong>Rule for Delegation</strong>',
							'<p>The Delegation workflow rule turns on the ability for users to delegate approval authority to other users. In addition, it allows the administrator to specify to whom a user is permitted to delegate.  Only one delegation rule is available: <strong><em>Delegation</em></strong>.</p>',
							'<strong>Rule for Optional Workflow</strong>',
							'<p>The Optional Workflow rule turns on the ability for users to route a purchase order or invoice outside of the standard workflow.  Optional Workflow does not remove workflow rules or approval steps already associated with a purchase order or invoice.  Only one optional workflow rule is available: <strong><em>Optional Workflow</em></strong>.</p>'
						].join('')
					}
				]
			}
		];

		this.callParent(arguments);
	}
});
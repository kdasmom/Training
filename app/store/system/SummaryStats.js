/**
 * Store for Summary Stats. This is a static store, it does not use an Ajax proxy. Additional summary stats
 * should be added here to be used by other parts of the app.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.SummaryStats', {
	extend: 'Ext.data.Store',
	
	fields: [
		{ name: 'id', type: 'int' },
		{ name: 'title' },
		{ name: 'name' },
		{ name: 'store' },
		{ name: 'service' },
		{ name: 'module_id' },
		{ name: 'category' },
		{ name: 'config' }
	],
	
	invoicesToApproveText      : 'Invoices to Approve',
	invoicesOnHoldText         : 'Invoices on Hold',
	invoicesCompletedText      : 'Completed Invoices to Approve',
	invoicesRejectedText       : 'Rejected Invoices',
	invoicesMyText             : 'My Invoices',
	posToApproveText           : 'Purchase Orders To Approve',
	posReleasedText            : 'Approved Purchase Orders for Review',
	posByUserText              : 'My Purchase Orders',
	posRejectedText            : 'Rejected Purchase Orders',
	receiptsToApproveText      : 'Receipts To Approve',
	receiptsRejectedText       : 'Rejected Receipts',
	receiptsPendingPostText    : 'Receipts Pending Post Approval',
	imagesToConvertText        : 'Images to Convert to Invoice',
	imagesToProcessText        : 'Image Invoices to be Processed',
	imagesToIndexText          : 'Images to be Indexed',
	imageExceptionsText        : 'Image Exceptions',
	vendorsToApproveText       : 'Vendors to Approve',
	vcAuthRequestsText         : 'VendorConnect Authorization Request',
	expiredInsuranceCertsText  : 'Expired Insurance Certificates',
	mtdOverBudgetCategoriesText: 'Month-to-Date Over Budget Categories',
	ytdOverBudgetCategoriesText: 'Year-to-Date Over Budget Categories',

	constructor: function() {
		var that = this;

		this.data = [];

		// First we define a basic array of stats to loop over
		var stats = [
			// PO category
			{ id: 3, title: this.posToApproveText, name: 'PosToApprove', module_id: 1055, store: 'po.Purcasheorders', service: 'PoService', category: 'po' },
			{ id: 29, title: this.posReleasedText, name: 'PosReleased', module_id: 6039, store: 'po.Purcasheorders', service: 'PoService', category: 'po' },
			{ id: 9, title: this.posByUserText, name: 'PosByUser', module_id: 2050, store: 'po.Purcasheorders', service: 'PoService', category: 'po' },
			{ id: 26, title: this.posRejectedText, name: 'PosRejected', module_id: 6035, store: 'po.Purcasheorders', service: 'PoService', category: 'po' },
			{ id: 27, title: this.receiptsToApproveText, name: 'ReceiptsToApprove', module_id: 6026, store: 'po.Receipts', service: 'ReceiptService', category: 'po' },
			{ id: 28, title: this.receiptsRejectedText, name: 'ReceiptsRejected', module_id: 6028, store: 'po.Receipts', service: 'ReceiptService', category: 'po' },
			{ id: 34, title: this.receiptsPendingPostText, name: 'ReceiptsPendingPost', module_id: 6059, store: 'po.Receipts', service: 'ReceiptService', category: 'po' },
			// Invoice category
			{ id: 4, title: this.invoicesToApproveText, name: 'InvoicesToApprove', module_id: 1053, store: 'invoice.Invoices', service: 'InvoiceService', category: 'invoice' },
			{ id: 31, title: this.invoicesOnHoldText, name: 'InvoicesOnHold', module_id: 6052, store: 'invoice.Invoices', service: 'InvoiceService', category: 'invoice' },
			{ id: 6, title: this.invoicesCompletedText, name: 'InvoicesCompleted', module_id: 2004, store: 'invoice.Invoices', service: 'InvoiceService', category: 'invoice' },
			{ id: 23, title: this.invoicesRejectedText, name: 'InvoicesRejected', module_id: 6036, store: 'invoice.Invoices', service: 'InvoiceService', category: 'invoice' },
			{ id: 10, title: this.invoicesMyText, name: 'InvoicesByUser', module_id: 2060, store: 'invoice.Invoices', service: 'InvoiceService', category: 'invoice' },
			// Image category
			{ id: 7, title: this.imagesToConvertText, name: 'ImagesToConvert', module_id: 1050, store: 'image.ImageIndexes', service: 'ImageService', category: 'image' },
			{ id: 8, title: this.imagesToProcessText, name: 'ImagesToProcess', module_id: 2040, store: 'image.ImageIndexes', service: 'ImageService', category: 'image' },
			{ id: 30, title: this.imageExceptionsText, name: 'ImageExceptions', module_id: 6050, store: 'image.ImageIndexes', service: 'ImageService', category: 'image' },
			{ id: 24, title: this.imagesToIndexText, name: 'ImagesToIndex', module_id: 2200, store: 'image.ImageIndexes', service: 'ImageService', category: 'image' },
			// Vendor category
			{ id: 5, title: this.vendorsToApproveText, name: 'VendorsToApprove', module_id: 1051, store: 'vendor.Vendors', service: 'VendorService', category: 'vendor' },
			{ id: 36, title: this.vcAuthRequestsText, name: 'VcAuthRequests', module_id: 6062, store: 'user.VendorAccessUsers', service: 'VendorConnectService', category: 'vendor' },
			{ id: 13, title: this.expiredInsuranceCertsText, name: 'ExpiredInsuranceCerts', module_id: 1054, store: 'user.VendorAccessUsers', service: 'VendorService', category: 'vendor' },
			// Budget category
			{ id: 11, title: this.mtdOverBudgetCategoriesText, name: 'MtdOverBudgetCategories', module_id: 1054, store: 'budget.Budgets', service: 'BudgetService', category: 'budget' },
			{ id: 12, title: this.ytdOverBudgetCategoriesText, name: 'YtdOverBudgetCategories', module_id: 2070, store: 'budget.Budgets', service: 'BudgetService', category: 'budget' }
		];

		// Now we loop over the simple array to create the bigger record with the config field
		Ext.each(stats, function(stat) {
			that.data.push({
				id       : stat.id,
				title    : stat.title,
				name     : stat.name,
				store    : stat.store,
				service  : stat.service,
				module_id: stat.module_id,
				category : stat.category,
				config   : [{					// For now, the config consists of a simple canvas with one tile for the summary stat grid
					flex: 1,
					cols: [{
						flex : 1,
						tiles: [{ className: stat.name }]
					}]
				}]
			}); 
		});

		this.callParent(arguments);
	}
});
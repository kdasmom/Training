/**
 * Store for Summary Stats. This is a static store, it does not use an Ajax proxy. Additional summary stats
 * should be added here to be used by other parts of the app.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.SummaryStats', {
	extend: 'Ext.data.Store',
	
	requires: ['NP.lib.core.Translator'],

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

	constructor: function() {
		var me = this;

		me.data = [];

		me.addEvents('statsloaded');

		// First we define a basic array of stats to loop over
		var stats = [
			// PO category
			{ id: 3, title: 'Purchase Orders To Approve', name: 'PosToApprove', module_id: 1055, store: 'po.Purcasheorders', service: 'PoService', category: 'po' },
			{ id: 29, title: 'Approved Purchase Orders for Review', name: 'PosReleased', module_id: 6039, store: 'po.Purcasheorders', service: 'PoService', category: 'po' },
			{ id: 9, title: 'My Purchase Orders', name: 'PosByUser', module_id: 2050, store: 'po.Purcasheorders', service: 'PoService', category: 'po' },
			{ id: 26, title: 'Rejected Purchase Orders', name: 'PosRejected', module_id: 6035, store: 'po.Purcasheorders', service: 'PoService', category: 'po' },
			{ id: 27, title: 'Receipts To Approve', name: 'ReceiptsToApprove', module_id: 6026, store: 'po.Receipts', service: 'ReceiptService', category: 'po' },
			{ id: 28, title: 'Rejected Receipts', name: 'ReceiptsRejected', module_id: 6028, store: 'po.Receipts', service: 'ReceiptService', category: 'po' },
			{ id: 34, title: 'Receipts Pending Post Approval', name: 'ReceiptsPendingPost', module_id: 6059, store: 'po.Receipts', service: 'ReceiptService', category: 'po' },
			// Invoice category
			{ id: 4, title: 'Invoices to Approve', name: 'InvoicesToApprove', module_id: 1053, store: 'invoice.Invoices', service: 'InvoiceService', category: 'invoice' },
			{ id: 31, title: 'Invoices on Hold', name: 'InvoicesOnHold', module_id: 6052, store: 'invoice.Invoices', service: 'InvoiceService', category: 'invoice' },
			{ id: 6, title: 'Completed Invoices to Approve', name: 'InvoicesCompleted', module_id: 2004, store: 'invoice.Invoices', service: 'InvoiceService', category: 'invoice' },
			{ id: 23, title: 'Rejected Invoices', name: 'InvoicesRejected', module_id: 6036, store: 'invoice.Invoices', service: 'InvoiceService', category: 'invoice' },
			{ id: 10, title: 'My Invoices', name: 'InvoicesByUser', module_id: 2060, store: 'invoice.Invoices', service: 'InvoiceService', category: 'invoice' },
			// Image category
			{ id: 7, title: 'Images to Convert to Invoice', name: 'ImagesToConvert', module_id: 1050, store: 'image.ImageIndexes', service: 'ImageService', category: 'image' },
			{ id: 8, title: 'Image Invoices to be Processed', name: 'ImagesToProcess', module_id: 2040, store: 'image.ImageIndexes', service: 'ImageService', category: 'image' },
			{ id: 30, title: 'Image Exceptions', name: 'ImageExceptions', module_id: 6050, store: 'image.ImageIndexes', service: 'ImageService', category: 'image' },
			{ id: 24, title: 'Images to be Indexed', name: 'ImagesToIndex', module_id: 2200, store: 'image.ImageIndexes', service: 'ImageService', category: 'image' },
			// Vendor category
			{ id: 5, title: 'Vendors to Approve', name: 'VendorsToApprove', module_id: 1051, store: 'vendor.Vendors', service: 'VendorService', category: 'vendor' },
			{ id: 36, title: 'VendorConnect Authorization Request', name: 'VcAuthRequests', module_id: 6062, store: 'user.VendorAccessUsers', service: 'VendorConnectService', category: 'vendor' },
			{ id: 13, title: 'Expired Insurance Certificates', name: 'ExpiredInsuranceCerts', module_id: 1054, store: 'user.VendorAccessUsers', service: 'VendorService', category: 'vendor' },
			// Budget category
			{ id: 11, title: 'Month-to-Date Over Budget Categories', name: 'MtdOverBudgetCategories', module_id: 1054, store: 'budget.Budgets', service: 'BudgetService', category: 'budget' },
			{ id: 12, title: 'Year-to-Date Over Budget Categories', name: 'YtdOverBudgetCategories', module_id: 2070, store: 'budget.Budgets', service: 'BudgetService', category: 'budget' }
		];

		// Now we loop over the simple array to create the bigger record with the config field
		Ext.each(stats, function(stat) {
			me.data.push({
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

		me.callParent(arguments);

		// We need the locale to be loaded before we can run this because we need to localize the text
		NP.Translator.on('localeloaded', function() {
			var recs = me.getRange();
			for (var i=0; i<recs.length; i++) {
				recs[i].set('title', NP.Translator.translate(recs[i].get('title')));
				recs[i].set('category', NP.Translator.translate(recs[i].get('category')));
			}

			me.fireEvent('statsloaded');
		});
	}
});
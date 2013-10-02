/**
 * Store for Summary Stat Categories. This is a static store, it does not use an Ajax proxy. Additional summary stats
 *  categoriesshould be added here to be used by other parts of the app.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.SummaryStatCategories', {
	extend: 'Ext.data.Store',
	
	fields: ['title','name'],
	
	invoicesCatText: 'Invoice',
	posCatText     : 'Purchase Orders',
	imagesCatText  : 'Image',
	vendorsCatText : 'Vendor',
	budgetsCatText : 'Budget',

	constructor: function() {
		var that = this;

		this.data = [
			{ name: 'po', title: this.posCatText },
			{ name: 'invoice', title: this.invoicesCatText },
			{ name: 'image', title: this.imagesCatText },
			{ name: 'vendor', title: this.vendorsCatText },
			{ name: 'budget', title: this.budgetsCatText }
		];

		this.callParent(arguments);
	}
});
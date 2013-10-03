/**
 * @author Baranov A.V.
 * @date 10/2/13
 */


Ext.define('NP.view.vendor.VendorsManager', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.vendor.vendorsmanager',
	requires: [
		'NP.lib.core.Security',
		'NP.view.vendor.VendorGrid',
		'NP.store.vendor.Vendors'
	],

	layout: {
		type: 'vbox',
			align: 'stretch'
	},
	//  for localization
	titleText: 'Vendor Manager',

	/**
	 * Init
	 */
	initComponent: function(){

		this.title = this.titleText;

		this.items = [
			{
				xtype: 'tabpanel',

				flex: 1,

				defaults :{
					autoScroll: true,
					border: false
				},

				items: this.getGridConfigs()
			}
		];

		this.callParent(arguments);
	},

	getGridConfigs: function() {
		var gridConfigs		= [],					// This will store the configs for the different grids
			baseCols		= [
				'vendor.gridcol.DateSubmitted',
				'vendor.gridcol.VendorName',
				'vendor.gridcol.SubmittedBy',
				'vendor.gridcol.ApprovalType',
				'vendor.gridcol.VendorStatus'
			],
			rejectedCols	= baseCols.slice(0),
			pendingCols		= baseCols.slice(0),
			approvedCols	= baseCols.slice(0),
			grids         = [];

		grids.push(
			{
				title: 'Pending',
				cols : pendingCols
			},
			{
				title: 'Approved',
				cols : approvedCols
			},
			{
				title: 'Rejected',
				cols : rejectedCols
			}
		);

		// Loop throw grid names to create the configs
		Ext.each(grids, function(grid) {
			var tab = grid.tab || grid.title;
			// Add config to the main array
			gridConfigs.push({
				xtype   : 'vendor.vendorgrid',
				itemId  : 'vendor_grid_' + tab.toLowerCase(),
				title   : grid.title,
				cols    : grid.cols,
				stateful: true,
				stateId : 'vendor_grid_' + tab,
				paging  : true,
				store   : Ext.create('NP.store.vendor.Vendors', {
					service    : 'VendorService',
					action     : 'findByStatus',
					paging     : true,
					extraParams: {
						status : tab
					}
				})
			});
		});

		return gridConfigs;
	}
});
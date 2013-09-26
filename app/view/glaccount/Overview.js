/**
 * GL Account Setup > Overview section
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.glaccount.Overview', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.glaccount.overview',

    title: 'Overview',

    margin: 8,

    html: "<p>This area is for managing the updates and additions to GL Accounts, GL Categories, GL Associations and distributing GL Codes to vendors.  The initial list of GL Accounts and Categories in NexusPayables is set up during system implementation to ensure that the budget and actual numbers for the appropriate set of GL Accounts are transferred from the backend accounting package.  Before NexusPayables can track a new GL Account, remember to add the GL Account to NexusPayables and assign the account to the appropriate GL Category.  </p>"
    		+"<p>Recommended steps to follow in setting up a new GL Account:</p>"
		+"<p>1.	Click on Accounts and set up a new GL Account.  Remember to set up all required information.</p>"
		+"<p>2.	Click on Associations to associate the new GL Account with a GL Category.  If the GL Category association doesn't exist, click on Categories and add a new Category for the new GL Account to be associated to.</p>"
		+"<p>3.	If you restrict GL Accounts by property, click on Distribution to automatically assign the new GL Account for use by All Properties and All Vendors.  I<em>f the GL Account is not to be distributed across all Properties and Vendors, remember you must go into each Property and each vendor individually to allocate this GL Account for usage before it can be used in the system.</em>",

	
    initComponent: function() {
	    this.callParent(arguments);
    }
});
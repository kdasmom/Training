/**
 * GL Account Setup section
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.glaccount.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.glaccount.main',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
    	'NP.view.glaccount.Overview',
    	'NP.view.glaccount.GL Accounts',
    	'NP.view.glaccount.Category',
    	'NP.view.glaccount.Reports'
    ],

    title: 'GL Account Setup',
    
    initComponent: function() {
    	this.items = [
    		{
	    		xtype: 'glaccount.overview'
	    	},{
	    		xtype: 'glaccount.glaccounts'
	    	},{
	    		xtype: 'glaccount.category'
	    	},{
                        xtype: 'glaccount.reports'
                }
    	];

    	this.callParent(arguments);
    }
});
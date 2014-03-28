/**
 * GL Account Setup section
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.gl.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.gl.main',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
    	'NP.view.gl.Overview',
    	'NP.view.gl.GLAccounts',
    	'NP.view.gl.Category',
    	'NP.view.gl.Reports'
    ],

    title: 'GL Account Setup',
    
    initComponent: function() {
    	this.items = [
            { xtype: 'gl.glaccounts' },
            { xtype: 'gl.category' },
            { xtype: 'gl.reports' },
			{ xtype: 'gl.overview' }
    	];

    	this.callParent(arguments);
    }
});
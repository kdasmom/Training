/**
 * Import/Export Utility section
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.import.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.import.main',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
    	'NP.view.import.Overview',
    	'NP.view.import.GL',
    	'NP.view.import.Property',
    	'NP.view.import.Vendor',
    	'NP.view.import.Invoice',
    	'NP.view.import.User',
    	'NP.view.import.CustomField',
    	'NP.view.import.Splits'
    ],

    title: 'Import/Export Utility',
    
    items: [
        { xtype: 'import.overview' },
        { xtype: 'import.gl' },
        { xtype: 'import.property' },
        { xtype: 'import.vendor' },
        { xtype: 'import.invoice' },
        { xtype: 'import.user' },
        { xtype: 'import.customfield' },
        { xtype: 'import.splits' }
    ]
});
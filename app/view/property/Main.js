/**
 * PropertySetup section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.Main', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.property.main',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
    	'NP.view.property.Overview',
    	'NP.view.property.Properties',
    	'NP.view.property.Calendar',
    	'NP.view.property.IntegrationPackage',
    	'NP.view.property.Region',
    	'NP.view.property.Reports'
    ],

    title: 'Property Setup',
    
    initComponent: function() {
    	this.items = [
    		{
	    		xtype: 'property.overview'
	    	},{
	    		xtype: 'property.properties'
	    	},{
	    		xtype: 'property.calendar'
	    	},{
                xtype: 'property.integrationpackage'
            },{
                xtype: 'property.region'
            },{
                xtype: 'property.reports'
            }
    	];

    	this.callParent(arguments);
    }
});
/**
 * Property Setup > Master Closing Calendar section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.Calendar', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.property.calendar',
    
    requires: [
    	'NP.view.property.FiscalCalendarGrid',
    	'NP.view.property.FiscalCalendarForm',
    	'NP.view.property.ClosingCalendarDistibutor',
    	'NP.view.shared.button.New'
    ],

    title: 'Master Closing Calendar',

    addCalendarBtnText: 'Add Closing Calendar',

    layout: {
		type: 'hbox',
		align: 'stretch'
	},

    initComponent: function() {
    	var bar = [
    		{ xtype: 'shared.button.new', text: this.addCalendarBtnText }
		];
    	this.tbar = bar;
    	this.bbar = bar;

    	this.items = [
			{
				xtype : 'property.fiscalcalendargrid',
				border: false,
				store : Ext.create('NP.store.property.FiscalCals', {
					service    : 'PropertyService',
					action     : 'getMasterFiscalCalendars',
					autoLoad   : true
				}),
				flex  : 1
	    	},{
				xtype      : 'property.fiscalcalendarform',
				flex       : 1,
				hideDistributor : false
	    	},
			{
				xtype		: 'property.closingcalendardistibutor',
				flex		: 1
			}
		];

    	this.callParent(arguments);
    }
});
/**
 * Vertical tab in Property Setup > Properties > Add/Edit form > Closing Calendars tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.PropertiesFormCal', {
    extend: 'Ext.container.Container',
    alias: 'widget.property.propertiesformcal',
    
    requires: [
    	'NP.view.property.FiscalCalendarGrid',
    	'NP.view.property.FiscalCalendarForm',
    	'NP.view.shared.button.Cancel',
    	'NP.view.shared.button.Save'
    ],

    title: 'Fsical Calendars',

    layout: {
		type : 'vbox',
		align: 'stretch'
    },

    initComponent: function() {
    	var months = [];
    	var pos = -1;
    	for (var i=1; i<=12; i++) {
    		if (i == 1 || i == 7) {
    			months.push({ xtype: 'container', columnWidth: 0.5, items: [] });
    			pos++;
    		}
    		var dt = new Date(i + '/1/2000');
    		months[pos].items.push({
				xtype      : 'numberfield',
				name       : 'fiscalcalmonth_cutoff_' + i,
				fieldLabel : Ext.Date.format(dt, 'M'),
				width      : 150,
				maxLength  : 2,
				disabled   : true,
				allowBlank : false,
				hideTrigger: true
    		});
    	}

    	this.items = [{
    		xtype: 'fieldcontainer',
    		fieldLabel: 'Select a Closing Calendar to Add',
    		labelAlign: 'top',
    		layout: 'column',
    		items: [
    			{
					xtype                : 'customcombo',
					name                 : 'add_fiscalcal_id',
					width                : 250,
					hideLabel            : true,
					displayField         : 'fiscalcal_name',
					valueField           : 'fiscalcal_id',
					loadStoreOnFirstQuery: true,
					store                : Ext.create('NP.store.property.FiscalCals', {
												service    : 'PropertyService',
												action     : 'getUnusedFiscalCalendars',
												property_id: null
											})
    			},{
					xtype : 'button',
					itemId: 'addFiscalCalBtn',
					text  : 'Add',
					margin: '0 0 0 5'
    			}
    		]
    	},{
			xtype : 'container',
			flex  : 1,
			layout: {
				type: 'hbox',
				align: 'stretch'
			},
			items : [
    			{
					xtype: 'property.fiscalcalendargrid',
					store: Ext.create('NP.store.property.FiscalCals', {
						service    : 'PropertyService',
						action     : 'getPropertyFiscalCalendars'
					}),
					flex: 1
		    	},{
					xtype: 'property.fiscalcalendarform',
					flex : 1
		    	}
    		]
    	}];

    	this.callParent(arguments);
    }
});
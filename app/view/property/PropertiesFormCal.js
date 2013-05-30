/**
 * Vertical tab in Property Setup > Properties > Add/Edit form 
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.PropertiesFormCal', {
    extend: 'Ext.container.Container',
    alias: 'widget.property.propertiesformcal',
    
    requires: ['NP.view.property.FiscalCalendarGrid'],

    title: 'Closing Calendars',

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
				width      : 50,
				minLength  : 2,
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
					xtype         : 'combo',
					name          : 'add_fiscalcal_id',
					width         : 250,
					hideLabel     : true,
					forceSelection: true,
					store         : Ext.create('NP.store.property.FiscalCals', {
										service    : 'PropertyService',
										action     : 'getUnusedFiscalCalendars',
										property_id: null
									}),
					displayField  : 'fiscalcal_name',
					valueField    : 'fiscalcal_id'
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
					store: Ext.create('NP.store.property.FiscalCals'),
					flex: 1
		    	},{
					xtype      : 'panel',
					itemId     : 'cutoffPanel',
					title      : 'Monthly Cutoffs',
					layout     : 'column',
					bodyPadding: 8,
					margin     : '0 0 0 8',
					flex       : 1,
					items      : months,
					hidden     : true,
					buttons    : [
						{ xtype: 'button', text: 'Save' },
						{ xtype: 'button', text: 'Cancel' }
					],
					buttonAlign: 'center'
		    	}
    		]
    	}];

    	this.callParent(arguments);
    }
});
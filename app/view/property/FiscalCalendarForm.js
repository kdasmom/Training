/**
 * Vertical tab in Property Setup > Properties > Add/Edit form > Closing Calendars tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.FiscalCalendarForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.property.fiscalcalendarform',
    
    requires: [
    	'NP.view.property.FiscalCalendarGrid',
        'NP.lib.ui.ComboBox',
    	'NP.view.shared.button.Cancel',
    	'NP.view.shared.button.Save',
    	'NP.view.shared.button.CreateFrom'
    ],

    title      : 'Monthly Cutoffs',

    layout     : 'form',
	bodyPadding: 8,
	margin     : '0 0 0 8',
	hidden     : true,
	
    initComponent: function() {
        this.tbar = {
            dock  : 'top',
            items : [
                { xtype: 'shared.button.save' },
                { xtype: 'shared.button.cancel' },
				{
					xtype: 'shared.button.createfrom',
					text: 'Calendar Distributor',
					hidden: this.hideDistributor
				}
            ]
        };

        var now = new Date();
        var fiscalYears = [];
        for (var year = now.getFullYear()+2; year >=2001; year--) {
            fiscalYears.push({ year: year });
        }

    	this.items = [
            {
                xtype     : 'textfield',
                fieldLabel: 'Calendar Name',
                name      : 'fiscalcal_name',
                allowBlank: false
            },{
                xtype       : 'customcombo',
                fieldLabel  : 'Calendar Year',
                name        : 'fiscalcal_year',
                store       : Ext.create('Ext.data.Store', {
                                fields: [{ name: 'year', type: 'int' }],
                                data  : fiscalYears
                            }),
                displayField: 'year',
                valueField  : 'year',
                allowBlank  : false,
                disabled    : true
            },{
                xtype : 'container',
                layout: 'column',
                items : []
            }
        ];

    	var pos = -1;
    	for (var i=1; i<=12; i++) {
    		if (i == 1 || i == 7) {
    			this.items[2].items.push({ xtype: 'container', columnWidth: 0.5, items: [] });
    			pos++;
    		}
    		var dt = new Date(i + '/1/2000');
    		this.items[2].items[pos].items.push({
				xtype      : 'numberfield',
				name       : 'fiscalcalmonth_cutoff_' + i,
				fieldLabel : Ext.Date.format(dt, 'M'),
				width      : 150,
				maxLength  : 2,
				disabled   : true,
				allowBlank : false,
				hideTrigger: true,
				decimalPrecision: 0
    		});
    	}

    	this.callParent(arguments);
    }
});
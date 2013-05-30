/**
 * Fiscal Calendar grid; needs to be supplied a store in the configuration
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.FiscalCalendarGrid', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.property.fiscalcalendargrid',
    
    requires: ['NP.store.property.FiscalCals'],

    emptyText     : 'No fiscal calendars found',
    nameColumnText: 'Name',
    yearColumnText: 'Year',

    initComponent: function() {
        this.columns = [
			{ text: this.nameColumnText, dataIndex: 'fiscalcal_name', flex: 9 },
			{ text: this.yearColumnText, dataIndex: 'fiscalcal_year', flex: 1 }
		];

    	this.callParent(arguments);
    }
});
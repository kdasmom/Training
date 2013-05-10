/**
 * My Settings: Email Notification : Email Frequency tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.EmailFrequency', {
    extend: 'Ext.container.Container',
    alias: 'widget.mysettings.emailfrequency',
    
    requires: ['NP.lib.core.Config'],

    title: 'Email Frequency',

    layout: 'column',
    border: false,

    initComponent: function() {
    	var timezone = NP.Config.getTimezoneAbr();

    	this.items = [];
    	for (var i=0; i<24; i++) {
    		if (i % 6 == 0) {
    			this.items.push({ xtype: 'container', columnWidth: 0.25, items: [] });
    		}
    		var pos = this.items.length - 1;
    		var hour = (i == 0) ? 12 : (i <= 12) ? i : i - 12;
    		hour = hour + '';
    		if (hour.length == 1) {
    			hour = '0' + hour;
    		}
    		var amPm = (i < 12) ? 'AM' : 'PM';
    		this.items[pos].items.push({
    			xtype: 'checkbox',
    			itemId: 'emailalert_hours_' + i,
    			name: 'emailalert_hours',
    			boxLabel: hour + ':00 ' + amPm + ' ' + timezone,
    			inputValue: i
    		});
    	}

    	this.callParent(arguments);
    }
});
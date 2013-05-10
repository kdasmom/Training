/**
 * My Settings: Email Notification : Status Alerts tab
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.mySettings.EmailAlerts', {
    extend: 'Ext.container.Container',
    alias: 'widget.mysettings.emailalerts',
    
    layout: 'vbox',
    autoScroll: true,

    initComponent: function() {
        var that = this;

        // Get the store and query the appropriate records
        var store = Ext.getStore('notification.EmailAlertTypes');
        var types = store.query('emailalerttype_function', this.emailalerttype_function);
        
        // Build generic store for the days drop-down that shows options from 1 to 15
        var daysData = [];
        for (var i=1; i<=15; i++) {
            daysData.push({ days: i });
        }
        var dayStore = Ext.create('Ext.data.Store', {
            fields: ['days'],
            data  : daysData
        });

        // Loop through the alerts to add checkboxes to the container
        this.items = [];
        types.each(function(alertType) {
            // Check if user has permission to use this notification
            var showNotification = true;
            var emailalerttype_module_id_list = alertType.get('emailalerttype_module_id_list').split(',');
            Ext.Array.each(emailalerttype_module_id_list, function(module_id) {
                if (!that.permissions[module_id]) {
                    showNotification = false;
                    return false;
                }
            });

            // If user has permission, display the notification checkbox
            if (showNotification) {
                var itemCfg = {
                    xtype: 'container',
                    layout: 'column',
                    width: 600,
                    height: 22,
                    margin: '0 0 2 0',
                    items: [
                        {
                            xtype      : 'checkbox',
                            boxLabel   : alertType.get('emailalerttype_name'),
                            itemId     : 'emailalerttype_id_alt_' + alertType.get('emailalerttype_id_alt'),
                            name       : 'emailalerttype_id_alt',
                            inputValue : alertType.get('emailalerttype_id_alt'),
                            columnWidth: 1
                        }
                    ]
                };
                if (alertType.get('emailalerttype_showdays') == 1) {
                    itemCfg.items.push(
                        {
                            border: false,
                            html: 'for',
                            width: 20
                        },{
                            xtype: 'combo',
                            itemId: 'emailalert_days_pending_' + alertType.get('emailalerttype_id_alt'),
                            name: 'emailalert_days_pending_' + alertType.get('emailalerttype_id_alt'),
                            store: dayStore,
                            displayField: 'days',
                            valueField: 'days',
                            forceSelection: true,
                            editable: false,
                            width: 60,
                            value: 1
                        },{
                            margin: '0 0 0 3',
                            border: false,
                            html: 'or more days',
                            width: 100
                        }
                    );
                }

                that.items.push(itemCfg);
            }
        });

        this.callParent(arguments);
    }
});
/**
 * The invoice/PO template scheduling window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.ScheduleWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.shared.invoicepo.schedulewindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
        'NP.lib.ui.BoundForm',
        'NP.lib.ui.ComboBox',
    	'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.Delete',
        'Ext.form.Panel',
        'Ext.form.field.Time',
        'NP.view.shared.YesNoField'
    ],

    layout     : 'fit',
    width      : 640,
    height     : 420,
    border     : false,
    modal      : true,
    minimizable: false,
    autoScroll : true,

    // Type can be set to invoice or po
    type: null,

    // This needs to be passed into the view (it's the configuration of the boundForm)
    formCfg: null,

    initComponent: function() {
    	var me = this;

        if (!Ext.Array.contains(['invoice','po'], me.type)) {
            throw 'The "type" config is required and must be set to either "invoice" or "po"';
        }

        me.title = NP.Translator.translate('Create Recurring Schedule');

        var routeOptionField = { name: 'schedule_routeoption' };
        if (me.type == 'invoice') {
            Ext.apply(routeOptionField, {
                xtype: 'hiddenfield',
                value: 0
            });
        } else {
            Ext.apply(routeOptionField, {
                xtype     : 'shared.yesnofield',
                fieldLabel: NP.Translator.translate('Do you want this item to automatically submit for approval?'),
                value     : parseInt(NP.Config.getSetting('CP.' + me.type.toUpperCase() + 'DRAFTROUTEOPTIONDEFAULT', '0'))
            });
        }

        var form = {
            xtype      : 'boundform',
            bodyPadding: 8,
            autoScroll : true,
            tbar       : [
                { xtype: 'shared.button.cancel', handler: function() { me.close(); } },
                { itemId: me.type + 'ScheduleSaveBtn', xtype: 'shared.button.save' },
                { itemId: me.type + 'ScheduleDeleteBtn', xtype: 'shared.button.delete', hidden: true }
            ],
            layout     : {
                type : 'vbox',
                align: 'stretch'
            },
            defaults   : { margin: '0 0 8 0' },
            items      : [
                {
                    xtype      : 'panel',
                    title      : NP.Translator.translate('Schedule'),
                    layout     : 'hbox',
                    bodyPadding: 8,
                    defaults   : { labelAlign: 'top', margin: '0 8 0 0' },
                    items      : [
                        {
                            xtype     : 'datefield',
                            name      : 'schedule_start_datetm',
                            fieldLabel: NP.Translator.translate('Start Date'),
                            allowBlank: false,
                            minValue  : new Date()
                        },{
                            xtype     : 'timefield',
                            name      : 'schedule_timestamps',
                            fieldLabel: NP.Translator.translate('Start Time'),
                            increment : 30,
                            allowBlank: false
                        },{
                            xtype     : 'datefield',
                            name      : 'schedule_end_datetm',
                            fieldLabel: NP.Translator.translate('End By'),
                            allowBlank: false,
                            minValue  : new Date()
                        }
                    ]
                },{
                    xtype      : 'panel',
                    title      : NP.Translator.translate('Recurrence Pattern'),
                    layout     : 'vbox',
                    bodyPadding: 8,
                    items      : [
                        {
                            xtype     : 'radiogroup',
                            layout    : 'hbox',
                            itemId    : 'schedule_recurrence_type',
                            listeners : {
                                change: me.onChangeRecurrenceType.bind(me)
                            },
                            defaults  : { name: 'schedule_recurrence_type', padding: '0 8 0 0' },
                            items     : [
                                {
                                    boxLabel  : NP.Translator.translate('Weekly'),
                                    inputValue: 'weekly',
                                    checked   : true
                                },{
                                    boxLabel  : NP.Translator.translate('Monthly'),
                                    inputValue: 'monthly'
                                },{
                                    boxLabel  : NP.Translator.translate('Yearly'),
                                    inputValue: 'yearly'
                                }
                            ]
                        },{
                            xtype : 'container',
                            layout: 'card',
                            itemId: '_scheduleWinCard',
                            items: [
                                {
                                    xtype : 'container',
                                    layout: 'vbox',
                                    items : [
                                        {
                                            xtype : 'container',
                                            layout: 'hbox',
                                            items : [
                                                {
                                                    xtype: 'component',
                                                    html : NP.Translator.translate('Recurrence every')
                                                },{
                                                    xtype         : 'numberfield',
                                                    name          : 'schedule_recurrence_number_week',
                                                    allowDecimals : false,
                                                    autoStripChars: true,
                                                    hideTrigger   : true,
                                                    width         : 40,
                                                    msgTarget     : 'qtip',
                                                    minValue      : 1,
                                                    value         : 1,
                                                    margin        : '0 6 0 6',
                                                    allowBlank    : false
                                                },{
                                                    xtype: 'component',
                                                    html : NP.Translator.translate('week(s) on:')
                                                }
                                            ]
                                        },{
                                            xtype     : 'checkboxgroup',
                                            layout    : 'hbox',
                                            name      : 'schedule_week_days_group',
                                            defaults  : { name: 'schedule_week_days', padding: '0 8 0 0' },
                                            items     : me.getDayCheckboxes(),
                                            allowBlank: false,
                                            msgTarget : 'under',
                                            padding   : '0 0 10 0',
                                            blankText : NP.Translator.translate('You must select at least one day')
                                        }
                                    ]
                                },{
                                    xtype : 'container',
                                    layout: 'hbox',
                                    items : [
                                        {
                                            xtype: 'component',
                                            html : NP.Translator.translate('Day')
                                        },{
                                            xtype         : 'numberfield',
                                            name          : 'schedule_month_day',
                                            allowDecimals : false,
                                            autoStripChars: true,
                                            hideTrigger   : true,
                                            msgTarget     : 'qtip',
                                            width         : 40,
                                            minValue      : 1,
                                            value         : 1,
                                            margin        : '0 6 0 6',
                                            allowBlank    : false
                                        },{
                                            xtype: 'component',
                                            html : NP.Translator.translate('of every')
                                        },{
                                            xtype         : 'numberfield',
                                            name          : 'schedule_recurrence_number_month',
                                            allowDecimals : false,
                                            autoStripChars: true,
                                            hideTrigger   : true,
                                            msgTarget     : 'qtip',
                                            width         : 40,
                                            minValue      : 1,
                                            value         : 1,
                                            margin        : '0 6 0 6',
                                            allowBlank    : false
                                        },{
                                            xtype: 'component',
                                            html : NP.Translator.translate('month(s)')
                                        }
                                    ]
                                },{
                                    xtype : 'container',
                                    layout: 'hbox',
                                    items : [
                                        {
                                            xtype: 'component',
                                            html : NP.Translator.translate('Every')
                                        },{
                                            xtype        : 'customcombo',
                                            name         : 'schedule_month',
                                            width        : 100,
                                            valueField   : 'month',
                                            displayField : 'name',
                                            store        : Ext.getStore('system.Months'),
                                            value        : 1,
                                            margin       : '0 6 0 6',
                                            allowBlank   : false
                                        },{
                                            xtype         : 'numberfield',
                                            name          : 'schedule_day',
                                            allowDecimals : false,
                                            autoStripChars: true,
                                            hideTrigger   : true,
                                            msgTarget     : 'qtip',
                                            width         : 40,
                                            minValue      : 1,
                                            maxValue      : 31,
                                            allowBlank    : false
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },{
                    xtype      : 'panel',
                    title      : NP.Translator.translate('Recurrence Options'),
                    layout     : {
                        type : 'vbox',
                        align: 'stretch'
                    },
                    bodyPadding: 8,
                    defaults   : { labelWidth: 500 },
                    items      : [
                        {
                            xtype     : 'shared.yesnofield',
                            fieldLabel: NP.Translator.translate('Do you want the creator to be alerted via email when the item is created?'),
                            name      : 'schedule_emailoption',
                            value     : parseInt(NP.Config.getSetting('CP.' + me.type.toUpperCase() + 'DRAFTEMAILOPTIONDEFAULT', '1'))
                        },
                        routeOptionField
                    ]
                }
            ]
        };

        Ext.apply(form, me.formCfg);

        me.items = [form];

        me.callParent(arguments);
    },

    getDayCheckboxes: function() {
        var weekDays  = {},
            dayChecks = [],
            day       = new Date(),
            inputVal,
            i;

        for (i=0; i<7; i++) {
            inputVal = day.getDay() + 1;
            weekDays[inputVal] = {
                boxLabel  : Ext.Date.format(day, 'l'),
                inputValue: inputVal
            };
            day = Ext.Date.add(day, Ext.Date.DAY, 1);
        }

        for (i=1; i<=7; i++) {
            dayChecks.push(weekDays[i]);
        }

        return dayChecks;
    },

    onChangeRecurrenceType: function() {
        var me         = this,
            cardLayout = me.down('#_scheduleWinCard').getLayout(),
            selType    = me.down('#schedule_recurrence_type').getValue().schedule_recurrence_type,
            card;

        if (selType == 'weekly') {
            card = 0;
        } else if (selType == 'monthly') {
            card = 1;
        } else if (selType == 'yearly') {
            card = 2;
        }

        cardLayout.setActiveItem(card);
    },

    setRequiredFields: function() {
        var me         = this,
            form       = me.down('form').getForm(),
            cardLayout = me.down('#_scheduleWinCard').getLayout(),
            selType    = me.down('#schedule_recurrence_type').getValue().schedule_recurrence_type,
            types      = ['weekly','monthly','yearly'],
            reqFields  = ['schedule_recurrence_number_week','schedule_week_days_group','schedule_month_day',
                        'schedule_recurrence_number_month','schedule_month','schedule_day'];

        // Loop throuh all potential required fields
        Ext.Array.each(reqFields, function(field, j) {
            // Loop through the possible recurrence types
            Ext.Array.each(types, function(type, i) {
                // If the recurrence type is the one selected, proceed
                if (type == selType) {
                    // Field not required by default
                    var allowBlank = true;
                    
                    // If the field belongs to the recurrence type (there are 2 fields per type),
                    // make it required
                    if (j == (i*2) || j == (i*2+1)) {
                        allowBlank = false;
                    }
                    
                    // Set the field required state
                    form.findField(field).allowBlank = allowBlank;
                    // If the field can be blank, it means it's hidden, so we can clear
                    // the value
                    if (allowBlank) {
                        form.findField(field).setValue(null);
                    }
                }
            });
        });
    },

    isValid: function() {
        var me         = this,
            form       = me.down('boundform'),
            isValid    = true,
            start_date = form.findField('schedule_start_datetm').getValue(),
            end_date   = form.findField('schedule_end_datetm').getValue();

        // Set the fields that should be required given the selected options on the form
        me.setRequiredFields();

        // Basic form validation
        isValid = form.isValid()

        // Custom validation to make sure the end date is greater than the start date
        if (start_date !== null && end_date !== null && end_date <= start_date) {
            form.findField('schedule_end_datetm').markInvalid(NP.Translator.translate('End By date must be later than Start Date'));
            isValid = false;
        }

        return isValid;
    }
});
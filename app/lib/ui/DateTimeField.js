/**
 * Form field that combines date and time
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.ui.DateTimeField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.datetimefield',

    layout: 'hbox',
    dateFieldConfig: {},
    timeFieldConfig: {},
    allowBlank     : true,
    value          : null,

    /**
     * @private
     * Year, month, and day that all times will be normalized into internally.
     */
    initDate: [2008,0,1],

    initComponent: function() {
    	this.isFormField = true;

    	var dateField = {
			xtype: 'datefield',
			name : this.name + '_date'
		};
		Ext.applyIf(dateField, this.dateFieldConfig);
		Ext.applyIf(dateField, {
			margin    : '0 5 0 0',
			allowBlank: this.allowBlank,
			value     : this.value
		});

		var timeField = {
			xtype: 'timefield',
			name : this.name + '_time'
		};
		Ext.applyIf(timeField, this.timeFieldConfig);
		Ext.applyIf(timeField, {
			allowBlank    : this.allowBlank,
			value         : this.value,
			forceSelection: true
		});

    	this.items = [
    		dateField,
    		timeField
    	];

    	this.callParent(arguments);

    	this.dateField = this.down('datefield');
    	this.dateField.isFormField = false;
    	this.timeField = this.down('timefield');
    	this.timeField.isFormField = false;
    },

    getValue: function() {
    	var dt = this.dateField.getValue();
    	var time = this.timeField.getValue();

    	if (dt === null && time !== null) {
    		return time;
    	} else if (dt !== null && time === null) {
    		return date;
    	} else if (dt !== null && time !== null) {
    		return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
    	} else {
    		return null;
    	}
    },

    setValue: function(val) {
    	if (val != null) {
	    	var time = new Date(this.initDate[0], this.initDate[1], this.initDate[2], val.getHours(), val.getMinutes(), 0);
	    	this.dateField.setValue(val);
	    	this.timeField.setValue(time);
	    }
    },

    getName: function() {
    	return this.name;
    },

    markInvalid: function(errors) {
    	this.dateField.markInvalid(errors);
    },

    clearInvalid: function() {
    	this.dateField.clearInvalid();
    	this.timeField.clearInvalid();
    },

    isValid: function() {
    	this.dateField.allowBlank = this.allowBlank;
    	this.timeField.allowBlank = this.allowBlank;

    	return this.dateField.isValid() && this.timeField.isValid();
    },

    validate: function() {
    	this.dateField.allowBlank = this.allowBlank;
    	this.timeField.allowBlank = this.allowBlank;

    	return this.dateField.validate() && this.timeField.validate();
    },

    isDirty: function() {
    	return this.dateField.isDirty() && this.timeField.isDirty();
    },

    getSubmitData: function() {
    	var data = {};
    	data[this.getName()] = this.getSubmitValue()
    	return data;
    },

    getSubmitValue: function() {
        var dateFormat = this.dateField.submitFormat || this.dateField.format;
        var timeFormat = this.timeField.submitFormat || this.timeField.format;
        var value = this.getValue();

        return value ? Ext.Date.format(value, dateFormat) + ' ' + Ext.Date.format(value, timeFormat) : null;
    }
});
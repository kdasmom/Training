// Override the number field setValue() function to make sure decimal precision is forced on the display value
Ext.define('overrides.form.field.Number', {
    override: 'Ext.form.field.Number',

    setValue: function(val) {
        this.callParent(arguments);

        if (this.allowDecimals && this.decimalPrecision && val && val.toFixed) {
        	this.setRawValue(val.toFixed(this.decimalPrecision));
        }
	}
});
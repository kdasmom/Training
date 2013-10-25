// Override the combo box clearValue() function so that the select event gets fired even when you clear the field
Ext.define('overrides.form.field.ComboBox', {
	override: 'Ext.form.field.ComboBox',

	clearValue: function() {
		this.setValue([]);
        this.fireEvent('select', this, [], {});
    }
});
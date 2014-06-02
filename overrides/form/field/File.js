// Provide a default class so that we can have some CSS rules specific to file fields
Ext.define('overrides.form.field.File', {
	override: 'Ext.form.field.File',

	fieldBodyCls: 'x-form-file-field'
});
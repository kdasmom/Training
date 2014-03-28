// Override useNull in data fields
Ext.define('overrides.data.Field', {
	override: 'Ext.data.Field',

	useNull       : true,
	dateReadFormat: 'Y-m-d H:i:s.u',
	defaultValue  : null
});
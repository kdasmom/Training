// Override the default format used by Ext to encode dates
Ext.define('overrides.JSON', {
	override: 'Ext.JSON',

	encodeDate: function(d) {
		return Ext.Date.format(d, '"Y-m-d H:i:s.u"');
	}
});
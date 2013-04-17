/**
 * Definition for URL catalog type implementation
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.catalog.Url', {
    
	getFields: function() {
		return [
			{
				xtype     : 'textfield',
				name      : 'vc_url',
				fieldLabel: 'URL',
				width     : 450
			}
		];
	},

	hasPOSubmit: function() {
		return false;
	}

});
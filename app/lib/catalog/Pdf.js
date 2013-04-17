/**
 * Definition for PDF catalog type implementation
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.catalog.Pdf', {
    
	getFields: function() {
		return [
			{
				xtype     : 'filefield',
				name      : 'catalog_file',
				fieldLabel: 'File',
				width     : 450
			}
		];
	},

	hasPOSubmit: function() {
		return false;
	}

});
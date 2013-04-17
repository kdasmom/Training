/**
 * Definition for Excel catalog type implementation
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.catalog.Excel', {
    
	getFields: function() {
		return [
			{
				xtype     : 'fieldcontainer',
				fieldLabel: 'File',
				items     : [
					{
						xtype     : 'filefield',
						name      : 'catalog_file',
						width     : 450,
						hideLabel : true,
						allowBlank: false
					},
					{
						xtype: 'container',
						html: '<b>Upload Instructions</b>' +
							'<ul>' +
								'<li>The file uploaded must match the upload template exactly as defined</li>' +
								'<li>All items included MUST include either a UNSPSC Code or have a custom Category assigned or the item will not be included in the catalog upload</li>' +
								'<li>Rows 2, 3 and 4 should be deleted before uploading the file</li>' +
								'<li>The file must be a .XLS file type. The file upload is not compatible with .XLSX files at this time</li>' +
							'</ul>'
					}
				]
			}
		];
	},

	hasPOSubmit: function() {
		return true;
	}

});
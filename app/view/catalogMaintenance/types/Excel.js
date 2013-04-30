/**
 * Definition for Excel catalog type implementation
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.types.Excel', {
	extend: 'NP.view.catalogMaintenance.types.AbstractCatalog',

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
						hideLabel : true
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

	getVisibleTabs: function() {
		return ['categories','properties','vendors','posubmission'];
	},

	getView: function(vc) {
		var deferred = Ext.create('Deft.Deferred');

		var store = Ext.create('NP.store.catalog.VcItemCategories', {
			storeId    : 'catalog.VcItemCategories',
			extraParams: { vc_id: vc.get('vc_id') }
		});

		store.load(function() {
			var grid = Ext.create('NP.view.catalogMaintenance.ItemGrid');

			grid.getFilterCombo().on('select', function() {
				loadGrid();
			});

			grid.getCategoryCombo().on('select', function() {
				loadGrid();
			});

			loadGrid();

			function loadGrid() {
				var filterCombo = grid.getFilterCombo();
				var categoryCombo = grid.getCategoryCombo();

				var filterVal = filterCombo.getValue();
				var categoryVal = categoryCombo.getValue();

				if (filterVal == 'category') {
					categoryCombo.show();
				} else {
					categoryCombo.hide();
				}

				if (filterVal != 'category' || categoryVal !== null) {
					grid.addExtraParams({
						vc_id      : vc.get('vc_id'),
						filter_type: filterCombo.getValue(),
						category   : categoryCombo.getValue()
					});
					grid.reloadFirstPage();
				}
			}

			deferred.resolve(grid);
		});

		return deferred;
	}

});
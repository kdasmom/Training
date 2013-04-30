/**
 * Definition for PDF catalog type implementation
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.types.Pdf', {
	extend: 'NP.view.catalogMaintenance.types.AbstractCatalog',
	
	requires: ['NP.lib.core.Config'],

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

	getVisibleTabs: function() {
		return ['categories'];
	},

	getView: function(vc) {
		var deferred = Ext.create('Deft.Deferred');
		var view = Ext.create('Ext.container.Container', {
			layout: 'fit',
			autoEl: {
				tag: 'iframe',
				src: 'clients/' + NP.lib.core.Config.getAppName() + '/web/exim_uploads/catalog/vc_' + vc.get('vc_id') + '.pdf'
			}
		});

		deferred.resolve(view);

		return deferred;
	}

});
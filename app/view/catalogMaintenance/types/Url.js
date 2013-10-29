/**
 * Definition for URL catalog type implementation
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.catalogMaintenance.types.Url', {
    extend: 'NP.view.catalogMaintenance.types.AbstractCatalog',
	
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

	getVisibleTabs: function() {
		return ['categories'];
	},

	getView: function(vc) {
		var view = Ext.create('Ext.container.Container', {
			layout: 'fit',
			autoEl: {
				tag: 'iframe',
				src: vc.get('vc_url')
			}
		});

		return { view: view };
	}

});
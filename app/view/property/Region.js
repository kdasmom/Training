/**
 * Property Setup > Region section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.Region', {
    extend: 'NP.view.shared.PickList',
    alias: 'widget.property.region',
    
    title: NP.Config.getSetting('PN.main.RegionLabel', 'Region'),

    entityType: 'property.Region',

    initComponent: function() {
    	this.grid = Ext.create('NP.lib.ui.Grid', {
    		border  : false,
    		selModel: Ext.create('Ext.selection.CheckboxModel', { checkOnly: true }),
    		columns: [
    			{ text: 'Name', dataIndex: 'region_name', flex: 1 }
    		],
    		store: 'property.Regions',
    		flex: 1
    	});

    	this.form = Ext.create('NP.lib.ui.BoundForm', {
    		bind       : {
    			models: ['property.Region']
    		},
			title      : 'Region',
			layout     : 'form',
			bodyPadding: 8,
			flex       : 1,
			items      : [
    			{
					xtype     : 'textfield',
					fieldLabel: 'Name',
					name      : 'region_name',
					allowBlank: false
    			}
    		]
    	});

    	this.callParent(arguments);
    },

    saveHandler: function(addAnother) {
    	// Overriding the function to update the user's region store as well
		this.callParent(arguments).then({
			success: function(rec) {
				var userRegionStore = Ext.getStore('user.Regions');
				var userRec = userRegionStore.findRecord('region_id', rec.get('region_id'));
				if (userRec !== null) {
					userRec.set('region_name', rec.get('region_name'));
				} else if (rec.get('universal_field_status') != 0) {
					userRegionStore.add(rec.copy());
				}
			}
		});
	}
});
/**
 * A tile picker used to configure a portal
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.PortalTilePicker', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.shared.portaltilepicker',
	
	requires: [
		'NP.lib.core.Security',
		'NP.store.system.SummaryStats',
		'NP.store.system.Tiles'
	],

	enableDragDrop: true,
	hideHeaders   : true,
	columns       : [{ header: 'Name', dataIndex: 'name', flex: 1 }],
	viewConfig    : {
        plugins: {
			ddGroup   : 'tiles',
			ptype     : 'gridviewdragdrop',
			enableDrop: false
        }
    },

    // For localization
    title  : 'Tiles',

    initComponent: function() {
    	// Create a custom store
    	this.store = Ext.create('Ext.data.Store', {
    		fields: [
				{ name: 'name' },
				{ name: 'className' },
				{ name: 'moduleId', type: 'int' }
			],
			sorters: [{
		        property: 'name',
		        direction: 'ASC'
		    }]
    	});

    	// If permissions were specified directly when creating the object, we can populate the store
    	if (this.permissions) {
    		this.updateTiles();
    	}

    	this.callParent(arguments);
    },

    /**
     * Sets the permissions on the picker and updates the store to reflect the tiles that the permissions allow for
     * @param  {Object} permissions An object with module_id values as keys
     */
    setPermissions: function(permissions) {
    	// Save the permissions on the object
    	this.permissions = permissions;
    	// Update the tiles based on those new permissions
    	this.updateTiles();
    },

    /**
     * Updates the store for this grid so that only the tiles that there are permissions for are shown
     */
    updateTiles: function() {
    	var that = this;

    	// Remove all records from the store
    	this.store.removeAll();

    	// Add any custom tiles that there are permissions for
    	var data = [];
		var tiles = Ext.getStore('system.Tiles').getRange();
		Ext.each(tiles, function(tile) {
			// Only add tiles that are within the permissions
			if (tile.get('moduleId') === null || tile.get('moduleId') in that.permissions) {
				data.push({
					name     : tile.get('name'),
					className: tile.get('className'),
					moduleId : tile.get('moduleId')
				});
			}
		});

		this.store.loadData(data);
    }
});
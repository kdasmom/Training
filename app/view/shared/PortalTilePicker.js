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
		'NP.store.system.Tiles'
	],

	title         : 'Tiles',
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

    initComponent: function() {
    	if (!this.permissions) {
    		this.permissions = NP.Security.getPermissions();
    	}

    	this.store = Ext.create('NP.store.system.Tiles', { permissions: this.permissions });

    	this.callParent(arguments);
    }
});
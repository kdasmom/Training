/**
 * An abstract component for a tile component. It defines the API for creating new tiles. Every tile should extend
 * this component or a sub-component of this one.
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.AbstractTile', {
    
    /**
     * @return {String} The name of the tile, which will be shown in the title of the panel
     */
    getName: function() {
        var store     = Ext.getStore('system.Tiles'),
            className = Ext.getClassName(this).split('.').pop(),
            rec       = store.findRecord('className', className);

        return rec.get('name');
    },
    
    /**
     * @return {Object|Ext.Component} A component to be diplayed in the My Settings > Dashboard section to preview the dashboard config; can be a fully initialized component or a definition object with an xtype.
     */
    getPreview: function() {
    	throw 'You must implement the getPreview() function in your tile. It defines what shows in a column when you drop the tile in it.';
    },
    
    /**
     * @return {Object|Ext.Component} A component to display on the dashboard; can be a fully initialized component or a definition object with an xtype.
     */
    getDashboardPanel: function() {
        throw 'You must implement the getDashboardPanel() function in your tile. It defines the tile component that will show on the dashboard';
    },

    /**
     * NOTE: The functionality for configuration panels is not yet implemented.
     * @return {Boolean|Object|Ext.Component} A component representing a configuration panel if your tile has configuration options; can be a fully initialized component or a definition object with an xtype; if your panel has no configuration options, return false.
     */
    getConfigPanel: function() {
    	return false;
    },

    /**
     * @return {NP.view.shared.ContextPicker} Utility function to get the context picker object
     */
    getContextPicker: function() {
        if (!this.contextPicker) {
            this.contextPicker = Ext.ComponentQuery.query('#homeContextPicker')[0];
        }

        return this.contextPicker;
    }
});
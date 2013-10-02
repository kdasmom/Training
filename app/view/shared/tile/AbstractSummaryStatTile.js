/**
 * An abstract component to define a tile for something that is already a summary stat. This allows us to avoid code
 * duplication between this and the code to show the summary stat counts as well as between all the summary stats,
 * which all follow a similar pattern. Any function can be overriden if customization is needed.
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.AbstractSummaryStatTile', {
    extend: 'NP.view.shared.tile.AbstractTile',

    getGrid: function() {
        throw 'You must implement the getGrid() function in your tile. It defines the grid to be used';
    },

    getService: function() {
        throw 'You must implement getService() in your tile if you haven\'t overridden getDashboardStore().';
    },

    getStorePath: function() {
        throw 'You must implement getStorePath() in your tile if you haven\'t overridden getDashboardStore() and getPreviewStore().';
    },

    /**
     * @return {String} The name of the summary stat record in the NP.store.system.SummaryStats store that corresponds to this tile; assumes convention that tile class name matches record name
     */
    getStatName: function() {
        if (!this.statName) {
            this.statName = Ext.getClassName(this).split('.').pop();
        }
        return this.statName;
    },

    /**
     * @return {String} Gets the name of the tile based on the title field of the NP.store.system.SummaryStats store record
     */
    getName: function() {
    	var store = Ext.getStore('system.SummaryStats');
        var rec = store.findRecord('name', this.getStatName());

        return rec.get('title');
    },
    
    /**
     * @return {Object|Ext.Component} Gets a preview tile component or component definition object based on the grid defined by getGrid() and store defined by getPreviewStore()
     */
    getPreview: function() {
        var grid = this.getGrid();
        grid.store = this.getPreviewStore();
        grid.paging = false;

        return grid;
    },

    /**
     * @return {Ext.data.Store} Defines a store with no data based on the store path provided by getStorePath()
     */
    getPreviewStore: function() {
        return Ext.create('NP.store.' + this.getStorePath(), {
                    data: []
                });
    },

    /**
     * @return {Object|Ext.Component} Gets a dashboard tile component or component definition object based on the grid defined by getGrid() and store defined by getDashboardStore()
     */
    getDashboardPanel: function() {
        var that = this;

        var grid = Ext.apply(this.getGrid(), {
            stateful: true,
            stateId : 'dashboard_' + this.getName().replace(' ', '_'),
            store   : this.getDashboardStore()
        });

        grid = Ext.widget(grid);

        grid.reloadFirstPage(); 

        if ( this.hasContextListener() ) {
            grid.mon(this.getContextPicker(), 'change', function(toolbar, filterType, selected) {
                grid.addExtraParams(that.getStoreParams());

                grid.reloadFirstPage(); 
            });
        }

        return grid;
    },

    /**
     * @return {Boolean} Defines whether or not we want to add a listener to the grid returned by getDashboardPanel() that will reload the grid if the context is changed
     */
    hasContextListener: function() {
        return true;
    },

    /**
     * @return {Ext.data.Store} Defines a remote store that pulls data from the server using getService(), getAction(), and getStoreParams() functions
     */
    getDashboardStore: function() {
        return Ext.create('NP.store.' + this.getStorePath(), {
            service: this.getService(),
            action : this.getAction(),
            paging     : true,
            extraParams: this.getStoreParams()
        });
    },

    /**
     * @return {String} Defines the action name assuming by convention it's get$statName()
     */
    getAction: function() {
        return 'get' + this.getStatName();
    },

    /**
     * @return {Object} Defines standard store params including userprofile_id and delegated_to_userprofile_id of the logged in user, as well as countOnly = false
     */
    getStoreParams: function() {
        var state = this.getContextPicker().getState();

        return {
            userprofile_id             : NP.Security.getUser().get('userprofile_id'),
            delegated_to_userprofile_id: NP.Security.getDelegatedToUser().get('userprofile_id'),
            contextType                : state.type,
            contextSelection           : state.selected,
            countOnly                  : false
        };
    }
});
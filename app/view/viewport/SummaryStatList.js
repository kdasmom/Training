/**
 * This container builds the dashboard summary stat list. By default, it splits it into two columns.
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.SummaryStatList', {
    extend: 'Ext.container.Container',
    alias: 'widget.viewport.summarystatlist',

    requires: [
        'NP.lib.core.SummaryStatManager',
        'NP.store.system.SummaryStatCategories'
    ],

    /**
     * @private
     */
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    /**
     * @private
     */
    defaults: { flex: 1, border: false },

    /**
     * @private
     */
    grids: [],
    
    /*stateful: true,
    stateId : 'summarystat_list',*/

    initComponent: function() {
        var that = this;

        this.items = [];

        // Get a list of all the valid summary stats for the current user
        var stats = NP.lib.core.SummaryStatManager.getStats();

        var categories = Ext.create('NP.store.system.SummaryStatCategories').getRange();

        // Loop through categories
        Ext.each(categories, function(cat) {
            // Only proceed if the user has any stats for this category
            if (cat.get('name') in stats) {
                var data = [];
                Ext.each(stats[cat.get('name')], function(stat) {
                    data.push(
                        { title: stat.title, name: stat.name, count: '<img src="resources/images/ajax-loader.gif" border="0" />' }
                    );
                });

                var grid = Ext.create('Ext.grid.Panel', {
                    title      : cat.get('title'),
                    itemId     : cat.get('name') + '_summary_stat_cat_panel',
                    frame      : true,
                    hideHeaders: true,                              // We don't need to show column headers
                    border     : false,
                    margin     : '0 16 0 0',
                    viewConfig : { markDirty: false },              // When updating the count, we don't want a dirty marker
                    store      : Ext.create('Ext.data.Store', {
                                    fields: ['title','name','count'],
                                    data  : data,
                                    proxy : {
                                        type: 'memory',
                                        reader: {
                                            type: 'json'
                                        }
                                    }
                                }),
                    columns   : [
                        { text: 'Name', dataIndex: 'title', flex: 1 },
                        { text: 'Count', dataIndex: 'count' }
                    ],
                    listeners : {
                        itemclick: function(grid, rec, item, index, e) {
                            /**
                             * @event click
                             * Fires Whenever a row is clicked in any of the summary stat grids
                             * @param {Ext.data.Model} rec The record for the summary stat that was clicked
                             */
                            that.fireEvent('click', rec);
                        }
                    }
                });

                // Add grid to the private grid collection
                that.grids.push(grid);

                // Add grid to the container
                that.items.push(grid);
            }
        });

        // Add a custom click event for this component
        this.addEvents('click');
        this.addStateEvents('click');

        // Create the component using the parent initializer
        this.callParent(arguments);
    },

    /**
     * Updates the count for one summary stat
     * @param {String} name  Name of the summary stat whose count we want to update
     * @param {Number} total The value of the count
     */
    updateStatCount: function(name, total) {
        var selection = this.getSelection();
        // Loop through the grids
        for (var i=0; i<this.grids.length; i++) {
            // Find the record that corresponds to the summary stat who's total we want to update
            var rec = this.grids[i].getStore().findRecord('name', name);
            // If the record is found, update the count
            if (rec !== null) {
                rec.set('count', total);
                if (selection == name) {
                    this.select(name);
                }
            }
        }
    },

    /**
     * Selects a summary stat in the grid
     * @param {String} name  Name of the summary stat whose count we want to show selected
     */
    select: function(name) {
        // Loop through all the grids
        for (var i=0; i<this.grids.length; i++) {
            // Deselect any row in the grid that may be selected
            this.grids[i].getSelectionModel().deselectAll();
            // Check the grid store to see if the record we want to select is in this grid
            var recNum = this.grids[i].getStore().find('name', name);
            // If the record is found, select the row in the grid
            if (recNum !== -1) {
                this.grids[i].getSelectionModel().select(recNum);
            }
        }
    },

    /**
     * Returns the name of the summary stat currently selected
     * @return {String} Name of the summary stat selected
     */
    getSelection: function() {
        var selection = null;
        for (var i=0; i<this.grids.length; i++) {
            var rec = this.grids[i].getSelectionModel().getSelection();
            if (rec.length) {
                selection = rec[0].get('name');
                break;
            }
        }
        
        return selection;
    },

    /*getState: function() {
        return { selection: this.getSelection() };
    },

    applyState: function(state) {
        if (state.selection != null) {
            for (var i=0; i<this.grids.length; i++) {
                var store = this.grids[i].getStore();
                var rec = store.findRecord('name', state.selection);
                if (rec != null) {
                    this.fireEvent('click', rec);
                    break;
                }
            }
        }
    }*/
});
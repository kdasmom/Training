/**
 * This container builds the dashboard summary stat list. By default, it splits it into two columns.
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.SummaryStatList', {
    extend: 'Ext.container.Container',
    alias: 'widget.viewport.summarystatlist',

    requires: ['NP.lib.core.SummaryStatManager'],

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
     * This value can be adjusted if we want to have more columns
     * @private
     */
    columns: 2,

    /**
     * @private
     */
    grids: [],

    initComponent: function() {
        var that = this;

        this.items = [];

        // Get a list of all the valid summary stats for the current user
        var stats = NP.lib.core.SummaryStatManager.getStats();

        // Figure out how many stats are going to be shown per column
        var maxStatsPerCol = Math.ceil(stats.length/this.columns);
        var currentCol = -1;

        // Build an array of data per column so we know what data to create in each grid
        var data = [];
        for (var i=0; i<stats.length; i++) {
            if (i == 0 || i % maxStatsPerCol == 0) {
                currentCol++;
                data[currentCol] = [];
            }
            data[currentCol].push(
                { title: stats[i].title, name: stats[i].name, count: '<img src="resources/images/ajax-loader.gif" border="0" />' }
            );
        }
        
        // Loop through each column to create a grid for it
        for (i=0; i<=currentCol; i++) {
            // Build the grid
            var grid = Ext.create('Ext.grid.Panel', {
                hideHeaders: true,                              // We don't need to show column headers
                border     : false,
                margin     : (i<currentCol) ? '0 16 0 0' : 0,   // No need for a right margin for the last column
                viewConfig : { markDirty: false },              // When updating the count, we don't want a dirty marker
                store      : Ext.create('Ext.data.Store', {
                                fields: ['title','name','count'],
                                data  : data[i],
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
                    itemclick: function(grid, rec) {
                        /**
                         * @event click
                         * Fires Whenever a row is clicked in any of the summary stat grids
                         * @param {Ext.data.Model} rec The record for the summary stat that was clicked
                         */
                        that.fireEvent('click', rec);
                    }
                }
            });

            // We need to jump through hoops to manage the selection of the grids because there
            // are two of them but they need to behave as if they were one
            var selectionModel = grid.getSelectionModel();

            // Listen for changes to the grid selection
            selectionModel.addListener('selectionChange', function(selectionModel, selected, eOpts) {
                // Loop through all the grids, suspend the events temporarily, and deselect everything
                for (var j=0; j<that.grids.length; j++) {
                    that.grids[j].getSelectionModel().suspendEvents(false);
                    that.grids[j].getSelectionModel().deselectAll();
                }
                // Re-select the selected record
                selectionModel.select(selected);

                // Loop through grids again and resume events
                for (var j=0; j<that.grids.length; j++) {
                    that.grids[j].getSelectionModel().resumeEvents();
                }
            });

            // Add grid to the private grid collection
            that.grids.push(grid);

            // Add grid to the container
            this.items.push(grid);
        }

        // Add a custom click event for this component
        this.addEvents('click');

        // Create the component using the parent initializer
        this.callParent(arguments);
    },

    updateStatCount: function(name, total) {
        // Loop through the grids
        for (var i=0; i<this.grids.length; i++) {
            // Find the record that corresponds to the summary stat who's total we want to update
            var rec = this.grids[i].getStore().findRecord('name', name);
            // If the record is found, update the count
            if (rec !== null) {
                rec.set('count', total);
            }
        }
    }
});
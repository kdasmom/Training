/**
 * A portal that you can customize with rows and columns
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.PortalCanvas', {
	extend: 'Ext.panel.Panel',
	alias : 'widget.shared.portalcanvas',
	
	requires: [
		'NP.view.shared.button.New',
		'NP.view.shared.PortalRow'
	],

	statics: {
		getBlankCanvas: function() {
			return [{ flex: 1, cols: [{ flex: 1, tiles: [] }] }];
		}
	},

	layout  : { type: 'vbox', align: 'stretch' },
	maxRows : 3,
	viewOnly: false,
	
	initComponent: function() {
		var that = this;

		if (!that.viewOnly) {
			this.tbar = [{ xtype: 'shared.button.new', text: 'Add Row', handler: Ext.bind(this.addRow, this, [true, 1, true]) }];
		}

    	this.callParent(arguments);
    	
    	if (this.buildConfig) {
    		this.buildFromConfig(this.buildConfig);
    	} else {
    		this.buildFromConfig(NP.view.shared.PortalCanvas.getBlankCanvas());
    	}

    	if (!that.viewOnly) {
			this.on('remove', function(canvas, portalPanel) {
				if (portalPanel.getXType() == 'shared.portalrow' && canvas.items.items.length === 1) {
					canvas.items.items[0].down('#removeRowBtn').disable();
				}
			});
		}
    },

	addRow: function(removable, flex, addCol) {
		if (!this.viewOnly && this.items.items.length === 1) {
			this.items.items[0].down('#removeRowBtn').enable();
		}

		var row = this.add({
			xtype    : 'shared.portalrow',
			border   : false,
			flex     : 1,
			removable: removable,
			viewOnly : this.viewOnly
		});

		if (addCol) {
			row.addColumn(false, 1);
		}

		if (!this.viewOnly && this.items.items.length >= this.maxRows) {
			this.down('[xtype="shared.button.new"]').disable();
		}

		return row;
	},

	serialize: function() {
		var serializedObj = [];
		var rows = this.query('[xtype="shared.portalrow"]');
		Ext.each(rows, function(row) {
			serializedObj.push({ flex: row.flex, cols: [] });
			var rowIdx = serializedObj.length - 1;
			var cols = row.query('[xtype="shared.portalcolumn"]');
			Ext.each(cols, function(col) {
				serializedObj[rowIdx].cols.push({ flex: col.flex, tiles: [] });
				var colIdx = serializedObj[rowIdx].cols.length - 1;
				var tiles = col.down('panel').query('> panel');
				Ext.each(tiles, function(tilePanel) {
					serializedObj[rowIdx].cols[colIdx].tiles.push({ flex: 1, className: tilePanel.tileClass });
				});
			});
		});

		return serializedObj;
	},

	buildFromConfig: function(config) {
		var that = this;

		// Suspend layouts before building the canvas since several panels can get added
		Ext.suspendLayouts();
		
		this.clearCanvas();

		// Loop through the rows
		Ext.each(config, function(row) {
			var removable = (config.length > 1) ? true : false;
			// Add a row
			var portalRow = that.addRow(removable, row.flex, false);
			// Loop through the columns
			Ext.each(row.cols, function(col) {
				var removable = (row.cols.length > 1) ? true : false;
				// Add a column
				var portalCol = portalRow.addColumn(removable, col.flex);
				// Loop through the tiles
				Ext.each(col.tiles, function(tile) {
					// Get the appropriate tile object
					var tile = Ext.create('NP.view.shared.tile.' + tile.className);
					// Add a tile
					portalCol.addTile(tile);
				});
			});
		});

		// Flush layout changes
		Ext.resumeLayouts(true);
	},

	clearCanvas: function() {
		this.removeAll();
	}
});
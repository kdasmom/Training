/**
 * A portal that you can customize with rows and columns
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.PortalCanvas', {
	extend: 'Ext.panel.Panel',
	alias : 'widget.shared.portalcanvas',
	
	requires: [
		'NP.lib.core.Security',
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
			flex     : flex,
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

	serialize: function(useJson) {
		useJson = (arguments.length == 1) ? useJson : true;

		var serializedObj = [];
		var hasTile = false;
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
					hasTile = true;
					serializedObj[rowIdx].cols[colIdx].tiles.push({ flex: 1, className: tilePanel.tileClass });
				});
			});
		});

		// If no tiles were defined, we just serialize it to null
		if (useJson) {
			return (hasTile) ? Ext.JSON.encode(serializedObj) : null;
		} else {
			return serializedObj;
		}
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
					if (!that.permissions) {
						throw 'Cannot render canvas because permissions have not been provided';
					}

					// Get the appropriate tile object
					var tileObj = Ext.create('NP.view.shared.tile.' + tile.className);

					// Only add the tile if the user has permissions for it
					var tileRec = Ext.getStore('system.Tiles').findRecord('className', tile.className);
					if (tileRec.get('moduleId') === null || tileRec.get('moduleId') in that.permissions) {
						// Add a tile
						portalCol.addTile(tileObj);
					}
				});
			});
		});

		// Flush layout changes
		Ext.resumeLayouts(true);
	},

	clearCanvas: function() {
		this.removeAll();
	},

	setPermissions: function(permissions) {
		this.permissions = permissions;
	},

	isValid: function() {
		var canvasConfig = this.serialize(false);

		// If the canvas is blank, it's valid
		if (canvasConfig === null) {
			return true;
		}

		var hasBlankCol = false;
		var hasTile = false;
		Ext.each(canvasConfig, function(row) {
			Ext.each(row.cols, function(col) {
				if (!col.tiles.length) {
					hasBlankCol = true;
				} else {
					hasTile = true;
				}
			});
		});

		// If there are tiles and no blank columns, canvas is valid
		// If there are blank columns and no tiles (all blank), canvas is valid
		// Any other combination is invalid
		// (having no tiles and no blank columns means you have no columns)
		// (having tiles and blank columns means you started defining something but didn't finish)
		return ((!hasTile && hasBlankCol) || (hasTile && !hasBlankCol)) ? true : false;
	}
});
/**
 * A row that can be added to a NP.view.shared.PortalCanvas
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.PortalRow', {
	extend: 'NP.view.shared.PortalComponent',
	alias: 'widget.shared.portalrow',
	
	requires: [
		'NP.view.shared.button.New',
		'NP.view.shared.button.Delete',
		'NP.view.shared.PortalColumn'
	],

	layout  : { type: 'hbox', align: 'stretch' },
	border  : false,
	flex    : 1,
	maxCols : 4,
	
	initComponent: function() {
		var that = this;

		if (!that.viewOnly) {
			this.tbar = [
				{
					xtype  : 'shared.button.new',
					text   : 'Add Column',
					handler: Ext.bind(this.addColumn, this, [true, null])
				},
				{
					xtype  : 'shared.button.delete',
					text    : 'Remove Row',
					itemId  : 'removeRowBtn',
					handler : Ext.bind(this.removeRow, this),
					disabled: !this.removable
				}
			];
		}

		this.callParent(arguments);

		if (!that.viewOnly) {
			this.on('remove', function(row, portalPanel) {
				if (portalPanel.getXType() == 'shared.portalcolumn' && row.items.items.length === 1) {
					row.items.items[0].down('#removeColBtn').disable();
				}
			});
		}
	},

	addColumn: function(removable, flex) {
		if (!this.viewOnly && this.items.items.length === 1) {
			this.items.items[0].down('#removeColBtn').enable();
		}

		// Suspend layouts because we may have multiple updates to take care of
		Ext.suspendLayouts();

		// Add the column to the panel
		var col = this.add({
			xtype    : 'shared.portalcolumn',
			flex     : (flex === null) ? 1 : flex,
			removable: removable,
			viewOnly : this.viewOnly
		});

		// If no flex was provided (happens when add button was clicked), run changeSize()
		if (flex === null) {
			// We pass changeSize() a specific ratio and it'll take care of making sure we don't
			// make any panel smaller than our minimum sizes allow
			col.changeSize('plus', 1 / this.items.items.length);
		}

		if (!this.viewOnly && this.items.items.length >= this.maxCols) {
			this.down('[xtype="shared.button.new"]').disable();
		}

		Ext.resumeLayouts(true);

		return col;
	},

	removeRow: function() {
		var canvas = this.ownerCt;
		canvas.remove(this);

		this.adjustRatios(canvas);

		if (!this.viewOnly && canvas.items.items.length < canvas.maxRows) {
			canvas.down('[xtype="shared.button.new"]').enable();
		}
	}
});
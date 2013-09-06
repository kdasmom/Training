/**
 * A column that can be added to a NP.view.shared.PortalRow
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.PortalColumn', {
	extend: 'NP.view.shared.PortalComponent',
	alias: 'widget.shared.portalcolumn',

	requires: [
		'NP.view.shared.button.Delete'
	],

	layout     : 'fit',
	bodyPadding: 4,
	border     : false,
	
	initComponent: function() {
		var that = this;

		if (!that.viewOnly) {
			this.tbar = [
				{
					xtype   : 'shared.button.delete',
					text    : 'Remove Column',
					itemId  : 'removeColBtn',
					handler : Ext.bind(this.removeColumn, this),
					disabled: !this.removable
				}
			];
		}

		var mainPanel = {
			xtype    : 'panel',
			layout   : {
				type : 'vbox',
				align: 'stretch'
			},
			bodyStyle: {
				border      : '2px dashed #99BBE8',
				borderRadius: '4px'
			}
		};

		if (!that.viewOnly) {
			mainPanel.listeners = {
				render: function(colPanel) {
					colPanel._dropTarget = Ext.create('Ext.dd.DropTarget', colPanel.body.dom, {
				        ddGroup: 'tiles',
				        notifyEnter: function(ddSource, e, data) {
				        	// Add some flare to invite drop.
				        	colPanel.body.stopAnimation();
				            colPanel.body.highlight();
				        },
				        notifyDrop : function(ddSource, e, data){
				            // Reference the record (single selection) for readability
				            var tileRec = ddSource.dragData.records[0];

				            var tile = Ext.create('NP.view.shared.tile.' + tileRec.get('className'));

				            that.addTile(tile);

				            return true;
				        }
				    });
				},
				beforedestroy: function(colPanel) {
					colPanel._dropTarget.destroy();
					colPanel._dropTarget = null;
				}
			}
		}

		this.items = [mainPanel];

		this.callParent(arguments);
	},

	removeColumn: function() {
		var row = this.ownerCt;
		row.remove(this);

		if (!this.viewOnly && row.items.items.length < row.maxCols) {
			row.down('[xtype="shared.button.new"]').enable();
		}
	},

	addTile: function(tile) {
		var me = this,
			colPanel = me.down('panel'),
			className,
			tilePanel,
			containerPanel;

		Ext.suspendLayouts();

		colPanel.setBodyStyle({
        	borderWidth: '0'
        });

        className = Ext.getClassName(tile).split('.').pop();
        tilePanel = (me.viewOnly) ? tile.getDashboardPanel() : tile.getPreview();

        containerPanel = {
			xtype    : 'panel',
			title    : tile.getName(),
			tileClass: className,
			margin   : 4,
			frame    : true,
			closable : !me.viewOnly,
			layout   : 'fit',
			flex     : 1,
			items    : [tilePanel]
        };

        if (me.viewOnly) {
        	containerPanel.tools = [
	        	{
					type   : 'maximize',
					handler: Ext.bind(me.onMaximizeTile, me)
	        	},{
					type   : 'minimize',
					disabled: true,
					handler: Ext.bind(me.onMinimizeTile, me)
	        	}
        	];
        }

        var tileContainer = colPanel.add(containerPanel);

        Ext.resumeLayouts(true);

        if (!me.viewOnly) {
	        tileContainer.on('close', function() {
	        	if (colPanel.items.items.length === 1) {
		        	colPanel.setBodyStyle({
						border      : '2px dashed #99BBE8',
						borderRadius: '4px'
		            });
		        }
	        });
	    }
	},

	onMaximizeTile: function(evt, toolEl, owner, tool) {
		var me = this;

		var rows = Ext.ComponentQuery.query('[xtype="shared.portalrow"]');

		me._hiddenItems = [];
		
		Ext.suspendLayouts();

		Ext.each(rows, function(row) {
			if (owner.up('[xtype="shared.portalrow"]').getId() != row.getId()) {
				row.hide();
				me._hiddenItems.push(row);
			} else {
				var cols = row.query('[xtype="shared.portalcolumn"]');
				Ext.each(cols, function(col) {
					if (owner.up('[xtype="shared.portalcolumn"]').getId() != col.getId()) {
						col.hide();
						me._hiddenItems.push(col);
					}
				});
			}
		});
		tool.disable();
		owner.down('tool[type="minimize"]').enable();
		Ext.resumeLayouts(true);
	},

	onMinimizeTile: function(evt, toolEl, owner, tool) {
		var me = this;

		Ext.suspendLayouts();
		Ext.each(me._hiddenItems, function(hiddenItem) {
			hiddenItem.show();
		});
		tool.disable();
		owner.down('tool[type="maximize"]').enable();
		Ext.resumeLayouts(true);

		me._hiddenItems = null;
	}
});
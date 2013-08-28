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
					Ext.create('Ext.dd.DropTarget', colPanel.body.dom, {
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
		var colPanel = this.down('panel');

		Ext.suspendLayouts();

		colPanel.setBodyStyle({
        	borderWidth: '0'
        });

        var className = Ext.getClassName(tile).split('.').pop();
        var tilePanel = (this.viewOnly) ? tile.getDashboardPanel() : tile.getPreview();

        var tileContainer = colPanel.add({
			xtype    : 'panel',
			title    : tile.getName(),
			tileClass: className,
			margin   : 4,
			frame    : true,
			closable : !this.viewOnly,
			layout   : 'fit',
			flex     : 1,
			items    : [tilePanel]
        });

        Ext.resumeLayouts(true);

        if (!this.viewOnly) {
	        tileContainer.on('close', function() {
	        	if (colPanel.items.items.length === 1) {
		        	colPanel.setBodyStyle({
						border      : '2px dashed #99BBE8',
						borderRadius: '4px'
		            });
		        }
	        });
	    }
	}
});
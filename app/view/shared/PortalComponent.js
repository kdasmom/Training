/**
 * Base class for portal rows and columns
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.PortalComponent', {
	extend: 'Ext.panel.Panel',

	viewOnly  : false,

    changeSize: function(dir, newRatio) {
		var me        = this,
			items     = me.ownerCt.items.items,
			minRatio  = (me.getXType() == 'shared.portalcolumn') ? 0.2 : 0.3,
			maxRatio  = 0.8,
			multiplier = (dir == 'plus') ? 1 : -1,
			increment = 0.05 * multiplier,
			totalFlex = 0,
			ratio,
			item,
			updateItems = [];

		for (var i=0; i<items.length; i++) {
			var item = items[i];
			
			totalFlex += item.flex;

			if (item.id !== me.id) {
				updateItems.push(item);
			}
		}

		// Do this if user clicked a plus/minus button
		if (!newRatio) {
			ratio    = me.flex / totalFlex;
			newRatio = ratio + increment;
		// Do this if user is adding a new row/column
		} else {
			ratio = 0;
		}
		
		if (newRatio > maxRatio) {
			newRatio = maxRatio;
		} else if (newRatio < minRatio) {
			newRatio = minRatio;
		}
		
		if (newRatio != ratio) {
			var ratioToAllocate = Math.abs(newRatio - ratio),
				totalRatio      = 0,
				iterations      = 0;

			while(updateItems.length) {
				var ratioPerItem = ratioToAllocate / updateItems.length,
					normalItems  = [],
					problemItems = [];
				
				for (i=0; i<updateItems.length; i++) {
					var item         = updateItems[i],
						// We handle things differently if dealing with a specific ratio (adding item)
						itemRatio    = (ratio === 0) ? item.flex : item.flex / totalFlex,
						newItemRatio = itemRatio + (ratioPerItem * multiplier * -1);

					if (newItemRatio > maxRatio || newItemRatio < minRatio) {
						newItemRatio = (newItemRatio > maxRatio) ? maxRatio : minRatio;
						problemItems.push({ pos: i, itemRatio: itemRatio, newItemRatio: newItemRatio });
					} else {
						normalItems.push({ pos: i, ratio: newItemRatio });
					}
				}
				if (problemItems.length) {
					for (i=0;i<problemItems.length;i++) {
						item = problemItems[i];
						updateItems[item.pos-i].flex = item.newItemRatio;
						ratioToAllocate -= Math.abs(item.newItemRatio - item.itemRatio);
						updateItems.splice(item.pos-i, 1);
						totalRatio += item.newItemRatio;
					}
				} else {
					for (i=0;i<normalItems.length;i++) {
						item = normalItems[i];
						updateItems[item.pos].flex = item.ratio;
						totalRatio += item.ratio;
					}
					break;
				}

				// This is a precaution to make sure an infinite loop doesn't happen for some reason
				iterations++;
				if (iterations > 20) {
					break;
				}
			}
			
			me.flex = 1 - totalRatio;

			me.ownerCt.doLayout();
		}
	},

	adjustRatios: function(parentObj) {
		var me         = this,
			items      = parentObj.items.items,
			totalRatio = 0;

		for (var i=0; i<items.length; i++) {
			totalRatio += items[i].flex;
		}

		for (var i=0; i<items.length; i++) {
			items[i].flex = items[i].flex / totalRatio;
		}

		parentObj.doLayout();
	},

	initComponent: function() {
		if (!this.viewOnly) {
			this.tbar.push(
				'->',
				{
					xtype  : 'tool',
					type   : 'plus',
					tooltip: 'Make Bigger',
					handler: function(evt, tool, panelHeader) {
						panelHeader.up('panel').changeSize('plus');
					}
				},{
					xtype  : 'tool',
					type   : 'minus',
					tooltip: 'Make Smaller',
					handler: function(evt, tool, panelHeader) {
						panelHeader.up('panel').changeSize('minus');
					}
				}
			);
		}

		this.callParent(arguments);
	}
});
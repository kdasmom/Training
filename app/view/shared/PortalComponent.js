/**
 * Base class for portal rows and columns
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.PortalComponent', {
	extend: 'Ext.panel.Panel',

	viewOnly  : false,

    changeSize: function(dir) {
		var origFlex = this.flex;
		var maxFlex = (this.maxFlex) ? this.maxFlex : 8;
		
		if (dir == 'plus' && this.flex < maxFlex) {
			this.flex++;
		} else if (dir == 'minus' && this.flex > 1) {
			this.flex--;
		}

		if (origFlex != this.flex) {
			this.ownerCt.doLayout();
		}
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
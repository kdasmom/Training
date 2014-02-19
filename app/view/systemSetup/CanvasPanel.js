/**
 * Created by Andrey Baranov
 * date: 2/6/14 6:09 AM
 */


Ext.define('NP.view.systemSetup.CanvasPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.canvaspanel',

	requires: [
		'NP.lib.core.Translator'
	],

	layout: {
		type: 'vbox',
		align: 'stretch'
	},

	bodyStyle: {
		border      : '2px dashed #99BBE8',
		borderRadius: '4px'
	},

	padding: '5',

	initComponent: function() {
		var me = this;
		me.html = NP.Translator.translate('Drag & Drop Here');

		me.listeners = {
			render: function(colPanel) {
				colPanel._dropTarget = Ext.create('Ext.dd.DropTarget', colPanel.body.dom, {
					ddGroup: 'templates',
					notifyEnter: function(ddSource, e, data) {
						colPanel.body.stopAnimation();
						colPanel.body.highlight();
					},
					notifyDrop : function(ddSource, e, data){
						var tileRec = ddSource.dragData.records[0],
							index = tileRec.index;


						var tile = Ext.create('Ext.panel.Panel', {
							layout: 'fit',
							title: tileRec.get('title'),
							width: '100%',
							closable: true,
							cloaseAction: 'destroy',
							field: tileRec.get('field'),
							index: tileRec.get('index')
						});

						me.addTile(index, tileRec.get('title'), tileRec.get('field'), true);

						return true;
					}
				});
			}
		};

		me.callParent(arguments);
	},

	addTile: function(index, title, field, isDragged) {
		var me = this,
			tilePanel,
			panel = Ext.create('Ext.panel.Panel', {
				layout: 'fit',
				title: title,
				width: '100%',
				closable: true,
				cloaseAction: 'destroy',
				field: field,
				index: index
			});

		tilePanel = me.add(panel);
		if (isDragged) {
			me.fireEvent('addtemplateitem', index, me.name);
		}

		tilePanel.on('close', function() {
			me.fireEvent('removetemplateitem', this.index, me.name, [this.index, this.field, this.title]);
		});
	}
});
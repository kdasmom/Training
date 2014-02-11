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

	listeners: {
		added: function(panel, container, pos, eOpts) {
			console.log('afterrender: ', panel);
		}
	},

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
						var tilepanel = colPanel.add(tile);

						me.fireEvent('addtemplateitem', index, me.name);

						tilepanel.on('close', function() {
							me.fireEvent('removetemplateitem', this.index, me.name, [this.index, this.field, this.title]);
						});

						return true;
					}
				});
			}
		};

		me.callParent(arguments);
	}
});
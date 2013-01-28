Ext.define('Ux.ui.CustomCombo', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.customcombo',
	
	constructor: function(cfg) {
		Ext.applyIf(cfg, {
			queryMode: 'local',
			typeAhead: true,
			forceSelection: true,
			allowOnlyWhitespace: true,
			editable: true,
			tpl: new Ext.XTemplate('<tpl for=".">' + '<li style="height:22px;" class="x-boundlist-item" role="option">' + '{'+cfg.displayField+'}' + '</li></tpl>'),
			listeners: {} 
		});
		
		Ext.applyIf(cfg.listeners, {
			keyup: function(field) {
				var val = field.getRawValue();
				if (val === '' || val === null) {
					field.clearValue();
				}
			},
			beforerender: function(field) {
				field.getStore().addListener('load', function(store) {
					var rec = {};
					rec[field.displayField] = '';
					rec[field.valueField] = '';
					store.insert(0, rec);
				});
			}
		});
		
		this.callParent(arguments);
	}
});
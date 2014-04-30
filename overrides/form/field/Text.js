// Adds functions for adding and removing classes to the input element and dynamically set allowBLank
Ext.define('overrides.form.field.Text', {
	override: 'Ext.form.field.Text',

	addFieldCls: function(cls) {
        var me      = this,
            inputEl = me.inputEl;

        if (inputEl) {
            inputEl.addCls(cls);
        }
    },

    removeFieldCls: function(cls) {
    	var me      = this,
            inputEl = me.inputEl;

        if (inputEl) {
            inputEl.removeCls(cls);
        }
    },

    setAllowBlank: function(allowBlank) {
    	var me      = this,
            inputEl = me.inputEl;

        if (me.allowBlank !== allowBlank) {
            me.allowBlank = allowBlank;
        	if (allowBlank) {
        		inputEl.removeCls(me.requiredCls);
        	} else {
                inputEl.addCls(me.requiredCls);
            }
        }
    }
});
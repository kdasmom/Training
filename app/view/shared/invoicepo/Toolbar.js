/**
 * A toolbar for the invoice/po view pages
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.shared.invoicepo.toolbar',

    requires: [
    	'NP.lib.core.Security'
    ],

    initComponent: function() {
    	this.defaults = { hidden: true };

    	this.callParent(arguments);
    },

    refresh: function() {
    	var me = this,
    		i,
    		btn,
    		btnVisibilityFn;

    	Ext.suspendLayouts();
    	
    	for (i=0; i<this.items.getCount(); i++) {
    		btn = this.items.getAt(i);
    		btnVisibilityFn = 'show';
    		if ('moduleId' in btn && !NP.Security.hasPermission(btn.module_id)) {
    			btnVisibilityFn = 'hide';
    		} else if ('displayCondition' in btn && !btn.displayCondition(me.displayConditionData)) {
				btnVisibilityFn = 'hide';
			}
			btn[btnVisibilityFn]();
    	}

    	Ext.resumeLayouts(true);
    }
});
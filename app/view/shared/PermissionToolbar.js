/**
 * A toolbar for the invoice/po view pages
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.PermissionToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.shared.permissiontoolbar',

    requires: [
    	'NP.lib.core.Security'
    ],

    initComponent: function() {
    	this.defaults = { hidden: true, defaults: { hidden: true } };

    	this.callParent(arguments);
    },

    refresh: function() {
    	var me = this;

    	Ext.suspendLayouts();
		
		me.setVisibility(me.items);

    	Ext.resumeLayouts(true);
    },

    setVisibility: function(items) {
    	var me = this,
    		i,
    		btn,
    		btnVisibilityFn;

    	for (i=0; i<items.getCount(); i++) {
    		btn = items.getAt(i);
    		btnVisibilityFn = 'show';
    		if ('moduleId' in btn && !NP.Security.hasPermission(btn.moduleId)) {
    			btnVisibilityFn = 'hide';
    		} else if ('displayCondition' in btn && !btn.displayCondition(me.displayConditionData)) {
				btnVisibilityFn = 'hide';
			}
			
			btn[btnVisibilityFn]();

			if (btn.menu) {
				me.setVisibility(btn.menu.items);
			}
    	}
    }
});
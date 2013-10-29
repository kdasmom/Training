// Makes sure a component is visible (for example, if you want to make sure a field's tab is active)
Ext.define('overrides.Component', {
	override: 'Ext.Component',

	requires: ['NP.lib.ui.VerticalTabPanel'],

    ensureVisible: function(stopAt) {
        var p, me = this;
        this.ownerCt.bubble(function(c) {
        	if (c instanceof Ext.tab.Panel || c instanceof NP.lib.ui.VerticalTabPanel) {
        		c.setActiveTab(me);
        		return false;
        	} else {
	            if (p = c.ownerCt) {
	                if (p instanceof Ext.tab.Panel || p instanceof NP.lib.ui.VerticalTabPanel) {
	                	p.setActiveTab(c);
	                	return false;
	                }
	            }
	        }
            return (c !== stopAt);
        });
        
        return this;
    }
});
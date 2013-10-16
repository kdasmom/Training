/**
 * A panel to hold an invoice image
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.ImagePanel', {
	extend: 'Ext.panel.Panel',
    alias: 'widget.viewport.imagepanel',
    
    requires: [],

    layout      : 'fit',
    hidden      : true,
    collapsible : true,
    collapsed   : true,
    animCollapse: false,
    resizable   : true,

    initComponent: function() {
    	var me = this;

        // Set animCollapse here, for some reason setting it as a config option doesn't work
        me.animCollapse = false;

    	me.callParent(arguments);

    	// We need to hide this panel after render because setting both "hidden" and "collapsed"
    	// config options prevents the panel from staying hidden
    	me.on('render', function() {
    		me.hide();
    	});
    }
});
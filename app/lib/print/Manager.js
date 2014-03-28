/**
 * 
 */
Ext.define('NP.lib.print.Manager', {
    alternateClassName: 'NP.PrintManager',
    singleton         : true,
    
    requires: [
        'NP.lib.print.renderer.GridPanel',
        'NP.lib.print.renderer.Chart'
    ],

    renderers: {
        'chart'     : 'Chart',
        'gridpanel' : 'GridPanel'
    },
    
    getRenderer: function(xtype) {
        return this.renderers[xtype];
    },

    print: function(component, cfg) {
        var me     = this,
            xtypes = component.getXTypes().split('/'),
            i      = xtypes.length - 1,
            renderer;
        
        //iterate backwards over the xtypes of this component, dispatching to the most specific renderer
        for (; i >= 0; i--){
            renderer = me.getRenderer(xtypes[i]);
            
            if (!Ext.isEmpty(renderer)){
                var o = Ext.create('NP.lib.print.renderer.' + renderer, cfg || {});
                o.print(component);
                break;
            }
        }
    }
});
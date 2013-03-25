/**
 * The toolbar that sits right below the NP logo and shows who's logged in, etc.
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.TopToolbar', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.viewport.toptoolbar',
    
    requires: ['NP.lib.core.Config','NP.view.viewport.DelegationPicker'],

    border: false,
    
    initComponent: function() {
        var bgColor = 'background-color: ' + NP.lib.core.Config.getToolbarBg();

        this.style = bgColor;
        this.bodyStyle = bgColor;
        this.items = [
            {
                xtype    : 'viewport.delegationpicker',
                itemId   : 'topToolbarDelegationPicker',
                margin   : '0 0 0 15',
                border   : false,
                style    : bgColor,
                bodyStyle: bgColor
            }
        ];

        this.callParent(arguments);
    }
});
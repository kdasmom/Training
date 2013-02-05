Ext.define('NP.view.viewport.TopToolbar', function () {
    var bgColor = 'background-color: #DFE8F6';

	return {
        extend: 'Ext.panel.Panel',
        alias: 'widget.viewport.toptoolbar',
        
        requires: ['NP.view.viewport.DelegationPicker'],

        border: false,
        style: bgColor,
        bodyStyle: bgColor,

        items: [
            {
                xtype    : 'viewport.delegationpicker',
                itemId   : 'topToolbarDelegationPicker',
                margin   : '0 0 0 15',
                border   : false,
                style    : bgColor,
                bodyStyle: bgColor
            }
        ]
    }
});
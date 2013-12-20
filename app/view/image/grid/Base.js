/**
 * This is base class for all grids in "Image Management".
 */
Ext.define('NP.view.image.grid.Base', {
    extend: 'NP.view.image.ImageGrid',
    alias:  'widget.image.grid.Base',

    initComponent: function(){
        this.selType = 'checkboxmodel';
        this.selModel = {
            mode: 'MULTI',
            checkOnly: true
        };

        this.paging = true;
        this.defaultWidth = 50;

        this.callParent(arguments);
    }
});
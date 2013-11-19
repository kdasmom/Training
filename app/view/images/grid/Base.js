/**
 * This is base class for all grids in "Image Management".
 *
 * @author Oleg Sosorev
 */
Ext.define('NP.view.images.grid.Base', {
    extend: 'NP.view.image.ImageGrid',
    alias:  'widget.images.grid.Base',

    initComponent: function(){
        this.selType = 'checkboxmodel'
        this.selModel = {
            mode: 'MULTI',
            checkOnly: true
        };

        this.paging = true;
        this.defaultWidth = 50;

        this.callParent(arguments);
    }
});
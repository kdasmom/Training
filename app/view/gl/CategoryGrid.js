/**
 * GL Account Setup > Category Form
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.gl.CategoryGrid', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.gl.categorygrid',
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            enableDrop: true,
            dragText:'Reorder Rows'
        }
    },
    
    nameColumnText: 'Name',

    initComponent: function() {
        this.columns = [
			{ text: 'Name', dataIndex: 'glaccount_name', flex: 9 }
		];

    	this.callParent(arguments);
    }
});
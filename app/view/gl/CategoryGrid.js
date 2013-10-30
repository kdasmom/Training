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
    
    intPkgText    : 'Integration Package',
    nameColumnText: 'Name',

    initComponent: function() {
        var integration_package_id = Ext.getStore('system.IntegrationPackages')
                                        .getRange()[0].get('integration_package_id');

        this.tbar = [{
            xtype       : 'customcombo',
            fieldLabel  : this.intPkgText,
            labelWidth  : 150,
            store       : 'system.IntegrationPackages',
            name        : 'integration_package_id',
            displayField: 'integration_package_name',
            valueField  : 'integration_package_id',
            value       : integration_package_id,
            allowBlank  : false
        }];

        this.columns = [
			{
                text: 'Name',
                dataIndex: 'glaccount_name',
                flex: 3
            },{
                text: 'Status',
                dataIndex: 'glaccount_status',
                flex: 1,
                renderer: Ext.util.Format.capitalize
            }
		];

    	this.callParent(arguments);
    }
});
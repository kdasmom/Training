/**
 * GL Account Setup > Category Form
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.gl.CategoryForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.gl.categoryform',
    
    requires: [
    	'NP.view.gl.CategoryGrid',
    	'NP.view.shared.button.Cancel',
    	'NP.view.shared.button.Save'
    ],

    title      : 'Category',

    layout     : 'form',
	bodyPadding: 8,
	margin     : '0 0 0 8',
	hidden     : true,
	
    initComponent: function() {
        this.tbar = {
            dock  : 'top',
            items : [
                { xtype: 'shared.button.save' },
                { xtype: 'shared.button.cancel' }
            ]
        };

    	this.items = [
            {
                xtype: 'hidden',
                name: 'glaccount_id'
            },
            {
                xtype: 'hidden',
                name: 'integration_package_id',
                value: 1
            },
            {
                xtype     : 'textfield',
                fieldLabel: 'Category Name',
                name      : 'glaccount_name',
                allowBlank: false
            },{
                xtype: 'radiogroup',
                fieldLabel: 'Status',
                width: 250,
                style: 'white-space: nowrap;margin-right:12px;',
                value: 'active',
                items: [
                        { boxLabel: 'Active', inputValue: 'active', checked: true, 
                name: 'glaccount_status' },
                        { boxLabel: 'Inactive', inputValue: 'inactive', 
                name: 'glaccount_status' }
                ]
            }
        ];

    	this.callParent(arguments);
    }
});
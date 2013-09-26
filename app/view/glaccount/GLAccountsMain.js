/**
 * GL Account Setup > GL Accounts
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.glaccount.GLAccountsMain', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.glaccount.glaccountsmain',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.ui.Grid',
    	'NP.view.shared.button.Cancel',
    	'NP.view.shared.button.New',
        'NP.view.glaccount.gridcol.GLNumber',
        'NP.view.glaccount.gridcol.GLName',
        'NP.view.glaccount.gridcol.GLLevel',
        'NP.view.glaccount.gridcol.GLType',
        'NP.view.glaccount.gridcol.GLStatus',
        'NP.view.glaccount.gridcol.LastUpdated',
    ],
        
    createNewText: 'Create New',
    
    layout: 'fit',
    border: false,
    
    initComponent: function() {
         var that = this;

    	var bar = [
                { xtype: 'shared.button.cancel' },
    		{ xtype: 'shared.button.new', text: this.createNewText }
	    ];
        this.tbar = bar;
        this.bbar = bar;
        
        this.items = [{
            xtype   : 'customgrid',
            paging  : true,
            selModel: Ext.create('Ext.selection.CheckboxModel'),
            stateful: true,
            stateId : 'glaccount_setup_grid',
            store   : Ext.create('NP.store.gl.GlAccounts', {
                service: 'GLService',
                action : 'getAllGLAccounts',
                paging: true
            }),
            columns : [
                { xtype: 'glaccount.gridcol.glnumber', flex: 1 },
                { xtype: 'glaccount.gridcol.glname', flex: 2 },
                { xtype: 'glaccount.gridcol.gllevel', flex: 2 },
                { xtype: 'glaccount.gridcol.gltype', flex: 1 },
                { xtype: 'glaccount.gridcol.glstatus', flex: 1 },
                {
                    text : 'Last Updated',
                    dataIndex: 'glaccount_updatetm',
                    renderer: function(val, meta, rec) {
                        var returnVal = Ext.Date.format(val, NP.Config.getDefaultDateFormat() + ' h:iA');
                        if (rec.get('last_updated_by') != null) {
                            returnVal += ' (' + rec.getUpdatedByUser().get('userprofile_username') + ')'
                        }

                        return returnVal;
                    },
                    flex : 1.5
                }
            ],
            pagingToolbarButtons: [
                {
                    xtype         : 'combo',
                    fieldLabel    : 'Status',
                    labelWidth    : 50,
                    editable      : false,
                    forceSelection: true, 
                    name          : 'glaccount_status',
                    displayField  : 'glaccount_status_name',
                    valueField    : 'glaccount_status',
                    value         : 1,
                    store         : Ext.create('Ext.data.Store', {
                        fields: ['glaccount_status', 'glaccount_status_name'],
                        data : [
                            { glaccount_status: 'active', glaccount_status_name: 'Active' },
                            { glaccount_status: 'inactive', glaccount_status_name: 'Inactive' }
                        ]
                    }),
                    margin: '0 5 0 5'
                },
            ]
        }];

        this.addEvents('itemeditclick');    
    	this.callParent(arguments);
    }
});
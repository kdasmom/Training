/**
 * GL Account Setup > GL Accounts
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.glaccount.GLAccounts', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.glaccount.glaccounts',
    
    requires: [
        'NP.lib.ui.Grid',
    	'NP.view.shared.button.Cancel',
    	'NP.view.shared.button.New'
    ],
    
    title: 'GL Accounts',
    
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
            store   : Ext.create('NP.store.glaccount.Properties', {
                service: 'GLAccountService',
                action : 'getByStatus',
                paging: true
            }),
            columns : [
                { xtype: 'glaccount.gridcol.glaccountname', flex: 2 },
                {
                    text: 'Integration Package',
                    dataIndex: 'integration_package_name',
                    flex: 1,
                    renderer: function(val, meta, rec) {
                        return rec.getIntegrationPackage().get('integration_package_name');
                    }
                },
                { xtype: 'templatecolumn', text: NP.Config.getSetting('PN.main.RegionLabel', 'Region'), tpl: '{region.region_name}', flex: 1.5 },
                { xtype: 'glaccount.gridcol.code', flex: 1 },
                { xtype: 'glaccount.gridcol.totalunits', flex: 1 },
                {
                    text : 'Created By',
                    dataIndex: 'UserProfile_ID',
                    renderer: function(val, meta, rec) {
                        var user = rec.getCreatedByUser();
                        var returnVal = user.get('userprofile_username');
                        var person = user.getUserprofilerole().getStaff().getPerson();
                        if (person.get('person_id') != null) {
                            var firstName = person.get('person_firstname');
                            var lastName = person.get('person_lastname');
                            if (firstName != '' || lastName != '') {
                                returnVal += ' (' + firstName + ' ' + lastName + ')'
                            }
                        }

                        return returnVal;
                    },
                    flex : 1.5
                },
                { xtype: 'glaccount.gridcol.createddate', flex: 0.5 },
                {
                    text : 'Last Updated',
                    dataIndex: 'last_updated_datetm',
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
                            { glaccount_status: 1, glaccount_status_name: 'Current' },
                            { glaccount_status: -1, glaccount_status_name: 'On Hold' },
                            { glaccount_status: 0, glaccount_status_name: 'Inactive' }
                        ]
                    }),
                    margin: '0 5 0 5'
                },
                { xtype: 'tbseparator' },
                { xtype: 'shared.button.inactivate', hidden: true },
                { xtype: 'shared.button.activate', hidden: true },
                { xtype: 'shared.button.hourglass', text: this.placeOnHoldText, hidden: true }
            ]
        }];

        this.addEvents('itemeditclick');    
    	this.callParent(arguments);
    }
});
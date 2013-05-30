/**
 * Property Setup > Properties section > Grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.PropertiesMain', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.property.propertiesmain',
    
    requires: [
    	'NP.lib.core.Config',
        'NP.lib.ui.Grid',
    	'NP.view.shared.button.Activate',
    	'NP.view.shared.button.Inactivate',
    	'NP.view.shared.button.New',
    	'NP.view.shared.button.Hourglass',
        'NP.view.shared.gridcol.IntegrationPackageName',
        'NP.view.property.gridcol.Code',
        'NP.view.property.gridcol.CreatedBy',
        'NP.view.property.gridcol.CreatedDate',
        'NP.view.property.gridcol.LastUpdated',
        'NP.view.property.gridcol.PropertyName',
        'NP.view.property.gridcol.RegionName',
        'NP.view.property.gridcol.TotalUnits'
    ],

    createNewPropertyText: 'Create New ' + NP.Config.getPropertyLabel(),
    placeOnHoldText: 'Place On Hold',

    layout: 'fit',
    border: false,

    initComponent: function() {
        var that = this;

    	var bar = [
    		{ xtype: 'shared.button.new', text: this.createNewPropertyText }
	    ];
	    this.tbar = bar;
	    this.bbar = bar;

        this.items = [{
            xtype   : 'customgrid',
            paging  : true,
            selModel: Ext.create('Ext.selection.CheckboxModel'),
            stateful: true,
            stateId : 'property_setup_grid',
            store   : Ext.create('NP.store.property.Properties', {
                service: 'PropertyService',
                action : 'getByStatus',
                paging: true
            }),
            columns : [
                { xtype: 'property.gridcol.propertyname', flex: 2 },
                { xtype: 'shared.gridcol.integrationpackagename', flex: 1 },
                { xtype: 'property.gridcol.regionname', flex: 1.5 },
                { xtype: 'property.gridcol.code', flex: 1 },
                { xtype: 'property.gridcol.totalunits', flex: 1 },
                { xtype: 'property.gridcol.createdby', flex: 1.5 },
                { xtype: 'property.gridcol.createddate', flex: 0.5 },
                { xtype: 'property.gridcol.lastupdated', flex: 1.5 },
                {
                    xtype: 'actioncolumn',
                    flex : 0.1,
                    align: 'center',
                    items: [{
                        icon   :    'resources/images/buttons/edit.gif',
                        tooltip: 'Edit',
                        handler: function(grid, rowIndex, colIndex, item, e, rec) {
                            that.fireEvent('itemeditclick', grid, rec, rowIndex);
                        }
                    }]
                }
            ],
            pagingToolbarButtons: [
                {
                    xtype         : 'combo',
                    fieldLabel    : 'Status',
                    labelWidth    : 50,
                    editable      : false,
                    forceSelection: true, 
                    name          : 'property_status',
                    displayField  : 'property_status_name',
                    valueField    : 'property_status',
                    value         : 1,
                    store         : Ext.create('Ext.data.Store', {
                        fields: ['property_status', 'property_status_name'],
                        data : [
                            { property_status: 1, property_status_name: 'Current' },
                            { property_status: -1, property_status_name: 'On Hold' },
                            { property_status: 0, property_status_name: 'Inactive' }
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
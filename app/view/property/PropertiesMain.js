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
        'NP.view.property.gridcol.Code',
        'NP.view.property.gridcol.CreatedDate',
        'NP.view.property.gridcol.LastUpdated',
        'NP.view.property.gridcol.PropertyName',
        'NP.view.property.gridcol.RegionName',
        'NP.view.property.gridcol.TotalUnits',
		'NP.view.property.gridcol.PropertyStatus',
		'NP.view.property.gridcol.PropertyApCode'
    ],

    layout: 'fit',
    border: false,

    initComponent: function() {
        var that = this,
            propertyText = NP.Config.getPropertyLabel();

    	var bar = [{
            xtype: 'shared.button.new',
            text: NP.Translator.translate('Create New {property}', { property: propertyText })
        }];
        
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
				{
					xtype: 'property.gridcol.propertystatus'
				},
                {
					xtype: 'property.gridcol.propertyname',
					flex: 2,
					enableColumnHide: false,
					hideable: false
				},
                {
                    text: 'Integration Package',
                    dataIndex: 'integration_package_name',
                    flex: 1,
                    renderer: function(val, meta, rec) {
                        return rec.getIntegrationPackage().get('integration_package_name');
                    }
                },
                { xtype: 'templatecolumn', text: NP.Config.getSetting('PN.main.RegionLabel', 'Region'), tpl: '{region.region_name}', flex: 1.5 },
                { xtype: 'property.gridcol.code', flex: 1 },
                { xtype: 'property.gridcol.propertyapcode', flex: 1 },
                { xtype: 'property.gridcol.totalunits', flex: 1 },
                {
                    text : 'Created By',
                    dataIndex: 'UserProfile_ID',
                    renderer: function(val, meta, rec) {
                        var user = rec.getCreatedByUser();
                        var returnVal = user.get('userprofile_username');
                        if (user.get('person_id') != null) {
                            var firstName = user.get('person_firstname');
                            var lastName = user.get('person_lastname');
                            if (firstName != '' || lastName != '') {
                                returnVal += ' (' + firstName + ' ' + lastName + ')'
                            }
                        }

                        return returnVal;
                    },
                    flex : 1.5
                },
                { xtype: 'property.gridcol.createddate', flex: 0.5 },
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
                { xtype: 'shared.button.hourglass', text: NP.Translator.translate('Place On Hold'), hidden: true }
            ]
        }];

        this.addEvents('itemeditclick');
    	this.callParent(arguments);
    }
});
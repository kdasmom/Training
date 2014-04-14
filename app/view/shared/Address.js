/**
 * A custom container that shows an address block, including street, city, state, and zip code
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.Address', {
    extend: 'Ext.container.Container',
    alias: 'widget.shared.address',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.lib.ui.ComboBox',
        'NP.lib.core.Translator'
    ],

    defaults: {
        labelAlign: 'top'
    },

    // FIELD VALUES
    /**
     * @cfg {String}  [address_line1=""]         Value to populate the first line of street address with
     */
    address_line1       : '',
    /**
     * @cfg {String}  [address_line2=""]         Value to populate the second line of street address with
     */
    address_line2       : '',
    /**
     * @cfg {String}  [address_city=""]          Value to populate the city field with
     */
    address_city        : '',
    /**
     * @cfg {String}  [address_state=""]         Value to populate the state field with
     */
    address_state       : '',
    /**
     * @cfg {String}  [address_zip=""]           Value to populate the zip field with
     */
    address_zip         : '',
    /**
     * @cfg {String}  [address_zipext=""]        Value to populate the zip +4 field with
     */
    address_zipext      : '',
    /**
     * @cfg {Number}  [address_country=null]       Value to populate the country field with
     */
    address_country      : null,

    // OPTIONS
    /**
     * @cfg {Boolean} [required=false]           Defines if the address block is required or not
     */
    required            : false,
    /**
     * @cfg {Boolean} [showCountry=false]        Defines if the country field should show or not
     */
    showCountry         : false,
    /**
     * @cfg {String}  [prefix=""]                Prefix for the fields' name config option
     */
    prefix              : '',
    /**
     * @cfg {Number}  [address_line1_width=400]  Width of the first street address field
     */
    address_line1_width : 400,
    /**
     * @cfg {Number}  [address_line2_width=400]  Width of the second street address field
     */
    address_line2_width : 400,
    /**
     * @cfg {Number}  [address_city_width=200]   Width of the city field
     */
    address_city_width  : 200,
    /**
     * @cfg {Number}  [address_state_width=45]   Width of the state field
     */
    address_state_width : 45,
    /**
     * @cfg {Number}  [address_zip_width=75]     Width of the zip field
     */
    address_zip_width   : 75,
    /**
     * @cfg {Number}  [address_zipext_width=65] Width of the zip +4 field
     */
    address_zipext_width: 65,
    /**
     * @cfg {Number}  [address_country_width=200] Width of the country field
     */
    address_country_width: 200,

    statics: {
        LINE1  : 'address_line1',
        LINE2  : 'address_line2',
        CITY   : 'address_city',
        STATE  : 'address_state',
        ZIP    : 'address_zip',
        ZIPEXT : 'address_zipext',
        COUNTRY: 'address_country',
        FIELDS : ['LINE1','LINE2','CITY','STATE','ZIP','ZIPEXT','COUNTRY']
    },

    initComponent: function() {
        this.items = [];

        this.items.push({
            xtype     : 'textfield',
            fieldLabel: NP.Translator.translate('Street'),
            name      : this.prefix + NP.view.shared.Address.LINE1,
            allowBlank: !this.required,
            width     : this.address_line1_width,
            maxLength : 255,
            value     : this.address_line1
        },{
            xtype     : 'textfield',
            hideLabel : true,
            name      : this.prefix + NP.view.shared.Address.LINE2,
            width     : this.address_line2_width,
            maxLength : 255,
            value     : this.address_line2
        },{
            xtype: 'container',
            layout: 'column',
            width : this.address_city_width + this.address_state_width + this.address_zip_width + this.address_zipext_width + 20,
            defaults: {
                labelAlign: 'top',
                margin: '0 5 0 0'
            },
            items: [
                {
                    xtype     : 'textfield',
                    fieldLabel: NP.Translator.translate('City'),
                    name      : this.prefix + NP.view.shared.Address.CITY,
                    allowBlank: !this.required,
                    width     : this.address_city_width,
                    maxLength : 100,
                    value     : this.address_city
                },{
                    xtype         : 'customcombo',
                    store         : 'system.States',
                    displayField  : 'code',
                    valueField    : 'code',
                    fieldLabel    : NP.Translator.translate('State'),
                    name          : this.prefix + NP.view.shared.Address.STATE,
                    allowBlank    : !this.required,
                    width         : this.address_state_width,
                    value         : this.address_state,
					editable	  : true,
					typeAhead	  : false
                },{
                    xtype      : 'textfield',
                    fieldLabel : NP.Translator.translate('Zip'),
                    name       : this.prefix + NP.view.shared.Address.ZIP,
                    width      : this.address_zip_width,
                    allowBlank : !this.required,
                    value      : this.address_zip
                },{
                    xtype      : 'textfield',
                    fieldLabel : 'Zip Ext', // This will be hidden after render
                    name       : this.prefix + NP.view.shared.Address.ZIPEXT,
                    width      : this.address_zipext_width,
                    value      : this.address_zipext
                }
            ]
        });
        
        if (this.showCountry) {
            this.items.push({
                xtype            : 'customcombo',
                store            : 'system.Countries',
                selectFirstRecord: true,
                displayField     : 'name',
                valueField       : 'id',
                fieldLabel       : NP.Translator.translate('Country'),
                name             : this.prefix + NP.view.shared.Address.COUNTRY,
                width            : this.address_country_width,
                value            : this.address_country
            });
        }

        this.callParent(arguments);

        this.on('afterrender', function(el) {
            this.getZipExt().labelCell.setVisibilityMode(Ext.dom.Element.VISIBILITY).setVisible(false);
        }, this);
    },

    getField: function(name) {
        return this.query('[name="' + this.prefix + NP.view.shared.Address[name] + '"]')[0];
    },

    getLine1: function() {
        return this.getField('LINE1');
    },

    getLine2: function() {
        return this.getField('LINE2');
    },

    getCity: function() {
        return this.getField('CITY');
    },

    getState: function() {
        return this.getField('STATE');
    },

    getZip: function() {
        return this.getField('ZIP');
    },

    getZipExt: function() {
        return this.getField('ZIPEXT');
    },

    getCountry: function() {
        return this.getField('COUNTRY');
    },

    validate: function() {
        var isValid = true;
        Ext.each(NP.view.shared.Address.FIELDS, function(field) {
            var valid = this.getField(field).validate();
            if (!valid) {
                isValid = false;
            }
        }, this);

        return isValid;
    }
});
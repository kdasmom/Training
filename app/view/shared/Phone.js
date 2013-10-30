/**
 *
 * A custom container that shows a phone block, including area code and number fields
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.Phone', {
    extend: 'Ext.container.Container',
    alias: 'widget.shared.phone',
    
    statics: {
        COUNTRYCODE: 'phone_countrycode',
        NUMBER     : 'phone_number',
        EXT        : 'phone_ext',
        FIELDS     : ['COUNTRYCODE','NUMBER','EXT']
    },

    // FIELD VALUES
    /**
     * @cfg {String} [phone_countrycode=""] Value to populate the area code
     */
    phone_countrycode  : '',
    /**
     * @cfg {String} [phone_number=""]      Value to populate the phone number
     */
    phone_number: '',
    /**
     * @cfg {String} [phone_ext=""]         Value to populate the phone number
     */
    phone_ext: '',

    // OPTIONS
    /**
     * @cfg {String} [label="Phone Number"] Label text
     */
    label     : 'Phone Number',
    /**
     * @cfg {Boolean} [showLabel=true] Whether or not to show the top label
     */
    hideLabel : false,
    /**
     * @cfg {Boolean} [showFieldDescriptions=false] Whether to show the country code and phone number field descriptions
     */
    showFieldDescriptions : false,
    /**
     * @cfg {Boolean} [required=false]      Defines if the phone is required or not
     */
    required    : false,
    /**
     * @cfg {String}  [prefix=""]           Prefix for the fields' name config option
     */
    prefix      : '',
    /**
     * @cfg {String}  [hideCountry=false]    Whether or not to hide the country code
     */
    hideCountry : true,
    /**
     * @cfg {String}  [hideExt=true]        Whether or not to hide the extension field
     */
    hideExt     : true,

    initComponent: function() {
        this.items = [];

        var countryCodeWidth = (this.showFieldDescriptions) ? 80 : 40,
            numberWidth = 120,
            extWidth = 40,
            totalWidth = countryCodeWidth + numberWidth + extWidth + 20;
        this.width = totalWidth;

        this.items.push(
            {
                xtype : 'label',
                text  :  this.label + ':',
                cls   : 'x-form-item-label x-unselectable x-form-item-label-top',
                hidden: this.hideLabel
            },{
                xtype: 'container',
                layout: 'column',
                width: totalWidth,
                defaults: {
                    margin    : '0 5 0 0',
                    labelAlign: 'top'
                },
                items: [
                    {
                        xtype      : 'textfield',
                        fieldLabel : 'Country Code',
                        hideLabel  : !this.showFieldDescriptions,
                        hidden     : this.hideCountry,
                        name       : this.prefix + NP.view.shared.Phone.COUNTRYCODE,
                        allowBlank : !this.required,
                        width      : countryCodeWidth,
                        maxLength  : 25,
                        value      : this.phone_countrycode,
                        regex      : /^\d{3}$/,
                        hideTrigger: true
                    },{
                        xtype      : 'textfield',
                        fieldLabel : 'Number',
                        hideLabel  : !this.showFieldDescriptions,
                        name       : this.prefix + NP.view.shared.Phone.NUMBER,
                        allowBlank : !this.required,
                        width      : numberWidth,
                        maxLength  : 25,
                        value      : this.phone_number,
                        maskRe     : /[()\d- ]/
                    },{
                        xtype      : 'textfield',
                        fieldLabel : 'Ext',
                        hideLabel  : !this.showFieldDescriptions,
                        hidden     : this.hideExt,
                        name       : this.prefix + NP.view.shared.Phone.EXT,
                        width      : extWidth,
                        maxLength  : 10,
                        value      : this.phone_ext,
                        maskRe     : /[()\d- ]/
                    }
                ]
            }
        );

        this.callParent(arguments);
    },

    getField: function(name) {
        return this.query('[name="' + this.prefix + NP.view.shared.Phone[name] + '"]')[0];
    },

    getCountryCode: function() {
        return this.getField('COUNTRYCODE');
    },

    getNumber: function() {
        return this.getField('NUMBER');
    },

    getExt: function() {
        return this.getField('EXT');
    },

    validate: function() {
        var isValid = true;
        Ext.each(NP.view.shared.Phone.FIELDS, function(field) {
            var valid = this.getField(field).validate();
            if (!valid) {
                isValid = false;
            }
        }, this);

        return isValid;
    }
});
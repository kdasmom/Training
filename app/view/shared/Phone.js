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
        FIELDS     : ['COUNTRYCODE','NUMBER']
    },

    label : 'Phone Number',

    initComponent: function() {
        // Apply default configuration
        Ext.applyIf(this, {
            /**
             * @cfg {String} [phone_countrycode=""] Value to populate the area code
             */
            phone_countrycode  : '',
            /**
             * @cfg {String} [phone_number=""]      Value to populate the phone number
             */
            phone_number: '',
            /**
             * @cfg {Boolean} [required=false]      Defines if the phone is required or not
             */
            required    : false,
            /**
             * @cfg {String}  [prefix=""]           Prefix for the fields' name config option
             */
            prefix      : ''
        });

        this.items = [];

        var countryCodeWidth = 40, numberWidth = 120, totalWidth = countryCodeWidth + numberWidth + 10;
        this.width = totalWidth;

        this.items.push(
            {
                xtype: 'label',
                text:  this.label + ':',
                cls: 'x-form-item-label x-unselectable x-form-item-label-top'
            },{
                xtype: 'container',
                layout: 'column',
                width: totalWidth,
                defaults: {
                    margin    : '0 5 0 0'
                },
                items: [
                    {
                        xtype      : 'textfield',
                        hideLabel  : true,
                        name       : this.prefix + NP.view.shared.Phone.COUNTRYCODE,
                        allowBlank : !this.required,
                        width      : countryCodeWidth,
                        maxLength  : 25,
                        value      : this.phone_countrycode,
                        regex      : /^\d{3}$/,
                        hideTrigger: true
                    },{
                        xtype      : 'textfield',
                        hideLabel  : true,
                        name       : this.prefix + NP.view.shared.Phone.NUMBER,
                        width      : numberWidth,
                        maxLength  : 25,
                        value      : this.phone_number,
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
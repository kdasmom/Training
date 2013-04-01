/**
 *
 * A custom container that shows a phone block, including area code and number fields
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.Phone', {
    extend: 'Ext.container.Container',
    alias: 'widget.shared.phone',
    
    statics: {
        AREA : 'phone_area',
        NUMBER : 'phone_number',
        FIELDS: ['AREA','NUMBER']
    },

    label : 'Phone Number',

    initComponent: function() {
        // Apply default configuration
        Ext.applyIf(this, {
            /**
             * @cfg {String} [phone_area=""]  Value to populate the area code
             */
            phone_area  : '',
            /**
             * @cfg {String} [phone_number=""] Value to populate the phone number
             */
            phone_number: '',
            /**
             * @cfg {Boolean} [required=false] Defines if the phone is required or not
             */
            required    : false,
            /**
             * @cfg {String}  [prefix=""]      Prefix for the fields' name config option
             */
            prefix      : ''
        });

        this.items = [];

        this.items.push(
            {
                xtype: 'label',
                text:  this.label
            },{
                xtype: 'container',
                layout: 'hbox',
                defaults: {
                    xtype     : 'numberfield',
                    margin    : '0 5 0 0'
                },
                items: [
                    {
                        hideLabel  : true,
                        name       : this.prefix + NP.view.shared.Person.AREA,
                        allowBlank : !this.required,
                        width      : 40,
                        value      : this.phone_area,
                        regex      : /^\d{3}$/,
                        hideTrigger: true
                    },{
                        hideLabel  : true,
                        name       : this.prefix + NP.view.shared.Person.NUMBER,
                        width      : 80,
                        value      : this.phone_number,
                        regex      : /^\d{7}$/,
                        hideTrigger: true
                    }
                ]
            }
        );

        this.callParent(arguments);
    },

    getField: function(name) {
        return this.query('[name="' + this.prefix + NP.view.shared.Phone[name] + '"]')[0];
    },

    getArea: function() {
        return this.getField('AREA');
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
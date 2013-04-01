/**
 * A custom container that shows a person block, including first, middle, and last name fields
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.Person', {
    extend: 'Ext.container.Container',
    alias: 'widget.shared.person',
    
    statics: {
        FNAME : 'person_firstname',
        MNAME : 'person_middlename',
        LNAME : 'person_lastname',
        FIELDS: ['FNAME','MNAME','LNAME']
    },

    firstNameFieldText : 'First Name',
    middleNameFieldText: 'Middle',
    lastNameFieldText  : 'Last Name',

    initComponent: function() {
        // Apply default configuration
        Ext.applyIf(this, {
            /**
             * @cfg {String} [person_firstname=""]  Value to populate the first line of street address with
             */
            person_firstname : '',
            /**
             * @cfg {String} [person_middlename=""] Value to populate the second line of street address with
             */
            person_middlename: '',
            /**
             * @cfg {String} [person_lastname=""]   Value to populate the city field with
             */
            person_lastname  : '',
            /**
             * @cfg {Boolean} [required=false]           Defines if the address block is required or not
             */
            required         : false,
            /**
             * @cfg {String}  [prefix=""]                Prefix for the fields' name config option
             */
            prefix           : ''
        });

        this.items = [];

        this.items.push({
            xtype: 'container',
            layout: 'hbox',
            defaults: {
                xtype     : 'textfield',
                labelAlign: 'top',
                margin    : '0 5 0 0'
            },
            items: [
                {
                    fieldLabel: this.firstNameFieldText,
                    name      : this.prefix + NP.view.shared.Person.FNAME,
                    allowBlank: !this.required,
                    width     : 150,
                    value     : this.person_firstname
                },{
                    fieldLabel: this.middleNameFieldText,
                    name      : this.prefix + NP.view.shared.Person.MNAME,
                    width     : 80,
                    value     : this.person_middlename
                },{
                    fieldLabel: this.lastNameFieldText,
                    name      : this.prefix + NP.view.shared.Person.LNAME,
                    allowBlank: !this.required,
                    width     : 150,
                    value     : this.person_lastname
                }
            ]
        });

        this.callParent(arguments);
    },

    getField: function(name) {
        return this.query('[name="' + this.prefix + NP.view.shared.Person[name] + '"]')[0];
    },

    getFirstName: function() {
        return this.getField('FNAME');
    },

    getMiddleName: function() {
        return this.getField('MNAME');
    },

    getLastName: function() {
        return this.getField('LNAME');
    },

    validate: function() {
        var isValid = true;
        Ext.each(NP.view.shared.Person.FIELDS, function(field) {
            var valid = this.getField(field).validate();
            if (!valid) {
                isValid = false;
            }
        }, this);

        return isValid;
    }
});
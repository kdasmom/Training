/**
 * My Settings: User Information : User Contact Info
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.UserContactInfo', {
    extend: 'Ext.container.Container',
    alias: 'widget.user.usercontactinfo',
    
    requires: [
        'NP.view.shared.Person',
        'NP.view.shared.Address',
        'NP.view.shared.Phone'
    ],

    title: 'User Details',

    autoScroll: true,

    initComponent: function() {
    	var labelWidth = 150;
    	
        this.items = [
            {
                xtype: 'fieldcontainer',
                fieldLabel: "User's Name",
                items: [{ xtype: 'shared.person', required: true }]
            },{
                xtype: 'fieldcontainer',
                fieldLabel: 'Current Address',
                defaults: {
                    labelAlign: 'top'
                },
                items: [
                    { xtype: 'shared.address' },
                    {
                        xtype     : 'textfield',
                        fieldLabel: 'Email Address',
                        name      : 'email_address',
                        width     : 250
                    },{
                        xtype: 'shared.phone',
                        label: 'Home Phone',
                        prefix: 'home_'
                    },{
                        xtype: 'shared.phone',
                        label: 'Business Phone',
                        prefix: 'work_'
                    }
                ]
            }
        ];

    	this.callParent(arguments);
    }
});
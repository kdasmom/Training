/**
 * My Settings: User Delegation main page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.UserDelegationMain', {
	extend: 'Ext.panel.Panel',
    alias: 'widget.user.userdelegationmain',
    
    requires: [
    	'NP.view.shared.button.New',
    	'NP.view.user.UserDelegationGrid'
    ],

	layout: {
        type : 'vbox',
        align: 'stretch'
    },

    border: false,

    addDelegationText : 'Add a Delegation',
	delegationFromText: 'Users you delegated to',
	delegationToText  : 'Users who delegated to you',

	initComponent: function() {
    	var bar = [
	    	 { xtype: 'shared.button.new', text: this.addDelegationText }
	    ];
	    this.tbar = bar;
	    this.bbar = bar;

	    this.items = [
            { xtype: 'user.userdelegationgrid', toOrFrom: 'from', flex: 1, title: this.delegationFromText },
            { xtype: 'user.userdelegationgrid', toOrFrom: 'to', flex: 1, title: this.delegationToText }
        ];

    	this.callParent(arguments);
    }
});
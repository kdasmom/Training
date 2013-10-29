/**
 * My Settings: User Delegation main page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.UserDelegationMain', {
	extend: 'Ext.panel.Panel',
    alias: 'widget.user.userdelegationmain',
    
    requires: [
        'NP.lib.core.Translator',
    	'NP.view.shared.button.New',
    	'NP.view.user.UserDelegationGrid'
    ],

	layout: {
        type : 'vbox',
        align: 'stretch'
    },

    border: false,

    initComponent: function() {
    	var bar = [
	    	 { xtype: 'shared.button.new', text: NP.Translator.translate('Add a Delegation') }
	    ];
	    this.tbar = bar;
	    this.bbar = bar;

	    this.items = [
            {
                xtype   : 'user.userdelegationgrid',
                toOrFrom: 'from',
                flex    : 1,
                title   : NP.Translator.translate('Users you delegated to')
            },{
                xtype   : 'user.userdelegationgrid',
                toOrFrom: 'to',
                flex    : 1,
                title   : NP.Translator.translate('Users who delegated to you')
            }
        ];

    	this.callParent(arguments);
    }
});
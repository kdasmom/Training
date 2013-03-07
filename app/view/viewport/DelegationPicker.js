Ext.define('NP.view.viewport.DelegationPicker', function () {
	return {
        extend: 'Ext.panel.Panel',
        alias: 'widget.viewport.delegationpicker',
        
        requires: ['NP.lib.ui.ComboBox','NP.lib.core.Config','NP.lib.core.Security'],

        signedOnText: 'You are signed on as',

        initComponent: function() {
            var that = this;
            this.items = [];
            
            // If no defaults are set, create the blank default object
            Ext.applyIf(this, {
                defaults: {}
            });

            // If no default styles are set for the panel's items, use the same as the panel
            Ext.applyIf(this.defaults, {
                style: this.style,
                bodyStyle: this.bodyStyle,
                border: false
            });
            
            // Left column indicates the user logged in
            var delegationStore = Ext.StoreManager.lookup('user.Delegations');
            this.items.push({
                flex  : 1,
                html  : this.signedOnText + ': ' + NP.lib.core.Security.getUser().get('userprofile_username'),
                hidden: (delegationStore.getTotalCount() == 0) ? false : true,
                margin: '4 0 4 0'
            },{
                flex  : 1,
                layout: {
                    type : 'hbox',
                    align: 'middle'
                },
                items : {
                    xtype            : 'customcombo',
                    fieldLabel       : this.signedOnText,
                    labelWidth       : 120,
                    store            : delegationStore,
                    selectFirstRecord: true,
                    displayField     : 'userprofile_username',
                    valueField       : 'userprofile_id',
                    value            : NP.lib.core.Security.getUser().get('userprofile_id'),
                    hidden           : (delegationStore.getTotalCount() == 0) ? true : false,
                    margin: '2 0 2 0',
                    listeners        : {
                        change: function(combo) {
                            // If the user is changed via delegation, change the user on the server and re-create the entire Viewport
                            // so that things like the top menu get re-rendered with the proper things showing based on permissions
                            var userprofile_id = combo.getValue();
                            NP.lib.core.Security.changeUser(userprofile_id, function() {
                                var viewport = Ext.ComponentQuery.query('viewport')[0];
                                Ext.destroy(viewport);
                                Ext.create('NP.view.Viewport');
                                window.location = '#';
                            });
                        }
                    }
                }
            });

            this.callParent(arguments);
        }
    }
});
Ext.define('NP.view.TopToolbar', function () {
	return {
        extend: 'Ext.panel.Panel',
        alias: 'widget.toptoolbar',
        
        requires: ['NP.core.Config','NP.core.Security'],

        border: false,
        style: 'background-color: #DFE8F6',
        bodyStyle: 'background-color: #DFE8F6',

        padding: '2 0 2 0',

        defaults: {
            border: false,
            margin: '0 0 0 15',
            bodyStyle: 'background-color: #DFE8F6'
        },

        items: [],
        initComponent: function() {
            var that = this;

            // Left column indicates the user logged in
            var delegationStore = Ext.StoreManager.lookup('user.UserDelegations');
            this.items.push({
                flex  : 1,
                html  : 'You are signed on as: ' + NP.core.Security.getUser().get('userprofile_username'),
                hidden: (delegationStore.getTotalCount() == 0) ? false : true
            },{
                flex  : 1,
                layout: {
                    type : 'hbox',
                    align: 'middle'
                },
                border: false,
                items : {
                    xtype            : 'customcombo',
                    itemId           : '__topToolbarUserDelegations',
                    fieldLabel       : 'You are signed on as',
                    labelWidth       : 120,
                    store            : delegationStore,
                    selectFirstRecord: true,
                    displayField     : 'userprofile_username',
                    valueField       : 'userprofile_id',
                    hidden           : (delegationStore.getTotalCount() == 0) ? true : false,
                    listeners        : {
                        select: function() {
                            
                        }
                    }
                }
            });

            this.callParent(arguments);
        }
    }
});
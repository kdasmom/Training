/**
 * The invoice/PO route window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.RouteWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.shared.invoicepo.routewindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
        'NP.view.shared.UserCombo',
    	'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save',
        'Ext.form.Panel',
        'NP.store.user.Userprofiles'
    ],

    layout     : 'fit',
    width      : 480,
    height     : 240,
    border     : false,
    modal      : true,
    minimizable: false,
    autoScroll : true,

    // Type can be set to invoice or po
    type: null,

    initComponent: function() {
    	var me = this;

        if (!Ext.Array.contains(['invoice','po'], me.type)) {
            throw 'The "type" config is required and must be set to either "invoice" or "po"';
        }

        me.title = NP.Translator.translate('Route');

        var userStore = Ext.create('NP.store.user.Userprofiles', {
            service    : 'UserService',
            action     : 'getValidRouteApprovers',
            extraParams: {
                property_id: me.property_id,
                table_name : me.type
            },
            autoLoad   : true
        });

        me.items = [{
            xtype      : 'form',
            bodyPadding: 8,
            layout     : {
                type : 'vbox',
                align: 'stretch'
            },
            tbar: [
                { xtype: 'shared.button.cancel', handler: function() { me.close(); } },
                { itemId: me.type + 'RouteSaveBtn', iconCls: 'route-btn', text: NP.Translator.translate('Route') }
            ],
            items      : [
                {
                    xtype : 'component',
                    html  : NP.Translator.translate('Please select up to three users who need to approve this Invoice in addition to the standard workflow routing.'),
                    margin: '0 0 8 0'
                }
            ]
        }];

        for (var i=1; i<=3; i++) {
            me.items[0].items.push({
                xtype       : 'shared.usercombo',
                fieldLabel  : NP.Translator.translate('User ' + i),
                name        : 'userprofilerole_id' + i,
                valueField  : 'userprofilerole_id',
                labelWidth  : 65,
                allowBlank  : (i === 1) ? false : true,
                store       : userStore
            });
        }

    	me.callParent(arguments);
    },

    getSelectedUsers: function() {
        var me    = this,
            form  = me.down('form').getForm(),
            users = [],
            id;

        for (var i=1; i<=3; i++) {
            id = form.findField('userprofilerole_id' + i).getValue();
            if (id !== null) {
                users.push(id);
            }
        }

        return users;
    },

    isValid: function() {
        var me      = this,
            form    = me.down('form').getForm(),
            isValid = form.isValid(),
            users   = [],
            field;

        for (var i=1; i<=3; i++) {
            field = form.findField('userprofilerole_id' + i);
            id    = field.getValue();
            if (id !== null) {
                if (Ext.Array.contains(users, id)) {
                    field.markInvalid(NP.Translator.translate('Cannot route to the same user twice.'));
                    isValid = false;
                    break;
                } else {
                    users.push(id);
                }
            }
        }

        return isValid;
    }
});
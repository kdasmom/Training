Ext.define('NP.lib.ui.ListPicker', {
    extend: 'Ext.form.FieldContainer',
    mixins: {
        field: 'Ext.form.field.Field'
    },
    alias: 'widget.listpicker',
    
    requires: ['Ext.view.BoundList'],
    
    title       : 'Name',
    displayField: 'name',
    valueField  : 'id',
    disabled    : false,
    
    layout: 'anchor',
    
    tbar: null,
    listConfig: {},
    
    initComponent: function() {
        var me = this;
        
        me.typedText = '';

        me.items = me.setupItems();
        
        me.callParent(arguments);

        me.boundList.on('itemdblclick', Ext.bind(me.onItemDblClick, me));
        me.boundList.on('render', function() {
            Ext.create('Ext.view.BoundListKeyNav', me.boundList.getEl(), {
                boundList: me.boundList,
                processEvent: function(e, el) {
                    me.onItemKeyDown(me.boundList, e);
                    return false;
                }
            });
        });
    },
    
    setupItems: function() {
        var me = this;

        me.boundList = Ext.create('Ext.view.BoundList', Ext.apply({
            anchor: 'none 100%',
            deferInitialRefresh: false,
            border: 1,
            multiSelect: true,
            store: me.store,
            displayField: me.displayField,
            valueField: me.valueField,
            disabled: me.disabled
        }, me.listConfig));
        
        // Wrap to add a title
        me.boundList.border = false;
        
        return {
            border: true,
            anchor: 'none 100%',
            layout: 'anchor',
            title: me.title,
            tbar: me.tbar,
            items: me.boundList
        };
    },
    
    getStore: function() {
    	return this.store;
    },
    
    getSelectionModel: function() {
    	return this.boundList.getSelectionModel();
    },
    
    onItemDblClick: function(boundList, record, item, index, e, eOpts) {
        this.fireEvent('itemdblclick', this, boundList, record, item, index, e, eOpts);
    },
    
    onItemKeyDown: function(boundList, e) {
        var me = this;
        
        if (!e.isSpecialKey() || e.getCharCode() == Ext.EventObject.SPACE) {
            me.typedText += String.fromCharCode(e.getCharCode()).toLowerCase();
            me.lastTyping = Date.now();
        }
        if (me.typedText.length) {
            setTimeout(function() {
                if (Date.now() - me.lastTyping >= 500) {
                    var typedLen  = me.typedText.length,
                        listStore = boundList.getStore(),
                        matchRow  = listStore.findBy(function(rec) {
                            var recVal = rec.get(me.displayField).toLowerCase();
                            if (recVal.substring(0, typedLen) == me.typedText) {
                                return true;
                            }
                        });
                    
                    if (matchRow != -1) {
                        boundList.getSelectionModel().select(matchRow);
                    }
                    
                    me.lastTyping = 0;
                    me.typedText = '';
                }
            }, 500);
        }
    }
});
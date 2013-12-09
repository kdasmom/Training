Ext.define('NP.lib.ui.Assigner', {
    extend: 'Ext.form.FieldContainer',
    mixins: {
        field: 'Ext.form.field.Field'
    },
    alias: 'widget.assigner',
    
    requires: ['NP.lib.ui.ListPicker','Ext.data.AbstractStore'],
    
    displayField: 'name',
    valueField  : 'id',
    
    layout: 'fit',

    initComponent: function() {
        var me = this;
        
        if (Ext.isString(me.store)) {
            me.store = Ext.getStore(me.store);
        } else if (Ext.isObject(me.store)) {
            me.store = Ext.data.AbstractStore.create(me.store);
        }

        me.fromField = me.createListPicker(true);
        me.toField = me.createListPicker(false);
        
        me.items = [{
            xtype: 'container',
            layout: {
                type : 'hbox',
                align: 'stretch'
            },
            items: [
                me.fromField,
                me.getButtons(),
                me.toField
            ]
        }];
        
        me.store.on({
            beforeload: Ext.bind(me.onBeforeStoreLoad, me),
            load: Ext.bind(me.onStoreLoad, me)
        });

        me.callParent(arguments);
    },
    
    getStore: function() {
        return this.store;
    },

    createListPicker: function(isFrom) {
        var me    = this,
            store = Ext.create(Ext.getClassName(me.store)),
            title = (isFrom) ? me.fromTitle : me.toTitle,
            listConfig = {};
        
        if (isFrom && me.store.getCount()) {
            store.add(me.store.getRange());
        } else if (!isFrom) {
            store.removeAll();
        }
        
        if (me.tpl) {
            listConfig.tpl = me.tpl;
        }

        return Ext.create('NP.lib.ui.ListPicker', {
            title       : title,
            displayField: me.displayField,
            valueField  : me.valueField,
            store : store,
            listConfig: listConfig,
            flex  : 1,
            listeners: {
                itemdblclick: Ext.bind(me.onItemDblClick, me)
            }
        });
    },
    
    getButtons: function() {
        var me = this;
        
        return {
            xtype: 'container',
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack : 'center'
            },
            margin  : '0 8 0 8',
            defaults: { margin: '0 0 8 0' },
            items: [
                { xtype: 'button', text: '>>', handler: function() { me.onMoveClick('right', true) } },
                { xtype: 'button', text: '>', handler: function() { me.onMoveClick('right', false) } },
                { xtype: 'button', text: '<', handler: function() { me.onMoveClick('left', false) } },
                { xtype: 'button', text: '<<', handler: function() { me.onMoveClick('left', true) } }
            ]
        };
    },
    
    onBeforeStoreLoad: function() {
        var me   = this;
        me.mask = new Ext.LoadMask({ target: me.down('container') });
        me.mask.show();
    },

    onStoreLoad: function() {
        var me        = this,
            fromStore = me.fromField.getStore(),
            toStore   = me.toField.getStore(),
            recCount  = me.store.getCount(),
            rec, i;

        Ext.suspendLayouts();

        fromStore.removeAll();

        if (toStore.getCount()) {
            for (i=0; i<recCount; i++) {
                rec = me.store.getAt(i);
                if (toStore.find(me.valueField, rec.get(me.valueField)) == -1) {
                    fromStore.add(rec);
                }
            }

            recCount = toStore.getCount();
            for (i=0; i<recCount; i++) {
                rec = toStore.getAt(i);
                if (me.store.find(me.valueField, rec.get(me.valueField)) == -1) {
                    i--;
                    recCount--;
                    toStore.remove(rec);
                }
            }
        } else {
            fromStore.add(me.store.getRange());
        }
        
        Ext.resumeLayouts(true);

        me.mask.destroy();
    },

    onMoveClick: function(direction, copyAll) {
        var me = this,
            from,
            to;
       	
        if (direction == 'right') {
            from = me.fromField;
            to   = me.toField;
        } else {
            from = me.toField;
            to   = me.fromField;
        }
        
        var fromStore = from.getStore(),
            toStore   = to.getStore();
        
        if (copyAll) {
            toStore.add(fromStore.getRange());
            fromStore.removeAll();
            toStore.sort([{ property: me.displayField, direction: 'ASC' }]);
        } else {
            var recs = from.getSelectionModel().getSelection();
            me.moveRecs(fromStore, toStore, recs);
        }
    },
    
    onItemDblClick: function(listPicker, boundList, rec) {
        var me = this,
            fromStore,
            toStore;
       	
        if (listPicker.getId() == me.fromField.getId()) {
            fromStore = me.fromField.getStore();
            toStore = me.toField.getStore();
        } else {
            fromStore = me.toField.getStore();
            toStore = me.fromField.getStore();
        }
        
        me.moveRecs(fromStore, toStore, rec);
    },
    
    moveRecs: function(fromStore, toStore, recs) {
        var me = this;
        
        if (!Ext.isArray(recs)) {
            recs = [recs];
        }
        
        fromStore.remove(recs);
        toStore.add(recs);
        
        toStore.sort([{ property: me.displayField, direction: 'ASC' }]);
    },
    
    getValue: function() {
        return this.toField.getStore().getRange();
    },

    setValue: function(vals) {
        var me = this,
            fromStore = me.fromField.getStore(),
            toStore = me.toField.getStore(),
            rec,
            recs = [];
        
        if (me.store.isLoading()) {
            me.store.on({
                load: Ext.bind(me.setValue, me, [vals]),
                single: true
            });
            
            return;
        }
        
        if (!Ext.isArray(vals)) {
            vals = [vals];
        }
        
        Ext.suspendLayouts();
        
        toStore.removeAll();
        fromStore.removeAll();
        fromStore.add(me.store.getRange());

        for (var i=0; i<vals.length; i++) {
            rec = vals[i];
            if (Ext.getClassName(rec) == '') {
                rec = me.store.findRecord(me.valueField, rec);
            } else {
                var found = me.store.findRecord(me.valueField, rec.get(me.valueField));
                if (found === -1) {
                    rec = null;
                }
            }
            
            if (rec !== null) {
                recs.push(rec);
            }
        }
        
        me.moveRecs(fromStore, toStore, recs);

        Ext.resumeLayouts(true);
    },

    getSubmitData: function() {
        var data = {};
        data[this.getName()] = this.getSubmitValue()
        return data;
    },

	getSubmitValue: function() {
		return this.getValue();
	}
});
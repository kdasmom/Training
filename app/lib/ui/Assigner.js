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

    allowBlank: true,
    blankText: 'This field is required',

    initComponent: function() {
        var me = this;
        
        if (Ext.isString(me.store)) {
            me.store = Ext.getStore(me.store);
        } else if (Ext.isObject(me.store)) {
            me.store = Ext.data.AbstractStore.create(me.store);
        }

        me.minHeight = 120;

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
    
    getFromField: function() {
        return this.fromField;
    },
    
    getToField: function() {
        return this.toField;
    },
    
    getFromStore: function() {
        return this.getFromField().getStore();
    },
    
    getToStore: function() {
        return this.getToField().getStore();
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
            allowBlank  : me.allowBlank,
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

        if (me.mask && me.mask.destroy) {
            me.mask.destroy();
        }
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
        var me   = this,
            recs = this.toField.getStore().getRange(),
            vals = [],
            i;

        for (i=0; i<recs.length; i++) {
            vals.push(recs[i].get(me.valueField));
        }

        return vals;
    },

    addValues: function(vals) {
        var me        = this,
            recs      = [],
            rec;
        
        if (!me.store.isLoaded) {
            me.store.on({
                load: Ext.bind(me.addValues, me, [vals]),
                single: true
            });
            
            return;
        }

        if (!Ext.isArray(vals)) {
            vals = [vals];
        }

        Ext.suspendLayouts();

        for (var i=0; i<vals.length; i++) {
            rec = vals[i];
            if (Ext.getClassName(rec) == '') {
                rec = me.store.findRecord(me.valueField, rec);
                if (found === -1) {
                    rec = null;
                }
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
        
        me.moveRecs(me.getFromStore(), me.getToStore(), recs);

        Ext.resumeLayouts(true);
    },

    setValue: function(vals) {
        var me        = this,
            fromStore = me.getFromStore(),
            toStore   = me.getToStore();
        
        if (!me.store.isLoaded) {
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

        me.addValues(vals);

        Ext.resumeLayouts(true);
    },

    getSubmitData: function() {
        var data = {};
        data[this.getName()] = this.getSubmitValue()
        return data;
    },

	getSubmitValue: function() {
		return this.getValue();
	},
    
    getErrors : function(value) {
        var me = this,
            format = Ext.String.format,
            errors = [],
            numSelected;

        value = Ext.Array.from(value || me.getValue());
        numSelected = value.length;

        if (!me.allowBlank && numSelected < 1) {
            errors.push(me.blankText);
        }

        return errors;
    },

    isValid : function() {
        var me = this,
            disabled = me.disabled,
            validate = me.forceValidation || !disabled;
            
        
        return validate ? me.validateValue(me.value) : disabled;
    },
    
    validateValue: function(value) {
        var me = this,
            errors = me.getErrors(value),
            isValid = Ext.isEmpty(errors);
            
        if (!me.preventMark) {
            if (isValid) {
                me.clearInvalid();
            } else {
                me.markInvalid(errors);
            }
        }

        return isValid;
    },
    
    markInvalid : function(errors) {
        // Save the message and fire the 'invalid' event
        var me = this,
            oldMsg = me.getActiveError();
        me.setActiveErrors(Ext.Array.from(errors));
        if (oldMsg !== me.getActiveError()) {
            me.updateLayout();
        }
    },

    /**
     * Clear any invalid styles/messages for this field.
     *
     * __Note:__ this method does not cause the Field's {@link #validate} or {@link #isValid} methods to return `true`
     * if the value does not _pass_ validation. So simply clearing a field's errors will not necessarily allow
     * submission of forms submitted with the {@link Ext.form.action.Submit#clientValidation} option set.
     */
    clearInvalid : function() {
        // Clear the message and fire the 'valid' event
        var me = this,
            hadError = me.hasActiveError();
        me.unsetActiveError();
        if (hadError) {
            me.updateLayout();
        }
    }
});
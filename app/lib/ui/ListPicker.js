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
    
    allowBlank  : true,

    layout: 'anchor',
    
    tbar       : null,
    listConfig : {},
    multiSelect: true,
    
    initComponent: function() {
        var me = this;
        
        me.typedText = '';

        me.items = me.setupItems();
        
        me.callParent(arguments);

        me.addEvents('select','itemdblclick');

        me.boundList.on('select', Ext.bind(me.onSelect, me));
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
            anchor             : 'none 100%',
            deferInitialRefresh: false,
            border             : 1,
            multiSelect        : me.multiSelect,
            store              : me.store,
            displayField       : me.displayField,
            valueField         : me.valueField,
            disabled           : me.disabled,
            componentCls       : (me.allowBlank) ? '' : 'x-form-required-field'
        }, me.listConfig));
        
        // Wrap to add a title
        me.boundList.border = false;
        
        return {
            border: true,
            anchor: 'none 100%',
            layout: 'anchor',
            title : me.title,
            tbar  : me.tbar,
            items : me.boundList
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

    onSelect: function(boundList, rec, eOpts) {
        this.fireEvent('select', this, rec, boundList, eOpts);
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
                            var recVal = rec.get(me.displayField);
                            if (recVal.toLowerCase) {
                                recVal = recVal.toLowerCase();
                                if (recVal.substring(0, typedLen) == me.typedText) {
                                    return true;
                                }
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
    },

    getValue: function() {
        var me   = this,
            recs = me.getSelectionModel().getSelection(),
            vals = [],
            i;

        for (i=0; i<recs.length; i++) {
            vals.push(recs[i].get(me.valueField));
        }

        return vals;
    },

    setValue: function(vals) {
        var me = this,
            store = me.getStore(),
            selModel = me.getSelectionModel(),
            rec,
            recs = [];
        
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
        
        selModel.select(recs);

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
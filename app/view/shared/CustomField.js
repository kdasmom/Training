/**
 * A custom container to display custom fields. This component extends FieldContainer so it supports all config options
 * for that component, along with some additional ones defined.
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.CustomField', {
    extend: 'Ext.form.FieldContainer',
    mixins: {
        field: 'Ext.form.field.Field'
    },
    alias: 'widget.shared.customfield',
    
    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.lib.ui.AutoComplete',
        'NP.lib.ui.ComboBox',
        'NP.model.system.PnUniversalField',
        'NP.store.system.PnUniversalFields'
    ],

    /**
	 * @cfg {String}  entityType Type of entity this custom field is for
	 */
	/**
	 * @cfg {String}  name   The name of the field component
	 */
	/**
	 * @cfg {Number}  number The custom field number
	 */
    /**
	 * @cfg {"text"/"select"/"date"/"checkbox"} type The type of custom field UI
	 */
	type      : 'text',
    /**
	 * @cfg {Boolean} allowBlank Whether or not the field can be blank
	 */
	allowBlank: true,
    /**
	 * @cfg {Object}  fieldCfg   Additional optional configuration options to be applied to the field component
	 */
	fieldCfg  : {},
    /**
	 * @cfg {0/1}     isLineItem Whether we're dealing with invoice/po line items or not; only relevant if 'entityType' is set to 'customInvoicePO'
	 */
	isLineItem: 1,
    /**
     * @cfg {"autocomplete"/"customcombo"} comboUi 
     */
    comboUi: 'autocomplete',

    layout    : 'form',

    initComponent: function() {
        var me = this;

        this.isFormField = true;

    	if (!'entityType' in this) {
    		throw 'The config option "entityType" must be specified';
    	}
    	if (!'name' in this) {
    		throw 'The config option "name" must be specified';
    	}
    	if (this.type == 'select' && !'number' in this) {
    		throw 'The config option "number" must be specified when "type" is set to "select"';
    	}

        var fieldName = this.name + '_internal';
    	var field = {
			name      : fieldName,
			allowBlank: this.allowBlank
		};

    	// Configuration for a text custom field
    	if (this.type == 'text') {
    		Ext.apply(field, {
    			xtype: 'textfield'
    		});
    	// Configuration for a combo custom field
    	} else if (this.type == 'select') {
            var queryMode = (this.comboUi == 'autocomplete') ? 'remote' : 'local';

    		Ext.apply(field, {
				xtype                : this.comboUi,
                queryMode            : queryMode,
				displayField         : 'universal_field_data',
				valueField           : 'universal_field_data',
				store                : Ext.create('NP.store.system.PnUniversalFields', {
					service    : 'ConfigService',
					action     : 'getCustomFieldOptions',
					extraParams: {
						customfield_pn_type   : this.entityType,
						universal_field_number: this.number,
						universal_field_status: [1,2],
						isLineItem            : this.isLineItem
					}
				})
    		});
    		if ('value' in this.fieldCfg) {
    			field.defaultRec = { universal_field_data: this.fieldCfg.value };
    		}
    	} else if (this.type == 'date') {
    		Ext.apply(field, {
				xtype       : 'datefield'
    		});
    	} else if (this.type == 'checkbox') {
    		Ext.apply(field, {
				xtype       : 'checkbox',
				inputValue  : 'on'
    		});
    	}

    	Ext.applyIf(field, this.fieldCfg);

    	this.items = [field];

    	this.callParent(arguments);

        this.field = this.down('[name="'+fieldName+'"]');

        // We need to add some events so that the custom field works in the grid editor
        this.addEvents('specialkey','blur','focus');

        // Subscribe to the field's events and re-fire them from our fieldcontainer component
        this.field.on('specialkey', function(field, e, eOpts) {
            me.fireEvent('specialkey', field, e, eOpts);
        });
        this.field.on('blur', function(field, e, eOpts) {
            me.fireEvent('blur', field, e, eOpts);
        });
        this.field.on('focus', function(field, e, eOpts) {
            me.fireEvent('focus', field, e, eOpts);
        });
    },

    getValue: function() {
        return this.field.getValue();
    },

    setValue: function(val) {
        // If we're dealing with an autocomplete custom field drop down that's not loaded, we need to make sure
        // the record is in the store, so we can add the setDefaultRec() custom method for that
        if (this.type == 'select' && !this.field.getStore().isLoaded) {
            this.field.setDefaultRec(Ext.create('NP.model.system.PnUniversalField', {
                                        universal_field_data: val
                                    }));
        } else {
            if (this.type == 'date' && typeof val == 'string') {
                val = Ext.Date.parse(val, NP.Config.getServerDateFormat());
            }
            this.field.setValue(val);
        }
    },

    getSubmitData: function() {
        var data = {};
        data[this.getName()] = this.getSubmitValue()
        return data;
    },

    focus: function() {
        this.field.focus.apply(this.field, arguments);
    },

    onEditorTab: function(e){
        var keyNav = this.field.listKeyNav;
        
        if (keyNav) {
            keyNav.selectHighlighted(e);
        }
    },

	getSubmitValue: function() {
		return this.getValue();
	}
});
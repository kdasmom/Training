/**
 * A custom container to display custom fields. This component extends FieldContainer so it supports all config options
 * for that component, along with some additional ones defined.
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.CustomField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.shared.customfield',
    
    requires: ['NP.lib.core.Config','NP.lib.core.Security','NP.lib.ui.ComboBox'],

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

    initComponent: function() {
    	if (!'entityType' in this) {
    		throw 'The config option "entityType" must be specified';
    	}
    	if (!'name' in this) {
    		throw 'The config option "name" must be specified';
    	}
    	if (this.type == 'select' && !'number' in this) {
    		throw 'The config option "number" must be specified when "type" is set to "select"';
    	}

    	var field = {
			name      :  this.name,
			allowBlank: this.allowBlank
		};

    	// Configuration for a text custom field
    	if (this.type == 'text') {
    		Ext.apply(field, {
    			xtype: 'textfield'
    		});
    	// Configuration for a combo custom field
    	} else if (this.type == 'select') {
    		Ext.apply(field, {
				xtype                : 'customcombo',
				displayField         : 'universal_field_data',
				valueField           : 'universal_field_data',
				value                : 'testing',
				loadStoreOnFirstQuery: true,
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
    }
});
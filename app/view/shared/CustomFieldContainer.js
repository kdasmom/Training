/**
 * A custom container for custom fields to be shown on an entity
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.CustomFieldContainer', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.shared.customfieldcontainer',

    requires: [
    	'NP.lib.core.Config',
    	'NP.view.shared.CustomField'
    ],

    /**
	 * @cfg {String}  type Type of entity this custom field is for; valid values are 'invoice' or 'po'
	 */
	type: 'invoice',

    /**
	 * @cfg {0/1}     isLineItem Whether we're dealing with invoice/po line items or not; only relevant if 'entityType' is set to 'customInvoicePO'
	 */
	isLineItem: 0,

	/**
	 * @cfg boolean     useColumns Whether or not to display the custom fields in columns
	 */
	useColumns: true,

	labelAlign: 'top',

	fieldCfg: {},

    initComponent: function() {
    	var me = this,
    		customFields = NP.Config.getCustomFields(),
    		maxPerCol,
    		colItemCount = 0,
    		colItems;

    	customFields = (me.isLineItem) ? customFields.line : customFields.header;

    	me.type = me.type.substring(0, 3);
    	
    	if (customFields[me.type + 'OnCount'] == 1) {
    		me.useColumns = false;
    	}

    	if (me.useColumns) {
    		maxPerCol = Math.ceil(customFields[me.type + 'OnCount'] / 2);

    		me.layout = {
				type : 'hbox',
				align: 'stretch'
		    };
    	} else {
    		me.layout = 'form';
    	}

    	me.items = [];

    	Ext.Object.each(customFields.fields, function(fieldNum, fieldObj) {
    		// Only add the field if it's turned on
            if (fieldObj[me.type + 'On']) {
            	if (me.useColumns && colItemCount % maxPerCol === 0) {
	    			colItems = [];
	    		} else if (colItemCount === 0) {
	    			colItems = [];
	    		}
	        	
            	colItems.push(Ext.apply({
		            xtype     : 'shared.customfield',
		            fieldLabel: fieldObj.label,
		            labelAlign: me.labelAlign,
		            entityType: 'customInvoicePO',
		            type      : fieldObj.type,
		            isLineItem: me.isLineItem,
		            name      : 'universal_field' + fieldNum,
		            number    : fieldNum,
		            allowBlank: !fieldObj[me.type + 'Required']
		        }, me.fieldCfg));

		        colItemCount++;
		        if (me.useColumns && colItemCount % maxPerCol === 0) {
		        	me.items.push({
						xtype : 'container',
						flex  : 1,
						layout: 'form',
						margin: (me.items.length == 0) ? '0 16 0 0' : 0,
						items : colItems
		        	});
		        }
            }
        });
		
		if (!me.useColumns) {
			me.items = colItems;
		}

        this.callParent(arguments);
    }
});
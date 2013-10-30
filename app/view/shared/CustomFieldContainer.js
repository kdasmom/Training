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

    layout: {
		type : 'hbox',
		align: 'stretch'
    },

    /**
	 * @cfg {String}  type Type of entity this custom field is for; valid values are 'invoice' or 'po'
	 */
	type: 'invoice',

    /**
	 * @cfg {0/1}     isLineItem Whether we're dealing with invoice/po line items or not; only relevant if 'entityType' is set to 'customInvoicePO'
	 */
	isLineItem: 0,

    initComponent: function() {
    	var me = this,
    		customFields = NP.Config.getCustomFields(),
    		maxPerCol,
    		colItemCount = 0,
    		colItems;

    	customFields = (me.isLineItem) ? customFields.line : customFields.header;

    	me.type = me.type.substring(0, 3);
    	maxPerCol = Math.ceil(customFields[me.type + 'OnCount'] / 2);

    	me.items = [];

    	Ext.Object.each(customFields.fields, function(fieldNum, fieldObj) {
    		// Only add the field if it's turned on
            if (fieldObj[me.type + 'On']) {
            	if (colItemCount % maxPerCol === 0) {
	    			colItems = [];
	    		}
	        	
            	colItems.push({
		            xtype     : 'shared.customfield',
		            fieldLabel: fieldObj.label,
		            labelAlign: 'top',
		            entityType: 'customInvoicePO',
		            type      : fieldObj.type,
		            isLineItem: me.isLineItem,
		            name      : 'universal_field' + fieldNum,
		            number    : fieldNum,
		            allowBlank: !fieldObj[me.type + 'Required']
		        });

		        colItemCount++;
		        if (colItemCount % maxPerCol === 0) {
		        	me.items.push({
						xtype : 'container',
						flex  : 1,
						layout: 'form',
						margin: (colItemCount == maxPerCol) ? '0 16 0 0' : 0,
						items : colItems
		        	});
		        }
            }
        });

        this.callParent(arguments);
    }
});
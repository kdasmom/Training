/**
 * Import/Export Utility > GL tab > GL Code 
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.importing.UploadForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.importing.uploadform',
    
    requires: [
    	'NP.lib.core.Translator',
    	'NP.view.shared.button.Upload'
    ],
    
    border: false,
    bodyPadding: 8,

    layout: 'vbox',

    initComponent: function() {
        var instructions = '<b>Please Note:</b>',
			me = this,
			buttons = [];

		if (this.entityName == 'Custom Field Header' || this.entityName == 'Custom Field Line') {
			buttons = [
				{
					xtype: 'shared.button.cancel'
				}
			];
		}

		buttons.push({xtype: 'shared.button.upload'});

        this.tbar = buttons;

        if ('instructions' in this) {
            if (!Ext.isEmpty(this.instructions)) {
                instructions += ' ' + this.instructions;
            } else {
                instructions = null;
            }
        } else {
            instructions = instructions + ' This upload tool is for new ' + this.entityName + ' only. ' +
                        'Any changes to the existing ' + this.entityName + 
                        ' should be made directly in ' + this.sectionName + '.';
        }

        this.items = [];

        if (!Ext.isEmpty(instructions)) {
            this.items.push({
                xtype : 'component',
                html  : instructions,
                margin: '0 0 8 0'
            });
        }

		formitems = [];

		if (this.entityName == 'Custom Field Header') {
			formitems.push(
				{
					xtype       : 'customcombo',
					name        : 'fieldnumber',
					displayField: 'controlpanelitem_value',
					valueField  : 'customfieldnumber',
					fieldLabel  : NP.Translator.translate('Custom Field Value'),
					labelWidth  : 140,
					width       : 600,
					allowBlank  : false,
					store       : Ext.create('NP.lib.data.Store', {
						service : 'ConfigService',
						action  : 'getHeadersValues',
						fields  : ['customfieldnumber', 'controlpanelitem_value'],
						autoLoad: true
					})
				}
			);
		}
		if (this.entityName == 'Custom Field Line') {
			formitems.push(
				{
					xtype       : 'customcombo',
					name        : 'fieldnumber',
					displayField: 'controlpanelitem_value',
					valueField  : 'customfieldnumber',
					fieldLabel  : NP.Translator.translate('Custom Field Value'),
					labelWidth  : 140,
					width       : 600,
					allowBlank  : false,
					store       : Ext.create('NP.lib.data.Store', {
						service : 'ConfigService',
						action  : 'getLineValues',
						fields  : ['customfieldnumber', 'controlpanelitem_value'],
						autoLoad: true
					})
				}
			);
		}

		formitems.push(
			{
				xtype: 'component',
				html: '<p>' + NP.Translator.translate('Select a valid CSV file to upload:') + '</p>'
			}
		);
		formitems.push(
			{
				xtype: 'filefield',
				name: this.fieldName,
				width: 400,
				hideLabel: true,
				allowBlank: false
			}
		);

        this.items.push(
            {
                itemId: 'form_upload',
                xtype: 'form',
                autoScroll: true,
                border: false,
                bodyPadding: 8,
                items: formitems
            }
        );

        this.callParent(arguments);
    }

});
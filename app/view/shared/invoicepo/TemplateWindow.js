/**
 * The invoice/PO template scheduling window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.TemplateWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.shared.invoicepo.templatewindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
        'Ext.form.Panel',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save'
    ],

    layout     : 'fit',
    width      : 480,
    height     : 300,
    border     : false,
    modal      : true,
    minimizable: false,
    autoScroll : true,

    // Type can be set to invoice or po
    type: null,

    // Type can be set to invoice or po
    status: null,

    initComponent: function() {
    	var me = this;

        if (!Ext.Array.contains(['invoice','po'], me.type)) {
            throw 'The "type" config is required and must be set to either "invoice" or "po"';
        }

        me.title = NP.Translator.translate(me.title);

        var fields = [{
            xtype     : 'textfield',
            fieldLabel: NP.Translator.translate('Template Name'),
            labelAlign: 'top',
            name      : 'template_name',
            width     : 300,
            maxLength : 100,
            allowBlank: false
        }];

        if (me.type == 'invoice') {
            fields.push({
                xtype         : 'checkbox',
                name          : 'save_invoice_number',
                boxLabel      : 'Save Invoice Number on template?',
                inputValue    : 1,
                uncheckedValue: 0
            });
        }

        if (me.showImageOptions) {
            var imageOptions = [];
            if (me.status !== 'draft') {
                imageOptions.push(
                    {
                        boxLabel  : NP.Translator.translate('Save Template with Image and continue processing'),
                        inputValue: 'saveWithAndContinue',
                        checked   : true
                    },{
                        boxLabel  : NP.Translator.translate('Save Template without Image and continue processing'),
                        inputValue: 'saveWithoutAndContinue'
                    }
                );
            }

            imageOptions.push(
                {
                    boxLabel  : NP.Translator.translate('Save Template with Image'),
                    inputValue: 'saveWith',
                    checked   : (me.status === 'draft') ? true : false
                },{
                    boxLabel  : NP.Translator.translate('Save Template without Image'),
                    inputValue: 'saveWithOut'
                }
            );

            fields.push({
                xtype      : 'panel',
                title      : NP.Translator.translate('What do you want to do?'),
                layout     : 'fit',
                bodyPadding: 8,
                margin     : '8 0 0 0',
                items      : [{
                    xtype : 'radiogroup',
                    layout: 'vbox',
                    defaults: { name: 'include_images' },
                    items : imageOptions
                }]
            });
        }

        me.items = [{
            xtype : 'form',
            bodyPadding: 8,
            tbar  : [
                { xtype: 'shared.button.cancel', handler: function() { me.close(); } },
                { xtype: 'shared.button.save' }
            ],
            layout: {
                type : 'vbox',
                align: 'stretch'
            },
            items: fields
        }];

        me.callParent(arguments);
    }
});
/**
 * System Setup: Login Page section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.systemSetup.LoginPage', {
    extend: 'Ext.form.Panel',
    alias: 'widget.systemsetup.loginpage',

    requires: [
    	'NP.lib.core.Config',
    	'NP.lib.core.Translator',
    	'NP.view.shared.button.Save',
    	'NP.view.shared.button.Delete'
    ],
    
    title: 'Login Page',

    instructionsText: 'The maximum image dimensions for the logo is 500 pixels wide by 170 pixels high. The system will center and retain the aspect ratio of your uploaded image. Acceptable image file formats are .jpeg or .jpg.',
    logoText        : 'Current Logo',

    bodyPadding: 8,

    initComponent: function() {
    	var me = this;

    	me.title = NP.Translator.translate(me.title);

    	me.tbar = [
            { xtype: 'shared.button.save', itemId: 'saveClientLogoBtn' },
            { xtype: 'shared.button.delete', itemId: 'removeClientLogoBtn', disabled: true }
        ];

        me.items = [
            {
                xtype: 'displayfield',
                hideLabel: true,
                value: NP.Translator.translate(me.instructionsText)
            },{
                xtype     : 'filefield',
                name      : 'logo_file',
                fieldLabel: 'File',
                width     : 400,
                allowBlank: false
            },{
                xtype : 'container',
                itemId: 'logoImgContainer',
                margin: '20 0 0 0',
                layout: {
                    type: 'vbox'
                },
                hidden: true,
                items: [
                    {
                        xtype    : 'displayfield',
                        hideLabel: true,
                        value    : '<b>' + NP.Translator.translate(me.logoText) + '</b>',
                        flex     : 1
                    },{
                        xtype: 'image',
                        src  : '',
                        flex : 1
                    }
                ]
            }
        ];

    	me.callParent(arguments);
    },

    setLogoFile: function(filename) {
    	var me        = this,
    		container = me.down('#logoImgContainer'),
    		imgComp   = me.down('image'),
    		removeBtn = me.down('#removeClientLogoBtn');

    	if (Ext.isEmpty(filename)) {
    		imgComp.setSrc('');
	    	container.hide();
	    	removeBtn.disable();
    	} else {
    		imgComp.setSrc('clients/' + NP.Config.getAppName() + '/web/images/logos/' + filename);
	    	container.show();
	    	removeBtn.enable();
	    	imgComp.updateLayout();
    	}
    }
});
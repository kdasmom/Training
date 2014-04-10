/**
 * The reclass log part of the invoice view page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.ViewReclass', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.invoice.viewreclass',

    requires: [
        'NP.lib.core.Config'
    ],

    frame      : true,
    bodyPadding: 0,

    initComponent: function() {
    	var me = this;

    	me.title = NP.Translator.translate('Reclass Notes');

    	me.store = {
            type   : 'invoice.auditreclasses',
            service: 'InvoiceService',
            action : 'getReclassNotes'
        };

        me.columns = {
            items: [
                {
                	xtype    : 'datecolumn',
                    text     : NP.Translator.translate('Date'),
                    dataIndex: 'auditreclass_date',
                    format   : NP.Config.getDefaultDateTimeFormat(),
                    flex     : 0.1
                },{
                    text     : NP.Translator.translate('User'),
                    dataIndex: 'userprofile_username',
                    flex     : 0.1,
                    renderer: function(val, meta, rec) {
                    	var userprofile_id               = rec.get('userprofile_id'),
                    		delegation_to_userprofile_id = rec.get('delegation_to_userprofile_id');
                    	
                    	if (
                    		userprofile_id !== delegation_to_userprofile_id
                    		&& userprofile_id !== null 
                    		&& delegation_to_userprofile_id !== null
                    	) {
                    		val += ' (done by ' + rec.get('delegation_to_userprofile_username') +
                    				' on behalf of ' + rec.get('userprofile_username') + ')'
                    	}

                    	return val;
                    }
                },{
                    text     : NP.Translator.translate('Field'),
                    dataIndex: 'field_display',
                    flex     : 0.2
                },{
                    text     : NP.Translator.translate('Old Value'),
                    dataIndex: 'old_val',
                    flex     : 0.2
                },{
                    text     : NP.Translator.translate('New Value'),
                    dataIndex: 'new_val',
                    flex     : 0.2
                },{
                    text     : NP.Translator.translate('Notes'),
                    dataIndex: 'audit_note',
                    flex     : 0.2
                }
            ]
        };

    	this.callParent(arguments);
    }
});
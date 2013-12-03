/**
 * Message Center main grid
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.messageCenter.MessageGrid', {
    extend: 'NP.lib.ui.Grid',
    alias : 'widget.messagecenter.messagegrid',
    
    requires: [
        'NP.view.shared.button.New',
		'NP.lib.core.Translator'
    ],

//	localization
	messageColumnTitle: 'Message',
	displayUntilDateColumnTitle: 'Display Until Date',
	displayUntilTimeColumnTitle: 'Display Until Time',
	messageForColumnTitle: 'MessageFor',


    paging  : true,
    stateful: true,
    stateId : 'message_grid',

    title: 'Message Center',

    initComponent: function() {
        this.pagingToolbarButtons = [{ xtype: 'shared.button.new', text: 'New Message' }];
        
        // Add the base columns for the grid
        this.columns = [
            { text: 'Date Created', xtype:'datecolumn', dataIndex: 'createdAt', flex: 1 },
            { text: 'Message Title', dataIndex: 'subject', flex: 3 },
            { text: 'Message Type', dataIndex: 'type', flex: 1, renderer: Ext.util.Format.capitalize },
            { text: 'Created By', dataIndex: 'person_lastname', flex: 1.5, renderer: function(val, meta, rec) {
                var returnVal = '';
                if (rec.get('createdBy') !== null) {
                    returnVal = rec.raw['person_lastname'] + ', ' + rec.raw['person_firstname']
                                + ' (' + rec.raw['userprofile_username'] + ')';
                }

                return returnVal;
            }},
            { text: 'Submitted Date', xtype:'datecolumn', dataIndex: 'sentAt', flex: 1, format: 'm/d/Y' },
            { text: 'Submitted Time', xtype:'datecolumn', dataIndex: 'sentAt', flex: 1, format: 'H:i:s' },
            { text: 'Status', dataIndex: 'status', flex: 1, renderer: function(val, meta, rec) {
                var returnVal = Ext.util.Format.capitalize(val);
                if (val == 'scheduled') {
                    returnVal += ' for ' + Ext.Date.format(rec.get('sentAt'), Ext.Date.defaultFormat + ' g:iA');
                }

                return returnVal;
            }},
			{ text: NP.Translator.translate(this.messageColumnTitle), dataIndex: 'body', flex: 1},
			{ text: NP.Translator.translate(this.displayUntilDateColumnTitle), dataIndex: 'displayUntil', flex: 1, xtype: 'datecolumn', format: 'm/d/Y'},
			{ text: NP.Translator.translate(this.displayUntilTimeColumnTitle), dataIndex: 'displayUntil', flex: 1, xtype: 'datecolumn', format: 'H:i:s'},
			{ text: NP.Translator.translate(this.messageForColumnTitle), dataIndex: 'recipientType', flex: 1, renderer: function (val, meta, rec) {
				if (!rec.raw['userprofile_id'] && !rec.raw['role_id']) {
					return 'All';
				}
				if (!rec.raw['userprofile_id']) {
					return 'User Group';
				}

				return 'Users';
			}},
        ];

        // Create the store, only thing that changes between stores is the vc_status
        this.store = Ext.create('NP.store.system.UserMessages', {
            service    : 'MessageService',
            action     : 'getAllMessages',
            paging     : true
        });

        this.callParent(arguments);
    }
});
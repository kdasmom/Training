/**
 * The invoice/PO history detail window
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.HistoryDetailWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.shared.invoicepo.historydetailwindow',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
    	'NP.view.shared.button.Cancel',
        'NP.model.gl.GlAccount'
    ],

    layout     : 'fit',
    width      : 600,
    height     : 320,
    modal      : true,
    minimizable: false,

    initComponent: function() {
    	var me = this;

        me.title = NP.Translator.translate('Workflow Rule');

        if (!Ext.isEmpty(me.detailData['approve']['wfrule_id'])) {
            me.title += ' - ' + me.detailData['wfrule']['wfrule_name'];
        }

        me.tbar = [
            { xtype: 'shared.button.cancel', handler: function() { me.close(); } }
        ];

        me.items = [{
            xtype      : 'panel',
            bodyPadding: 8,
            border     : false,
            layout     : {
                type : 'vbox',
                align: 'stretch'
            },
            defaults   : { xtype: 'displayfield' },
            autoScroll: true,
            items      : me.getFields()
        }];

    	me.callParent(arguments);
    },

    getFields: function() {
        var me = this,
            fields,
            label,
            mods,
            columnItems;

        fields = [
            {
                fieldLabel: NP.Translator.translate('Rule Type'),
                renderer  : function() {
                    var approve = me.detailData['approve'];
                    if (approve.approvetype_name == 'hold') {
                        return 'On Hold';
                    } else if (approve.approvetype_name == 'void') {
                        return 'Voided';
                    } else if (Ext.isEmpty(approve.wfrule_id)) {
                        return 'Modified';
                    } else {
                        return me.detailData['wfrule']['wfruletype_name'];
                    }
                }
            },{
                fieldLabel: NP.Config.getPropertyLabel(),
                value     : me.detailData['property_name']
            }
        ];

        if ('void_note' in me.detailData) {
            fields.push({
                fieldLabel: NP.Translator.translate('Void Reason'),
                value     : me.detailData['void_note']
            });
        }

        if ('gl_mod' in me.detailData) {
            // Modified GL accounts
            label = NP.Translator.translate('Modified GLs'),
            mods  = me.detailData['gl_mod'];

            if (mods.length) {
                columnItems = [
                    { html: '<b>' + NP.Translator.translate('From') + '</b>' },
                    { html: '<b>' + NP.Translator.translate('To') + '</b>' }
                ];
                Ext.each(mods, function(mod) {
                    columnItems.push(
                        { html: NP.model.gl.GlAccount.formatName(mod['from_glaccount_number'], mod['from_glaccount_name']) },
                        { html: NP.model.gl.GlAccount.formatName(mod['to_glaccount_number'], mod['to_glaccount_name']) }
                    );
                });
                fields.push({
                    xtype     : 'fieldcontainer',
                    fieldLabel: label,
                    layout    : {
                        type   : 'table',
                        columns: 2
                    },
                    defaults: { xtype: 'component', width: 200, margin: '0 8 0 0' },
                    items   : columnItems
                });
            } else {
                fields.push({
                    fieldLabel: label,
                    value: '<i>' + NP.Translator.translate('No GL accounts were modified or modifications were not logged.') + '</i>'
                });
            }

            // Modified descriptions
            label = NP.Translator.translate('Modified Descriptions'),
            mods  = me.detailData['desc_mod'];

            if (mods.length) {
                columnItems = [
                    { html: '<b>' + NP.Translator.translate('From') + '</b>' },
                    { html: '<b>' + NP.Translator.translate('To') + '</b>' }
                ];
                Ext.each(mods, function(mod) {
                    columnItems.push(
                        { html: mod['approvegllog_desc_from'] },
                        { html: mod['approvegllog_desc_to'] }
                    );
                });
                fields.push({
                    xtype     : 'fieldcontainer',
                    fieldLabel: label,
                    layout    : {
                        type   : 'table',
                        columns: 2
                    },
                    defaults: { xtype: 'component', width: 200, margin: '0 8 0 0' },
                    items   : columnItems
                });
            } else {
                fields.push({
                    fieldLabel: label,
                    value: '<i>' + NP.Translator.translate('No descriptions were modified or modifications were not logged.') + '</i>'
                });
            }
        } else {
            fields.push({
                fieldLabel: NP.Translator.translate('Route To'),
                renderer  : function() {
                    var approve = me.detailData['approve'];

                    if (approve.approvetype_name == 'rejected') {
                        return NP.Translator.translate('Rejected');
                    } else if (approve.approvetype_name == 'hold') {
                        return NP.Translator.translate('On Hold');
                    } else if (approve.approvetype_name == 'void') {
                        return NP.Translator.translate('Voided');
                    } else {
                        if (Ext.isEmpty(approve['wfrule_id'])) {
                            return NP.Translator.translate('Modified');
                        } else if (Ext.isEmpty(approve['forwardto_tablename'])) {
                            return NP.Translator.translate('Approved');
                        } else {
                            var html = me.detailData['forward_name'];
                            if ('forward_users' in me.detailData) {
                                html += '<br />&nbsp;&nbsp;&nbsp;';
                                if (me.detailData['forward_users'].length) {
                                    html += me.detailData['forward_users'][0]['userprofile_username'];
                                } else {
                                    html += 'The role, ' + me.detailData['forward_name'] + ', does not have any users assigned to' + me.detailData['property_name'] + '.'
                                }
                            }

                            return html;
                        }
                    }
                }
            });
        }

        return fields;
    }
});
/**
 * The history log grid for invoice and PO view pages
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.HistoryLogGrid', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.shared.invoicepo.historyloggrid',
    
    requires: [
        'NP.lib.core.Translator',
    	'NP.store.system.HistoryLogs',
        'NP.view.shared.button.Print',
        'NP.lib.print.Manager'
    ],

    frame      : true,
    bodyPadding: 0,

    /**
     * @cfg {String}  type Type of entity this custom field is for; valid values are 'invoice' or 'po'
     */
    type: null,

    // For localization
    dateColName       : 'Date/Time',
    messageColName    : 'Message',
    submittedByColName: 'Submitted By',
    submittedToColName: 'Submitted To',
    actionColName     : 'Action',
    detailColName     : 'Details',
    emptyText         : 'No log entries found',

    initComponent: function() {
        var me = this;

        me.store = {
            type   : 'system.historylogs',
            service: Ext.util.Format.capitalize(me.type) + 'Service',
            action : 'getHistoryLog'
        };

        me.header = {
            title        : NP.Translator.translate('History Log'),
            titlePosition: 0,
            items        : [
                {
                    xtype    : 'button',
                    itemId   : me.type + 'showAuditTrailBtn',
                    text     : NP.Translator.translate('Show Audit Trail'),
                    showAudit: 1
                },{
                    xtype  : 'shared.button.print',
                    margin : '0 0 0 4',
                    handler: function() {
                        NP.PrintManager.print(me);
                    }
                }
            ]
        };

        function toUpperRenderer(val) {
            if (Ext.isString(val)) {
                return val.toUpperCase();
            }

            return '';
        }

        me.columns = {
            items    : [
                {
                    xtype    : 'datecolumn',
                    text     : me.dateColName,
                    dataIndex: 'approve_datetm',
                    format   : NP.Config.getDefaultDateFormat() + ' h:mA',
                    flex     : 0.1
                },{
                    text     : me.messageColName,
                    dataIndex: 'message',
                    flex     : 0.42
                },{
                    text     : me.submittedByColName,
                    dataIndex: 'userprofile_username',
                    flex     : 0.15,
                    renderer : toUpperRenderer
                },{
                    text     : me.submittedToColName,
                    dataIndex: 'approver',
                    flex     : 0.15,
                    renderer : toUpperRenderer
                },{
                    text     : me.actionColName,
                    dataIndex: 'approvetype_name',
                    flex     : 0.1,
                    renderer : toUpperRenderer
                },{
                    text     : me.detailColName,
                    xtype: 'actioncolumn',
                    getClass: function (v, meta, rec, rowIndex) {
                        if (rec.get('approve_id') < 1) {
                            return '';
                        } else {
                            return 'view-btn';
                        }
                    },
                    handler: function(gridView, rowIndex, colIndex, item, e, rec) {
                        if (rec.get('approve_id') > 0) {
                            me.fireEvent('showdetails', rec);
                        }
                    },
                    align: 'center',
                    width: 50
                }
            ]
        };

        me.callParent(arguments);

        me.addEvents('showdetails');
    }
});
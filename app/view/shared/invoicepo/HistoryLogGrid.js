/**
 * The history log grid for invoice and PO view pages
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.HistoryLogGrid', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.shared.invoicepo.historyloggrid',
    
    requires: [
    	'NP.store.system.HistoryLogs'
    ],

    frame      : true,
    bodyPadding: 0,

    /**
     * @cfg {String}  type Type of entity this custom field is for; valid values are 'invoice' or 'po'
     */
    type: null,

    // For localization
    title             : 'History Log',
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


        me.columns = {
            items    : [
                {
                    xtype    : 'datecolumn',
                    text     : me.dateColName,
                    dataIndex: 'approve_datetm',
                    format   : NP.Config.getDefaultDateFormat() + ' h:mA',
                    width    : '10%'
                },{
                    text     : me.messageColName,
                    dataIndex: 'message',
                    width    : '42%'
                },{
                    text     : me.submittedByColName,
                    dataIndex: 'userprofile_username',
                    width    : '15%'
                },{
                    text     : me.submittedToColName,
                    dataIndex: 'approver',
                    width    : '15%'
                },{
                    text     : me.actionColName,
                    dataIndex: 'approvetype_name',
                    width    : '10%'
                },{
                    text     : me.detailColName,
                    dataIndex: 'approve_id',
                    width    : '5%',
                    renderer : function(val, meta, rec) {
                        // TODO: add renderer code here
                        return '';
                    }
                }
            ]
        };

        me.callParent(arguments);
    }
});
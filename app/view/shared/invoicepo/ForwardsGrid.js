/**
 * The forwards grid for invoice and PO view pages
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.ForwardsGrid', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.shared.invoicepo.forwardsgrid',
    
    requires: [
        'NP.lib.core.Config',
        'NP.store.shared.InvoicePoForwards'
    ],

    frame      : true,
    bodyPadding: 0,

    /**
     * @cfg {String}  type Type of entity this custom field is for; valid values are 'invoice' or 'po'
     */
    type: null,

    // For localization
    sentFromColName   : 'Sent From',
    sentToEmailColName: 'Sent To Email',
    sentToColName     : 'Sent To',
    sentDateColName   : 'Date Forwarded',
    emptyText         : 'No forwards found',

    initComponent: function() {
        var me = this;

        me.store = {
            type   : 'shared.invoicepoforwards',
            service: Ext.util.Format.capitalize(me.type) + 'Service',
            action : 'getForwards'
        };


        me.columns = {
            defaults : { width: '24%' },
            items    : [
                {
                    text     : me.sentFromColName,
                    dataIndex: 'from_person_firstname',
                    renderer : function(val, meta, rec) {
                        var returnVal = val + ' ' + rec.get('from_person_lastname');
                        if (rec.get('forward_from_userprofile_id') !== rec.get('from_delegation_to_userprofile_id')
                                && rec.get('forward_from_userprofile_id') !== null
                                && rec.get('from_delegation_to_userprofile_id') !== null) {
                            returnVal += ' (done by ' + rec.get('delegation_userprofile_username') + ' on behalf of ' + rec.get('from_userprofile_username') + ')';
                        }

                        return returnVal;
                    }
                },{
                    text     : me.sentToEmailColName,
                    dataIndex: 'forward_to_email'
                },{
                    text     : me.sentToColName,
                    dataIndex: 'to_person_firstname',
                    renderer : function(val, meta, rec) {
                        if (val !== null || rec.get('to_person_lastname') !== null) {
                            return val + ' ' + rec.get('to_person_lastname');
                        } else {
                            return '';
                        }
                    }
                },{
                    xtype    : 'datecolumn',
                    text     : me.sentDateColName,
                    dataIndex: 'forward_datetm',
                    format   : NP.Config.getDefaultDateFormat()
                }
            ]
        };

        me.callParent(arguments);
    }
});
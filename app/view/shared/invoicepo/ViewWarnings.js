/**
 * The warning view for the invoice or PO page
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.invoicepo.ViewWarnings', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.shared.invoicepo.viewwarnings',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
    	'NP.lib.core.Util',
        'NP.lib.core.Translator',
        'NP.store.shared.Warnings'
    ],
    
    hidden     : true,
    collapsible: true,
    autoScroll : true,
    maxHeight  : 200,
    
    type       : null,

    // For localization
    title : 'Warnings',

    initComponent: function() {
    	var me        = this,
            service   = Ext.util.Format.capitalize(me.type),
            viewStore = Ext.create('NP.store.shared.Warnings', {
                            service  : service + 'Service',
                            action   : 'getWarnings',
                            listeners: {
                                load: function(store) {
                                    if (store.getCount()) {
                                        me.show();
                                    } else {
                                        me.hide();
                                    }
                                }
                            }
                        });

        me.type = (me.type == 'po') ? 'purchase order' : 'invoice';
        
        me.items = [{
            xtype       : 'dataview',
            itemSelector: 'tbody tr',
            store       : viewStore,
            tpl: new Ext.XTemplate(me.buildTpl(), {
                getStoreCount: function() {
                    return viewStore.getCount();
                },
                renderWarningText: function(type, data) {
                    type = Ext.util.Format.capitalize(type);
                    
                    var warning = me['render' + type](data);
                    
                    if (!Ext.isObject(warning)) {
                        warning = {
                            text: warning,
                            vals: {}
                        }
                    }

                    return NP.Translator.translate(warning.text, warning.vals);
                }
            })
        }];

        this.callParent(arguments);
    },

    buildTpl: function() {
        var me = this;

        return '<tpl if="this.getStoreCount() &gt; 0">' +
                    '<table width="100%" id="warningTable">' +
                    '<tbody>' +
                    '<tpl for=".">' +
                        '<tr>' +
                            '<td width="1%"><img src="resources/images/warning_{warning_icon}.gif" /></td>' +
                            '<td>' +
                                '<div class="warning_title">{warning_title}</div>' +
                                '<div class="warning_text">{[this.renderWarningText(values.warning_type, values.warning_data)]}</div>' +
                            '</td>' +
                        '</tr>' +
                    '</tpl>' +
                    '</tbody>' +
                    '</table>' +
                '</tpl>';
    },

    renderJob: function(data) {
        var html = '',
            noun,
            verb,
            article,
            types = [
                { name: 'jobs', term: 'Job Code' },
                { name: 'contracts', term: 'Contract' }
            ];

        Ext.each(types, function(type) {
            var name    = type['name'],
                term    = type['term'],
                setting = term.replace(' ', ''),
                field   = 'jb' + setting.toLowerCase() + '_name';

            if (data['inactive_' + name].length) {
                noun = NP.Config.getSetting('PN.jobcosting.' + setting + 'Term', term);
                if (data['inactive_' + name].length > 1) {
                    noun    += 's';
                    verb    = 'are';
                    article = 'these';
                } else {
                    verb    = 'is';
                    article = 'this';
                }

                var jobs = NP.Util.valueList(data['inactive_' + name], field);
                html += '<div>' + noun + ' ' + verb + ' no longer active.  Please update the items assigned to ' + article + ' ' + noun + ' before proceeding.</div>';
            }
        });

        return html;
    },

    renderInsuranceExpiration: function(data) {
        if (data['expired']) {
            return 'Vendor insurance certificate expired!';
        } else if (data['days_until_expiration'] !== null) {
            return 'Vendor has an upcoming insurance certificate expiration!';
        }
    },

    renderVendorInactive: function(data) {
        return 'The vendor is not approved or active. This ' + this.type + ' cannot be approved or submitted.';
    },

    renderInvoiceDuplicate: function(data) {
        return 'Duplicate Invoice Number exists for this vendor.';
    },

    renderInvoiceDuplicateDateAmount: function(data) {
        return 'Duplicate invoice date and amount exist for this vendor. ' +
                'Please look at Invoice <a href="javascript:NP.app.addHistory(\'Invoice:showView:' + data[0]['invoice_id'] + '\');">' + data[0]['invoice_ref'] + '</a>';
    },

    renderLinkablePo: function(data) {
        return 'There is a relative PO available to link this invoice to.';
    },

    renderPoThreshold: function(data) {
        return 'Purchase Order Threshold has been exceeded.';
    },

    renderInvalidPeriod: function(data) {
        return {
            text: 'One or more line {properties} are not in the same accounting period as the header {property}.',
            vals: {
                properties: NP.Config.getPropertyLabel(true),
                property  : NP.Config.getPropertyLabel()
            }
        };
    }
});
/**
 * CSV grid
 *
 * @author Zubik Aliaksandr
 */
Ext.define('NP.view.importing.CSVGrid', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.importing.csvgrid',
    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.Inactivate',
        'NP.view.shared.button.Activate',
        'NP.lib.ui.Grid',
        'NP.model.importing.GLBudget',
        'NP.model.importing.GLActual',
        'NP.model.importing.GLCategory',
        'NP.model.importing.GLCode',
        'NP.model.importing.Property',
        'NP.model.importing.PropertyGL',
        'NP.model.importing.Unit',
        'NP.model.importing.UnitType',
        'NP.model.importing.Vendor',
        'NP.model.importing.VendorGL',
        'NP.model.importing.VendorFavorite',
        'NP.model.importing.VendorInsurance',
        'NP.model.importing.VendorUtility',
        'NP.model.importing.InvoicePayment',
        'NP.model.importing.User',
        'NP.model.importing.UserProperty',
        'NP.model.importing.Split'
    ],

    border: false,
    bodyPadding: 8,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    // For localization
    acceptBtnText   : 'Accept',
    declineBtnText  : 'Decline',
    instructionsText: 'If you exit from the Import/Export Utility without Accepting or Declining, \
                        any import/export in process will be abandoned.',
    gridTitle       : 'Preview',
    statusColText   : 'Status',
    rowNumColText   : 'Row #',

    initComponent: function() {
        this.tbar = [
            { xtype: 'shared.button.inactivate', text: this.declineBtnText },
            { xtype: 'shared.button.activate', text: this.acceptBtnText }
        ];

        var importClass = Ext.create('NP.view.importing.types.' + this.type),
            grid = importClass.getGrid();

        Ext.applyIf(grid, {
            xtype  : 'customgrid',
            title  : this.gridTitle,
            flex: 1,
            stateId: this.type.toLowerCase() + '_import_grid',
            store: Ext.create('NP.lib.data.Store', {
                        model  : 'NP.model.importing.' + this.type,
                        service: 'ImportService',
                        action : 'getPreview',
                        extraParams: { file: this.file, type: this.type }
                    })
        });

        Ext.applyIf(grid.columns, {
            defaults: {
                renderer: importClass.getColumnRenderer,
                flex: 1
            }
        });

        grid.columns.items.unshift(
            {
                text     : this.statusColText,
                dataIndex: 'validation_status',
                flex     : 0.1,
                align    : 'center',
                renderer : function(val, meta, rec) {
                    if (val == 'invalid') {
                        var errorMsg = 'Invalid';
                        if ('global' in rec.get('validation_errors')) {
                            errorMsg = rec.get('validation_errors')['global'];
                        }
                        meta.tdAttr = 'data-qtip="'+errorMsg+'"';
                        return '<img src="resources/images/buttons/inactivate.gif"/>';
                    } else {
                        meta.tdAttr = 'data-qtip="Valid"';
                        return '<img src="resources/images/buttons/activate.gif"/>';
                    }
                }
            },
            { xtype: 'rownumberer', text: this.rowNumColText, flex: 0.1 }
        );
        
        this.items = [
            {
                xtype: 'component',
                margin: '0 0 8 0',
                html: this.instructionsText
            },
            grid
        ];

        this.callParent(arguments);
    }

});
/**
 * CSV grid
 *
 * @author Zubik Aliaksandr
 */
Ext.define('NP.view.import.CSVGrid', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.import.csvgrid',
    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.Inactivate',
        'NP.view.shared.button.Activate',
        'NP.lib.ui.Grid',
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
        var bar = [
            { xtype: 'shared.button.inactivate', text: this.declineBtnText },
            { xtype: 'shared.button.activate', text: this.acceptBtnText }
        ];

        this.tbar = bar;
        this.bbar = bar;

        var grid = Ext.create('NP.view.import.types.' + this.type).getGrid();
        Ext.applyIf(grid, {
            xtype  : 'customgrid',
            title  : this.gridTitle,
            flex: 1,
            stateId: this.type.toLowerCase() + '_import_grid',
            store: Ext.create('NP.store.import.' + this.type + 's', {
                        service: 'ImportService',
                        action : 'getPreview',
                        paging : true,
                        extraParams: { file: this.file, type: this.type }
                    })
        });

        grid.columns.unshift(
            {
                text     : this.statusColText,
                dataIndex: 'validation_status',
                flex: 1,
                renderer : function(val, meta, rec) {
                    if (val == 'invalid'){
                        meta.tdAttr = 'data-qtip="Invalid"';
                        return '<img src="resources/images/buttons/inactivate.gif"/>';
                    } else {
                        meta.tdAttr = 'data-qtip="Valid"';
                        return '<img src="resources/images/buttons/activate.gif"/>';
                    }
                }
            },
            { xtype: 'rownumberer', text: this.rowNumColText, width: 43 }
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
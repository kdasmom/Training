Ext.define('NP.view.shared.ExpandableSection', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.shared.ExpandableSection',

    requires: [
        'NP.view.shared.button.Plus',
        'NP.view.shared.button.Minus'
    ],

    //opener: ,
    values: [],

    expanded: true,

    defaults: {
        border: 0
    },

    initComponent: function() {
        if (!'opener' in this) {
            throw 'The config option "opener" must be specified';
    	}
        if (!'values' in this) {
            throw 'The config option "values" must be specified';
    	}
        if (!'itemId' in this) {
            throw 'The config option "itemId" must be specified and should be unique';
    	}

        this.items = [
            {
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    pack: 'start'
                },
                defaults: {
                    border: 0
                },
                items: [
                    {
                        html: this.opener
                    },
                    {
                        itemId: 'button-expand-' + this.itemId,

                        xtype: 'shared.button.plus',
                        hidden: true,

                        listeners: {
                            click: this.expand.bind(this)
                        }
                    },
                    {
                        itemId: 'button-collapse-' + this.itemId,

                        xtype: 'shared.button.minus',

                        listeners: {
                            click: this.collapse.bind(this)
                        }
                    }
                ]
            },
            {
                itemId: 'panel-collapse-' + this.itemId,

                xtype: 'panel',
                defaults: {
                    border: 0,
                    padding: '0 0 0 20'
                },
                items: this.values
            }
        ];
        this.callParent(arguments);

        this.elements = {
            buttonExpand: this.down('#button-expand-' + this.itemId),
            buttonCollapse: this.down('#button-collapse-' + this.itemId),
            panelCollapse: this.down('#panel-collapse-' + this.itemId)
        }
    },

    expand: function() {
        this.elements.buttonExpand.hide();
        this.elements.buttonCollapse.show();
        this.elements.panelCollapse.show();
        this.expanded = true;
    },

    collapse: function() {
        this.elements.buttonExpand.show();
        this.elements.buttonCollapse.hide();
        this.elements.panelCollapse.hide();
        this.expanded = false;
    }
});
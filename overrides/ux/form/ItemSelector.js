// Override ItemSelector so we can use templates in them
Ext.define('overrides.ux.form.ItemSelector', {
    override: 'Ext.ux.form.ItemSelector',

    createList: function(title){
        var me = this;

        var cfg = {
            submitValue: false,
            flex: 1,
            dragGroup: me.ddGroup,
            dropGroup: me.ddGroup,
            tpl: me.tpl,
            title: title,
            store: {
                model: me.store.model,
                data: []
            },
            displayField: me.displayField,
            disabled: me.disabled,
            listeners: {
                boundList: {
                    scope: me,
                    itemdblclick: me.onItemDblClick,
                    drop: me.syncValue
                }
            }
        };

        if (me.tpl) {
            cfg.listConfig = { tpl: me.tpl };
        }

        return Ext.create('Ext.ux.form.MultiSelect', cfg);
    }
});
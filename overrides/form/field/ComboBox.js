// Override the combo box clearValue() function so that the select event gets fired even when you clear the field
Ext.define('overrides.form.field.ComboBox', {
	override: 'Ext.form.field.ComboBox',

	clearValue: function() {
		this.setValue([]);
        this.fireEvent('select', this, [], {});
    },

    // The only fix here is that on line 30 the "&&" in "queryString && !queryPlan.forceAll" was changed
    // from an "||"
    doLocalQuery: function(queryPlan) {
        var me = this,
            queryString = queryPlan.query;

        // Create our filter when first needed
        if (!me.queryFilter) {
            // Create the filter that we will use during typing to filter the Store
            me.queryFilter = new Ext.util.Filter({
                id: me.id + '-query-filter',
                anyMatch: me.anyMatch,
                caseSensitive: me.caseSensitive,
                root: 'data',
                property: me.displayField
            });
            me.store.addFilter(me.queryFilter, false);
        }

        // Querying by a string...
        if (queryString && !queryPlan.forceAll) {
            me.queryFilter.disabled = false;
            me.queryFilter.setValue(me.enableRegEx ? new RegExp(queryString) : queryString);
        }

        // If forceAll being used, or no query string, disable the filter
        else {
            me.queryFilter.disabled = true;
        }

        // Filter the Store according to the updated filter
        me.store.filter();

        // Expand after adjusting the filter unless there are no matches
        if (me.store.getCount()) {
            me.expand();
        } else {
            me.collapse();
        }

        me.afterQuery(queryPlan);
    }
});
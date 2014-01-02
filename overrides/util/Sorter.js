// Make the default sort be case insensitive for strings
Ext.define('overrides.util.Sorter', {
	override: 'Ext.util.Sorter',
	
	defaultSorterFn: function(o1, o2) {
        var me = this,
            transform = me.transform,
            v1 = me.getRoot(o1)[me.property],
            v2 = me.getRoot(o2)[me.property];

        if (transform) {
            v1 = transform(v1);
            v2 = transform(v2);
        }

        // Added this part to the function to make case-insensitive
        if (Ext.isString(v1)) {
        	v1 = v1.toLowerCase();
        }
        if (Ext.isString(v2)) {
        	v2 = v2.toLowerCase();
        }

        return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
    }
});
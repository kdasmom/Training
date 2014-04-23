/**
 * Store for PoItems.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.po.PoItems', {
	extend: 'NP.lib.data.Store',
	alias : 'store.po.poitems',

	model : 'NP.model.po.PoItem',

	sorters: [{
		property : 'poitem_linenum',
		direction: 'ASC'
	}]
});
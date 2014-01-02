/**
 * The SequenceTracker class is used to track items in a sequence through cookies and makes
 * it easier to use next/previous functionality.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.core.SequenceTracker', {
	alternateClassName: 'NP.SequenceTracker',
	requires: ['Ext.util.Cookies'],

	name        : null,
	items       : [],
	itemMap     : {},
	currentItem : null,
	cycleThrough: false,

	constructor: function(cfg) {
		var me  = this,
			cfg = cfg || {};

		me = Ext.apply(me, cfg);

		if (me.name === null || me.name === '') {
			throw 'You must specify a name for this sequence tracker';
		}

		me.retrieve();

		if (cfg.items) {
			me.setItems(cfg.items);
			if (cfg.currentItem !== null) {
				me.setCurrentItem(cfg.currentItem);
			} else {
				me.setCurrentItem(me.items[0]);
			}
		}

		me.callParent(arguments);
	},

	retrieve: function() {
		var me    = this,
			items = Ext.util.Cookies.get(me.name),
			currentItem = Ext.util.Cookies.get(me.name + '_current');

		if (items !== null) {
			me.setItems(items, false);
		}

		if (currentItem !== null) {
			me.setCurrentItem(currentItem);
		}

		return me;
	},

	setItems: function(items, persist) {
		var me = this,
			i;

		persist = (arguments.length < 2) ? true : persist;

		if (Ext.isString(items)) {
			items = items.split(',');
		}
		me.items = items;

		for (i=0; i<me.items.length; i++) {
			me.itemMap[me.items[i]] = i;
		}

		if (persist) {
			me.persistItems();
		}

		return me;
	},

	getItems: function() {
		return this.items;
	},

	persist: function() {
		var me = this;
		
		me.persistItems();
		me.persistCurrentItem();

		return me;
	},

	persistItems: function() {
		var me = this;

		Ext.util.Cookies.set(me.name, me.items.join(','));

		return me;
	},

	persistCurrentItem: function() {
		var me = this;
		
		Ext.util.Cookies.set(me.name + '_current', me.currentItem);

		return me;
	},

	next: function() {
		var me = this;

		if (me.currentItem in me.itemMap) {
			var pos = me.itemMap[me.currentItem] + 1;
			if (pos > me.items.length-1) {
				if (me.cycleThrough) {
					pos = 0;
				} else {
					pos = null;
				}
			}
			
			if (pos !== null) {
				me.currentItem = me.items[pos];
			} else {
				me.currentItem = null;
			}

			me.persistCurrentItem();

			return me.currentItem;
		} else {
			me.currentItem = null;
		}
	},

	previous: function() {
		var me = this;

		if (me.currentItem in me.itemMap) {
			var pos = me.itemMap[me.currentItem] - 1;
			if (pos < 0) {
				if (me.cycleThrough) {
					pos = me.items.length - 1;
				} else {
					pos = null;
				}
			}

			if (pos !== null) {
				me.currentItem = me.items[pos];
			} else {
				me.currentItem = null;
			}
			
			me.persistCurrentItem();

			return me.currentItem;
		} else {
			me.currentItem = null;
		}
	},

	setCurrentItem: function(item) {
		var me = this;

		if (item in me.itemMap) {
			me.currentItem = item;

			me.persistCurrentItem();
		} else {
			me.currentItem = null;
		}
	},

	getCurrentItem: function() {
		return this.currentItem;
	},

	removeItem: function(item) {
		var me = this,
			i;

		if (item === me.currentItem) {
			throw 'Cannot remove current item in the sequence, move to another item first';
		}

		if (item in me.itemMap) {
			var pos = me.itemMap[item];
			delete me.itemMap[item];
			me.items.splice(pos, 1);
			for (i=pos; i<me.items.length; i++) {
				me.itemMap[me.items[i]]--;
			}

			me.persistItems();
		}
	}
});
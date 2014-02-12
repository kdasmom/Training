/**
 * The KeyShortcutManager class is used to handle keyword shortcuts throughout the app.
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.core.KeyManager', {
	alternateClassName: 'NP.Keys',
	singleton         : true,
	
	requires: ['NP.lib.core.Translator'],

	shortcuts: {},
	shortcutHelp: {},

	constructor: function(cfg) {
		var me  = this,
			cfg = cfg || {};

		me = Ext.apply(me, cfg);

		Ext.getBody().on('keydown', me.handleShortcuts, me);

		me.callParent(arguments);

		me.win = null;
	},

	addShortcut: function(token, key, fn, cfg) {
		var me  = this,
			len = token.split(':').length,
			item;

		// If key is an array, we're actually defining multiple different keys for a token
		if (!Ext.isArray(key)) {
			cfg = cfg || {};
			key = [Ext.apply(cfg, { key: key, fn: fn })];
		}
		
		for (var i=0; i<key.length; i++) {
			item = key[i];

			Ext.applyIf(item, {
				scope      : this,
				useAlt     : false,
				argsFn     : function() { return []; },
				conditionFn: function() { return true; }
			});

			if (!(item.useAlt in me.shortcuts)) {
				me.shortcuts[item.useAlt] = {};
			}
			if (!(key in me.shortcuts[item.useAlt])) {
				me.shortcuts[item.useAlt][item.key] = {};
			}
			if (!(len in me.shortcuts[item.useAlt][item.key])) {
				me.shortcuts[item.useAlt][item.key][len] = {};
			}
			
			me.shortcuts[item.useAlt][item.key][len][token] = {
				fn         : item.fn,
				scope      : item.scope,
				argsFn     : item.argsFn,
				conditionFn: item.conditionFn
			};

			if (!(token in me.shortcutHelp)) {
				me.shortcutHelp[token] = [];
			}

			me.shortcutHelp[token].push({
				title      : item.title,
				useAlt     : item.useAlt,
				key        : item.key,
				conditionFn: item.conditionFn
			});
		}
	},

	handleShortcuts: function(e, target, eOpts) {
		var me    = this,
			shortcuts,
			scutToken,
			scut,
			token,
			len;

		if (e.getKey() == Ext.EventObject.ESC && me.win) {
			me.closeShortcutWindow();
		} else {
			if (e.ctrlKey) {
				if (e.altKey && e.getKey() == Ext.EventObject.H) {
					me.showShortcuts();
				} else if (e.altKey in me.shortcuts) {
					shortcuts = me.shortcuts[e.altKey];
					if (e.getKey() in shortcuts) {
						shortcuts = shortcuts[e.getKey()];
						token     = me.getPageToken();
						len       = token.split(':').length;
						if (len in shortcuts) {
							shortcuts = shortcuts[len];
							for (scutToken in shortcuts) {
								if (token.match(new RegExp(scutToken, 'i')) !== null) {
									scut = shortcuts[scutToken];

									if (scut.conditionFn()) {
										scut.fn.apply(scut.scope, scut.argsFn);
										e.preventDefault();
										return false;
									}
								}
							}
						}
					}
				}
			}
		}
	},

	getPageToken: function() {
		var token = Ext.History.getToken().split(':');

		token.splice(token.length-3, 2);
		
		return token.join(':');
	},

	showShortcuts: function() {
		var me     = this,
			token  = me.getPageToken(),
			fields = [],
			scutToken,
			shortcuts,
			scutText,
			keyString;

		for (scutToken in me.shortcutHelp) {
			if (token.match(new RegExp(scutToken, 'i')) !== null) {
				shortcuts = me.shortcutHelp[scutToken];
				for (var i=0; i<shortcuts.length; i++) {
					if (shortcuts[i].conditionFn()) {
						scutText = '(CTRL +';
						if (shortcuts[i].useAlt) {
							scutText += ' ALT +';
						}
						if (shortcuts[i].key == Ext.EventObject.RIGHT) {
							keyString = 'right arrow';
						} else if (shortcuts[i].key == Ext.EventObject.LEFT) {
							keyString = 'left arrow';
						} else if (shortcuts[i].key == Ext.EventObject.ESC) {
							keyString = 'esc';
						} else if (shortcuts[i].key == Ext.EventObject.ENTER) {
							keyString = 'enter';
						} else if (shortcuts[i].key == Ext.EventObject.RETURN) {
							keyString = 'return';
						} else if (shortcuts[i].key == Ext.EventObject.TAB) {
							keyString = 'tab';
						} else if (shortcuts[i].key == Ext.EventObject.DOWN) {
							keyString = 'down arrow';
						} else if (shortcuts[i].key == Ext.EventObject.UP) {
							keyString = 'up arrow';
						} else {
							keyString = String.fromCharCode(shortcuts[i].key);
						}

						scutText += ' ' + keyString + ')';

						fields.push({
							xtype     : 'displayfield',
							fieldLabel: NP.Translator.translate(shortcuts[i].title),
							value     : scutText
						});
					}
				}
			}
		}

		if (fields.length) {
			me.win = Ext.create('Ext.panel.Panel', {
				title      : NP.Translator.translate('Keyboard Shorcuts'),
				modal      : true,
				floating   : true,
				width      : 350,
				bodyPadding: 8,
				tools: [{
					type   : 'close',
					handler: function() {
						me.closeShortcutWindow();
					}
	        	}],
				layout     : {
					type : 'vbox',
					align: 'stretch'
				},
				defaults: { labelWidth: 100 },
				items   : fields
			});

			me.win.show();
		}
	},

	closeShortcutWindow: function() {
		var me = this;
		
		me.win.destroy();
		me.win = null;
	}
});
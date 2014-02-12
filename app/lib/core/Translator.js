/**
 * The Translator class is used to translate text
 *
 * @author Thomas Messier
 * @singleton
 */
Ext.define('NP.lib.core.Translator', {
	extend   : 'Ext.util.Observable',

	requires: ['Ext.util.Cookies'],

	alternateClassName: ['NP.Translator'],
	singleton: true,
	
	localeLoaded: false,

	constructor: function() {
		// Add an event that we'll use to publish when a new locale has been loaded
		this.addEvents('localeloaded');

		this.template = new Ext.Template();

	    this.callParent(arguments);
	},

	/**
	 * Load a new locale file
	 * @param {String} lang The language to load
	 */
	loadLocale: function(lang) {
		var me = this;
		var time = new Date().getTime();

		// Inject a script elements with the language JS file
		Ext.Loader.injectScriptElement('app/locale/'+lang+'.js?_dc='+time, function() {
			Ext.Loader.injectScriptElement('ext/locale/ext-lang-'+lang+'.js?_dc='+time, function() {
				me.localeLoaded = true;

				// Fire the event to indicate a new locale has been loaded
				me.fireEvent('localeloaded', lang);
			});
		});
	},

	setLocale: function(locale) {
		Ext.util.Cookies.set('NP_locale', locale);
	},

	getLocale: function() {
		var locale = Ext.util.Cookies.get('NP_locale');
		
		if (!Ext.isEmpty(locale) && locale) {
			return locale;
		}

		return 'en';
	},

	/**
	 * Translate english text into the currently loaded locale language
	 * @param  {String} text   The text to translate
	 * @param  {Array}  params Parameters to use if the text to translate is an Ext.Template object
	 * @return {String}        The translated text
	 */
	translate: function(text, values) {
		var me = this;

		values = values || null;

		// If no locale loaded, throw error
		if (!me.localeLoaded) {
			throw 'Cannot translate text because locale has not been loaded; text requested was "' + text + '"';
		// Else try to translate
		} else {
			// If translation found, return it
			if (text in NP.Locale) {
				text = NP.Locale[text];
			}

			if (Ext.isArray(values) || Ext.isObject(values)) {
				this.template.set(text, false);
				text = this.template.apply(values);
			}

			return text;
		}
	}
});
/**
 * The Budget menu
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.menu.BudgetMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.budgetmenu',
    
    requires: [
    	'NP.lib.core.Security',
    	'NP.lib.core.Translator'
    ],

	menu: {},

    initComponent: function() {
    	this.text = NP.Translator.translate('Budget');
    	this.menu.showSeparator = false;
    	this.menu.items = [];

    	// At-a-Glance
	    if ( NP.lib.core.Security.hasPermission(1037) ) {
			this.menu.items.push({
				text: NP.Translator.translate('At-a-Glance')
			});
		}
		
		// Budget Search
		if ( NP.lib.core.Security.hasPermission(1038) ) {
			this.menu.items.push({
				text: NP.Translator.translate('Budget Search')
			});
		}

	    this.callParent(arguments);
    }
});
/**
 * The Budget menu
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.viewport.menu.BudgetMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.menu.budgetmenu',
    
    requires: ['NP.lib.core.Security'],

	budgetText  : 'Budget',
	atGlanceText: 'At-a-Glance',
	searchText  : 'Budget Search',

    menu: {},

    initComponent: function() {
    	this.text = this.budgetText;
    	this.menu.showSeparator = false;
    	this.menu.items = [];

    	// At-a-Glance
	    if ( NP.lib.core.Security.hasPermission(1037) ) {
			this.menu.items.push({
				text: this.atGlanceText
			});
		}
		
		// Budget Search
		if ( NP.lib.core.Security.hasPermission(1038) ) {
			this.menu.items.push({
				text: this.searchText
			});
		}

	    this.callParent(arguments);
    }
});
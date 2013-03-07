Ext.define('NP.view.viewport.BudgetMenu', {
    extend: 'NP.lib.ui.HoverButton',
    alias: 'widget.viewport.budgetmenu',
    
    requires: ['NP.lib.core.Security'],

	budgetText  : 'Budget',
	atGlanceText: 'At-a-Glance',
	searchText  : 'Budget Search',

    menu: {},

    initComponent: function() {
    	this.text = this.budgetText;
    	this.menu.showSeparator = false;
    	this.menu.items = [];

	    if ( NP.lib.core.Security.hasPermission(1037) ) {
			this.menu.items.push({
				text: this.atGlanceText
			});
		}
		
		if ( NP.lib.core.Security.hasPermission(1038) ) {
			this.menu.items.push({
				text: this.searchText
			});
		}

	    this.callParent(arguments);
    }
});
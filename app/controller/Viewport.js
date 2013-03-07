Ext.define('NP.controller.Viewport', function() {
	return {
		extend: 'Ext.app.Controller',
		
		requires: ['NP.lib.core.Security'],
		
		stores: ['user.Properties','user.Regions','user.Delegations'],
		
		init: function() {
			this.control({
				// Clicking on Invoices, Invoice Register, or any of the subitems under Invoice Register
				'viewport #invMenuBtn,viewport #invRegisterMenuBtn,viewport #invRegisterMenuBtn menuitem': {
					click: function(itemClicked) {
						var token = 'Invoice:showRegister';
						if (itemClicked.itemId != 'invMenuBtn' && itemClicked.itemId != 'invRegisterMenuBtn') {
							token += ':' + itemClicked.itemId.replace('InvRegisterMenuBtn', '');
						} else {
							token += ':open';
						}
						this.application.addHistory(token);
					}
				}
			});
		},
		
		home: function() {
			this.application.setView('NP.view.viewport.Home');
		}
	}
}());
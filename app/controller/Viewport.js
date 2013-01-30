Ext.define('NP.controller.Viewport', function() {
	return {
		extend: 'Ext.app.Controller',
		
		requires: ['NP.core.Security'],
		
		stores: ['UserProperties','UserRegions','user.UserDelegations'],
		views: ['Home'],
		
		init: function() {
			this.control({
				// Clicking on Invoices, Invoice Register, or any of the subitems under Invoice Register
				'viewport #invMenuBtn,viewport #invRegisterMenuBtn,viewport #invRegisterMenuBtn menuitem': {
					click: function(itemClicked) {
						var token = 'Invoice:showRegister';
						if (itemClicked.itemId != 'invMenuBtn' && itemClicked.itemId != 'invRegisterMenuBtn') {
							token += ':' + itemClicked.itemId.replace('InvRegisterMenuBtn', '');
						}
						this.application.addHistory(token);
					}
				}
			});
		},
		
		home: function() {
			var vw = this.getView('Home').create();
			this.application.setView(vw);
		}
	}
}());
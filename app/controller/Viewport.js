Ext.define('NP.controller.Viewport', function() {
	return {
		extend: 'Ext.app.Controller',
		
		requires: ['NP.core.Security'],
		
		views: ['Home'],
		
		init: function() {
			this.control({
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
});
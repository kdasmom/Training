Ext.define('NP.view.systemSetup.WorkflowRulesRoutes', {
    extend: 'Ext.panel.Panel',
    alias:  'widget.systemsetup.workflowrulesroutes',

	requires: [
		'NP.view.systemSetup.WorkflowOriginatesGrid',
		'NP.view.shared.UserAssigner',
		'NP.view.shared.RoleAssigner'
	],

    initComponent: function() {
		var me = this;

		me.userStore = Ext.create('NP.store.user.Userprofiles', {
			service : 'UserService',
			action : 'getAll',
			userprofile_status : 'active'
		});
		me.userStore.load();

		me.groupStore = Ext.create('NP.store.user.Roles', {
			service : 'UserService',
			action : 'getRoles'
		});
		me.groupStore.load();

		this.items = [{
			xtype: 'fieldset',
			title: NP.Translator.translate('Rule Builder'),
			defaultType: 'textfield',
			padding: '8',
			border: true,
			items: [{
				xtype: 'form',
				name: 'routeform',
				itemId: 'routeform',
				border: 0,
				items: [
					{
						xtype: 'systemsetup.workfloworiginatesgrid',
						data: me.data ? me.data : null
					},
					{
						xtype: 'hiddenfield',
						name : 'wfrule_id',
						value: me.data ? me.data.rule.wfrule_id : null
					},
					{
						xtype: 'container',
						layout: 'hbox',
						margin: '20 0 0 0',
						items: [
							{
								xtype: 'radiogroup',
								name: 'originatesgroup',
								fieldLabel: NP.Translator.translate('Originates From'),
								labelWidth: 100,
								width: 200,
								columns: 1,
								vertical: true,
								listeners: {
									change: function(field, newValue, oldValue, options) {
										var originatescontainer = me.down('[name="routeform"]').down('[name="originatescontainer"]');
										originatescontainer.removeAll();

										if (newValue.originatesfrom == 'groups') {
											originatescontainer.add( me.addGroupSection('groupsfrom') );
										}
										else {
											originatescontainer.add( me.addUserSection('usersfrom') );
										}
										me.toggleAddForwardButton();
									}
								},
								items: [
									{
										boxLabel: NP.Translator.translate('Group'),
										name: 'originatesfrom',
										inputValue: 'groups'
									},
									{
										boxLabel: NP.Translator.translate('User'),
										name: 'originatesfrom',
										inputValue: 'users'
									}
								]
							},
							{
								xtype: 'fieldcontainer',
								name: 'originatescontainer',
								layout: 'vbox',
								items: []
							}
						]
					},
					{
						xtype: 'container',
						layout: 'hbox',
						margin: '20 0 0 0',
						items: [
							{
								xtype: 'radiogroup',
								name: 'forwardgroup',
								fieldLabel: NP.Translator.translate('Forward to'),
								labelWidth: 100,
								width: 200,
								columns: 1,
								vertical: true,
								listeners: {
									change: function(field, newValue, oldValue, options) {
										var forwardtocontainer = me.down('[name="routeform"]').down('[name="forwardtocontainer"]');
										forwardtocontainer.removeAll();

										if (newValue.forwardto == 'groups') {
											forwardtocontainer.add(	me.addGroupSection('groupsto') );
										}
										else if (newValue.forwardto == 'users') {
											forwardtocontainer.add(	me.addUserSection('usersto') );
										}
										me.toggleAddForwardButton();
									}
								},
								items: [
									{
										boxLabel: NP.Translator.translate('Next Level'),
										name: 'forwardto',
										inputValue: 'next'
									},
									{
										boxLabel: NP.Translator.translate('Group'),
										name: 'forwardto',
										inputValue: 'groups'
									},
									{
										boxLabel: NP.Translator.translate('User'),
										name: 'forwardto',
										inputValue: 'users'
									}
								]
							},
							{
								xtype: 'fieldcontainer',
								name: 'forwardtocontainer',
								layout: 'vbox',
								items: []
							}
						]
					}
				]
			}]
		}];

        this.callParent(arguments);
    },

	clearForm: function() {
		var me = this;

		me.down('[name="routeform"]').down('[name="originatesgroup"]').reset();
		me.down('[name="routeform"]').down('[name="forwardgroup"]').reset();

		me.down('[name="routeform"]').down('[name="originatescontainer"]').removeAll();
		me.down('[name="routeform"]').down('[name="forwardtocontainer"]').removeAll();
	},

	addUserSection: function(fieldname) {
		var me = this;

		return {
			itemId: fieldname,
			xtype: 'shared.userassigner',
			name: fieldname,
			fieldLabel: '',
			fromTitle: NP.Translator.translate('Unassigned Users'),
			toTitle: NP.Translator.translate('Assigned Users'),
			width: 800,
			height: 200,
			autoLoad: false,
			allowBlank: false,
			store: me.userStore
		}
	},

	addGroupSection: function(fieldname) {
		var me = this;

		return {
			itemId: fieldname,
			xtype: 'shared.roleassigner',
			name: fieldname,
			fieldLabel: '',
			fromTitle: NP.Translator.translate('Unassigned User Groups'),
			toTitle: NP.Translator.translate('Assigned User Groups'),
			width: 800,
			height: 200,
			autoLoad: false,
			allowBlank: false,
			store: me.groupStore
		}
	},

	toggleAddForwardButton: function() {
		var me = this,
			fn = 'disable',
			routeform = me.down('[name="routeform"]');

		var valuefrom = routeform.down('[name="originatesfrom"]').getGroupValue(),
			valueto   = routeform.down('[name="forwardto"]').getGroupValue();

		if (valuefrom !== null && valueto !== null) {
			fn = 'enable';
		}

		console.log("Ext.ComponentQuery.query('#buttonWorkflowAddForward')", Ext.ComponentQuery.query('#buttonWorkflowAddForward'));
		Ext.ComponentQuery.query('#buttonWorkflowAddForward')[0][fn]();
	}
});
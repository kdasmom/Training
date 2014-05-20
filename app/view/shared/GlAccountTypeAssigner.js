/**
 * Created by Andrey Baranov
 * date: 4/25/2014 2:11 PM
 */

Ext.define('NP.view.shared.GlAccountTypeAssigner', {
	extend: 'NP.lib.ui.Assigner',
	alias: 'widget.shared.glaccounttypeassigner',

	requires: ['NP.lib.core.Config'],

	fieldLabel: 'GL Types',
	name        : 'glaccounttype_id',
	displayField: 'glaccounttype_name',
	valueField  : 'glaccounttype_id',
	fromTitle   : 'Unassigned',
	toTitle     : 'Assigned',
	msgTarget   : 'under',
	height: 200,

	initComponent: function() {

		this.fieldLabel = NP.Translator.translate(this.fieldLabel);

		if (!this.store) {
			this.store = Ext.create('NP.store.gl.GlAccountTypes', {
				service     : 'GLService',
				action      : 'getTypes',
				autoLoad    : true
			});
		}

		this.callParent(arguments);
	}
});
/**
 * Model for a GlAccountType
 *
 * @author aliaksandr Zubik
 */
Ext.define('NP.model.gl.GlAccountType', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'glaccounttype_id',
	fields: [
		{ name: 'glaccounttype_id', type: 'int' },
		{ name: 'glaccounttype_name' }
	]
});
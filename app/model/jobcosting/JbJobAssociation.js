/**
 * Model for a JbJobAssociation
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.jobcosting.JbJobAssociation', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.model.jobcosting.JbContract',
		'NP.model.jobcosting.JbChangeOrder',
		'NP.model.jobcosting.JbJobCode',
		'NP.model.jobcosting.JbPhaseCode',
		'NP.model.jobcosting.JbCostCode'
	],

	idProperty: 'jbjobassociation_id',
	fields: [
		{ name: 'jbjobassociation_id', type: 'int' },
		{ name: 'table_name' },
		{ name: 'jbjobcode_id', type: 'int' },
		{ name: 'jbcontract_id', type: 'int' },
		{ name: 'tablekey_id', type: 'int' },
		{ name: 'jbcostcode_id', type: 'int' },
		{ name: 'jbassociation_retamt', type: 'float' },
		{ name: 'jbassociation_retglaccount', type: 'int' },
		{ name: 'jbchangeorder_id', type: 'int' },
		{ name: 'jbphasecode_id', type: 'int' }
	]
});
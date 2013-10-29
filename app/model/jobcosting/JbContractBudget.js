/**
 * Model for a JbContractBudget
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.jobcosting.JbContractBudget', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'jbcontractbudget_id',
	fields: [
		{ name: 'jbcontractbudget_id', type: 'int' },
		{ name: 'jbcontract_id', type: 'int' },
		{ name: 'jbcostcode_id', type: 'int' },
		{ name: 'jbjobcode_id', type: 'int' },
		{ name: 'jbcontractbudget_amt' },
		{ name: 'jbcontractbudget_amt_actual' },
		{ name: 'jbcontractbudget_amt_pnactual' },
		{ name: 'jbchangeorder_id', type: 'int' },
		{ name: 'jbphasecode_id', type: 'int' }
	]
});
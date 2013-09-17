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
		{ name: 'jbassociation_retamt' },
		{ name: 'jbassociation_retglaccount', type: 'int' },
		{ name: 'jbchangeorder_id', type: 'int' },
		{ name: 'jbphasecode_id', type: 'int' }
	],

	belongsTo: [
        {
			model     : 'NP.model.jobcosting.JbContract',
			name      : 'contract',
			getterName: 'getContract',
			foreignKey: 'jbcontract_id',
			primaryKey: 'jbcontract_id',
			reader    : 'jsonflat'
        },{
			model     : 'NP.model.jobcosting.JbChangeOrder',
			name      : 'changeOrder',
			getterName: 'getChangeOrder',
			foreignKey: 'jbchangeorder_id',
			primaryKey: 'jbchangeorder_id',
			reader    : 'jsonflat'
        },{
			model     : 'NP.model.jobcosting.JbJobCode',
			name      : 'jobCode',
			getterName: 'getJobCode',
			foreignKey: 'jbjobcode_id',
			primaryKey: 'jbjobcode_id',
			reader    : 'jsonflat'
        },{
			model     : 'NP.model.jobcosting.JbPhaseCode',
			name      : 'phaseCode',
			getterName: 'getPhaseCode',
			foreignKey: 'jbphasecode_id',
			primaryKey: 'jbphasecode_id',
			reader    : 'jsonflat'
        },{
			model     : 'NP.model.jobcosting.JbCostCode',
			name      : 'costCode',
			getterName: 'getCostCode',
			foreignKey: 'jbcostcode_id',
			primaryKey: 'jbcostcode_id',
			reader    : 'jsonflat'
        }
    ]
});
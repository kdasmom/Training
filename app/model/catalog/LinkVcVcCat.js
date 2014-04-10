/**
 * Created by Andrey Baranov
 * date: 11/29/13 1:04 PM
 */


Ext.define('NP.model.catalog.LinkVcVcCat', {
	extend: 'Ext.data.Model',

	requires: [
		'NP.lib.core.Config',
		'NP.model.catalog.Vc',
		'NP.model.catalog.VcCat'
	],

	idProperty: 'link_vc_vccat_id',
	fields: [
		{ name: 'link_vc_vccat_id', type: 'int' },
		{ name: 'vc_id', type: 'int' },
		{ name: 'vccat_id', type: 'int' },
		{
			name: 'vccat_name', defaultValue: ''
		}
	],

	belongsTo: [
		{
			model         : 'NP.model.catalog.Vc',
			name          : 'vc_catalogname',
			getterName    : 'getVc',
			foreignKey    : 'vc_id',
			primaryKey    : 'vc_id'
		},
		{
			model         : 'NP.model.catalog.VcCat',
			name          : 'vccat_name',
			getterName    : 'getVcCat',
			foreignKey    : 'vccat_id',
			primaryKey    : 'vccat_id'
		}
	]
});
/**
 * Model for a Vendor Catalog
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.catalog.Vc', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config','NP.lib.core.Security'],

	idProperty: 'vc_id',
	fields: [
		{ name: 'vc_id', type: 'int' },
		{ name: 'vc_vendorname' },
		{ name: 'vc_catalogname' },
		{ name: 'vc_createdt', type: 'date' },
		{ name: 'vc_createdby', type: 'int' },
		{ name: 'vc_lastupdatedt', type: 'date' },
		{ name: 'vc_lastupdateby', type: 'int' },
		{ name: 'vc_totalItems', type: 'int', defaultValue: 0 },
		{ name: 'vc_status', type: 'int', defaultValue: -1 },
		{ name: 'vc_unique_id' },
		{ name: 'vc_catalogtype', defaultValue: 'excel' },
		{ name: 'vc_url' },
		{ name: 'vc_logo_filename' },
		{ name: 'vc_punchout_url' },
		{ name: 'vc_punchout_username' },
		{ name: 'vc_punchout_pwd' },
		{ name: 'vc_punchout_from_duns' },
		{ name: 'vc_punchout_to_duns' },
		{ name: 'vc_posubmit_url' },
		{ name: 'vc_posubmit_username' },
		{ name: 'vc_posubmit_pwd' },
		{ name: 'vc_posubmit_from_duns' },
		{ name: 'vc_posubmit_to_duns' }
	],

	validations: [
		{ field: 'vc_vendorname' },
		{ field: 'vc_vendorname', type: 'length', max: 250 },
		{ field: 'vc_catalogname', type: 'presence' },
		{ field: 'vc_catalogname', type: 'length', max: 100 },
		{ field: 'vc_unique_id', type: 'length', max: 50 },
		{ field: 'vc_catalogtype', type: 'presence' },
		{ field: 'vc_catalogtype', type: 'length', max: 10 },
		{ field: 'vc_url', type: 'length', max: 4000 },
		{ field: 'vc_url', type: 'presence', dependency: 'vc_catalogtype', values: ['url'] },
		{ field: 'vc_logo_filename', type: 'length', max: 255 },
		{ field: 'vc_punchout_url', type: 'length', max: 2000 },
		{ field: 'vc_punchout_url', type: 'presence', dependency: 'vc_catalogtype', values: ['punchout'] },
		{ field: 'vc_punchout_username', type: 'length', max: 50 },
		{ field: 'vc_punchout_username', type: 'presence', dependency: 'vc_catalogtype', values: ['punchout'] },
		{ field: 'vc_punchout_pwd', type: 'length', max: 50 },
		{ field: 'vc_punchout_pwd', type: 'presence', dependency: 'vc_catalogtype', values: ['punchout'] },
		{ field: 'vc_punchout_from_duns', type: 'length', max: 50 },
		{ field: 'vc_punchout_to_duns', type: 'length', max: 50 },
		{ field: 'vc_posubmit_url', type: 'length', max: 2000 },
		{ field: 'vc_posubmit_url', type: 'presence', groupFields: ['vc_posubmit_username','vc_posubmit_pwd','vc_posubmit_from_duns','vc_posubmit_to_duns'] },
		{ field: 'vc_posubmit_username', type: 'length', max: 50 },
		{ field: 'vc_posubmit_username', type: 'presence', groupFields: ['vc_posubmit_url','vc_posubmit_pwd','vc_posubmit_from_duns','vc_posubmit_to_duns'] },
		{ field: 'vc_posubmit_pwd', type: 'length', max: 50 },
		{ field: 'vc_posubmit_pwd', type: 'presence', groupFields: ['vc_posubmit_url','vc_posubmit_username','vc_posubmit_from_duns','vc_posubmit_to_duns'] },
		{ field: 'vc_posubmit_from_duns', type: 'length', max: 50 },
		{ field: 'vc_posubmit_to_duns', type: 'length', max: 50 }
	]
});
/**
 * Created by Andrey Baranov
 * date: 2/12/14 1:20 PM
 */

Ext.define('NP.model.system.Client', {
	extend: 'Ext.data.Model',

	requires: ['NP.lib.core.Config'],

	idProperty: 'client_id',
	fields: [
		{ name: 'client_id', type: 'int' },
		{ name: 'client_name' },
		{ name: 'client_acr' },
		{ name: 'client_status' },
		{ name: 'client_gl', type: 'int' },
		{ name: 'client_template_dir' },
		{ name: 'client_publish_dir' },
		{ name: 'client_dev_datasource' },
		{ name: 'client_hosting_datasource' },
		{ name: 'poprint_header' },
		{ name: 'poprint_footer' },
		{ name: 'asp_client_id', type: 'int' },
		{ name: 'poprint_additional_text' },
		{ name: 'client_version_id' },
		{ name: 'logo_file' }
	]
});
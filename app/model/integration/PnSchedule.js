/**
 * Created by Andrey Baranov
 * date: 3/3/14 12:22 PM
 */


Ext.define('NP.model.integration.PnSchedule', {
	extend: 'Ext.data.Model',

	requires: ['NP.lib.core.Config'],

	idProperty: 'schedule_id',
	fields: [
		{ name: 'schedule_id', type: 'int' },
		{ name: 'schedulecode' },
		{ name: 'schedulename' },
		{ name: 'integration_id', type: 'int' },
		{ name: 'database' },
		{ name: 'loadlimit', type: 'int' },
		{ name: 'lastrun_datetm', type: 'date' },
		{ name: 'seed_datetm', type: 'date' },
		{ name: 'runeveryxminutes', type: 'int' },
		{ name: 'isondemand' },
		{ name: 'isactive' },
		{ name: 'priority', type: 'float' },
		{ name: 'universal_field1' },
		{ name: 'universal_field2' },
		{ name: 'universal_field3' },

		// These fields are not database columns
		{ name: 'next_scheduled_run_time', type: 'date' }
	]
});
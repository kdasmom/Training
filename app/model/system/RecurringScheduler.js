/**
 * Model for a RecurringScheduler
 *
 * @author Thomas messier
 */
Ext.define('NP.model.system.RecurringScheduler', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'recurring_scheduler_id',
	fields: [
		{ name: 'recurring_scheduler_id', type: 'int' },
		{ name: 'table_name' },
		{ name: 'tablekey_id', type: 'int' },
		{ name: 'schedule_start_datetm', type: 'date' },
		{ name: 'schedule_end_datetm', type: 'date' },
		{ name: 'schedule_timestamps', type: 'date' },
		{ name: 'schedule_recurrence_type' },
		{ name: 'schedule_recurrence_number_week', type: 'int' },
		{ name: 'schedule_week_days' },
		{ name: 'schedule_recurrence_number_month', type: 'int' },
		{ name: 'schedule_month_day', type: 'int' },
		{ name: 'schedule_day', type: 'int' },
		{ name: 'schedule_month', type: 'int' },
		{ name: 'schedule_execution_code' },
		{ name: 'schedule_execution_template' },
		{ name: 'schedule_status', defaultValue: 'active' },
		{ name: 'schedule_emailoption', type: 'int', defaultValue: 0 },
		{ name: 'schedule_routeoption', type: 'int', defaultValue: 0 }
	]
});
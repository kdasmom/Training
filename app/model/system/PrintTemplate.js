/**
 * Created by Andrey Baranov
 * date: 2/3/14 9:41 AM
 */

Ext.define('NP.model.system.PrintTemplate', {
	extend: 'Ext.data.Model',

	requires: ['NP.lib.core.Config'],

	idProperty: 'Print_Template_Id',
	fields: [
		{ name: 'Print_Template_Id', type: 'int' },
		{ name: 'Print_Template_Name' },
		{ name: 'Print_template_label' },
		{ name: 'Print_Template_Type' },
		{ name: 'Print_Template_LastUpdateDt', type: 'date' },
		{ name: 'Print_Template_LastUpdateBy', type: 'int' },
		{ name: 'Print_Template_Data' },
		{ name: 'isActive' }
	]
});
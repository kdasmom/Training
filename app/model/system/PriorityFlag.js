/**
 * Model for a PriorityFlag
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.system.PriorityFlag', {
	extend: 'Ext.data.Model',
	
	idProperty: 'PriorityFlag_ID',
	fields: [
		{ name: 'PriorityFlag_ID', type: 'int' },
		{ name: 'PriorityFlag_ID_Alt', type: 'int' },
		{ name: 'PriorityFlag_Display' },
		{ name: 'PriorityFlag_Default', type: 'int' },
		{ name: 'PriorityFlag_Image' },
		{ name: 'PriorityFlag_ImgAlt' }
	]
});
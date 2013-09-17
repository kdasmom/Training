/**
 * Store for PriorityFlags.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.PriorityFlags', {
    extend: 'Ext.data.Store',
    alias : 'store.system.priorityflags',
	
	model: 'NP.model.system.PriorityFlag',

	data: [
		{
			PriorityFlag_ID     : 1,
			PriorityFlag_ID_Alt : 1,
			PriorityFlag_Display: 'Regular',
			PriorityFlag_Default: 1,
			PriorityFlag_Image  : 'blank.gif',
			PriorityFlag_ImgAlt : null
		},{
			PriorityFlag_ID     : 2,
			PriorityFlag_ID_Alt : 2,
			PriorityFlag_Display: 'High',
			PriorityFlag_Default: 0,
			PriorityFlag_Image  : 'icon2005_high_priority.gif',
			PriorityFlag_ImgAlt : 'Priority: High'
		},{
			PriorityFlag_ID     : 3,
			PriorityFlag_ID_Alt : 3,
			PriorityFlag_Display: 'Urgent',
			PriorityFlag_Default: 0,
			PriorityFlag_Image  : 'icon2005_urgent_priority.gif',
			PriorityFlag_ImgAlt : 'Priority: Urgent'
		}
	]
});
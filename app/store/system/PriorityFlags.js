/**
 * Store for PriorityFlags.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.system.PriorityFlags', {
    extend: 'Ext.data.Store',
    alias : 'store.system.priorityflags',
	
	requires: ['NP.lib.core.Translator'],
	
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
	],

	constructor: function() {
		var me = this;

		me.callParent(arguments);

		// We need the locale to be loaded before we can run this because we need to localize the text
		NP.Translator.on('localeloaded', function() {
			var recs = me.getRange();
			for (var i=0; i<recs.length; i++) {
				recs[i].set('PriorityFlag_Display', NP.Translator.translate(recs[i].get('PriorityFlag_Display')));
			}
		});
	}
});
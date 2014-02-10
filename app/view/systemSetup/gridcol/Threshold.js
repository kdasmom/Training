Ext.define('NP.view.systemSetup.gridcol.Threshold', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.systemsetup.gridcol.threshold',

	text     : 'Threshold',
	dataIndex: 'wfrule_number',


	renderer : function(val, meta, rec) {
		var description = '',
			wfruletype_tablename = (rec.data.wfruletype_tablename != null) ? rec.data.wfruletype_tablename.toLowerCase() : null,
			wfrule_string = (rec.data.wfrule_string != null) ? rec.data.wfrule_string.toLowerCase() : null,
			wfrule_operand = (rec.data.wfrule_operand != null) ? rec.data.wfrule_operand.toLowerCase() : null;

		if (rec.data.wfrule_operand !== null) {
			if (wfruletype_tablename == 'budget' && rec.data.wfruletype_id != 12) {
				description += 'If the variance is ';
			} else if (wfruletype_tablename == 'userprofile') {
				description += 'If the assigned user has ';
			} else if (wfruletype_tablename == 'email' || rec.data.wfruletype_id == 12) {
			} else {
				description += 'If total amount is ';
			}

			description += rec.data.wfrule_operand + ' ';
			if (wfrule_string == 'actual') {
				description += rec.data.wfrule_number + ' ';
				if (wfrule_operand == 'in range') {
					description += rec.data.wfrule_number_end + ' ';
				}
			} else if (wfrule_string == 'percentage') {
				description += rec.data.wfrule_number;
			} else {
				description += rec.data.wfrule_string;
			}
		}

		return description;
	}
});
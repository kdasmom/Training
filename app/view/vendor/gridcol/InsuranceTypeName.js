/**
 * Grid column for Insurance Type Name
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.vendor.gridcol.InsuranceTypeName', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.vendor.gridcol.insurancetypename',

	text     : 'Insurance Type',
	dataIndex: 'insurancetype_name',
	
	renderer: function(val, meta, rec) {
		if (rec.getInsuranceType) {
			return rec.getInsuranceType().get('insurancetype_name');
		}

		return val;
	}
});
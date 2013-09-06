/**
 * Grid column for Remittance Advice
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.invoice.gridcol.RemittanceAdvice', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.invoice.gridcol.remittanceadvice',

	text     : 'Remittance Advice',
	dataIndex: 'remit_advice',
	renderer : function(val) {
		if (val === 1) {
			return 'Yes';
		}

		return 'No';
	}
});
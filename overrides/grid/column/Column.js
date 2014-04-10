/* Override getStateId() to use dataIndex as default stateId for a column so that
	column state is properly saved and restored without having to specify a
	stateId for every column */
Ext.define('overrides.grid.column.Column', {
	override: 'Ext.grid.column.Column',

	getStateId: function () {
        return this.stateId || this.dataIndex || this.headerId;
    }
});
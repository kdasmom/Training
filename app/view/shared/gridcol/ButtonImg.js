/**
 * Generic grid column for showing an image as an image button
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.gridcol.ButtonImg', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.shared.gridcol.buttonimg',

	tdCls: 'image-button-cell',
    align: 'center',

    renderer: function(val) {
        return '<img src="resources/images/buttons/'+imgName+'_button.gif" title="'+name+'" alt="'+name+'" />'
    }
});
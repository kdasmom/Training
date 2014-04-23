// Modified at line 25 below to add the option of passing in configuration options for the editor
Ext.define('overrides.grid.plugin.CellEditing', {
	override: 'Ext.grid.plugin.CellEditing',

	getEditor: function(record, column) {
        var me = this,
            editors = me.editors,
            editorId = column.getItemId(),
            editor = editors.getByKey(editorId),
            // Add to top level grid if we are editing one side of a locking system
            editorOwner = me.grid.ownerLockable || me.grid;

        if (!editor) {
            editor = column.getEditor(record);
            if (!editor) {
                return false;
            }

            // Allow them to specify a CellEditor in the Column
            if (editor instanceof Ext.grid.CellEditor) {
                editor.floating = true;
            }
            // But if it's just a Field, wrap it.
            else {
            	var editorCfg = (editor.editorCfg) ? editor.editorCfg : {};
            	editorCfg = Ext.applyIf(editorCfg, {
                    floating: true,
                    editorId: editorId,
                    field: editor
                });
                editor = new Ext.grid.CellEditor(editorCfg);
            }
            // Add the Editor as a floating child of the grid
            editorOwner.add(editor);
            editor.on({
                scope: me,
                specialkey: me.onSpecialKey,
                complete: me.onEditComplete,
                canceledit: me.cancelEdit
            });
            column.on('removed', me.cancelActiveEdit, me);
            editors.add(editor);
        }

        if (column.isTreeColumn) {
            editor.isForTree = column.isTreeColumn;
            editor.addCls(Ext.baseCSSPrefix + 'tree-cell-editor')
        }
        editor.grid = me.grid;
        
        // Keep upward pointer correct for each use - editors are shared between locking sides
        editor.editingPlugin = me;
        return editor;
    }
});
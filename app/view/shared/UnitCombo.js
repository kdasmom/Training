/**
 * Generic combo for GL Accounts
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.UnitCombo', {
    extend: 'NP.lib.ui.AutoComplete',
    alias: 'widget.shared.unitcombo',
    
    requires: ['NP.model.property.Unit'],

    fieldLabel: 'GL Account',

    name               : 'unit_id',
    displayField       : 'unit_number',
    valueField         : 'unit_id',
    width              : 400,
    queryMode          : 'local',

    initComponent: function() {
        if (!this.store) {
            this.store = Ext.create('NP.store.property.Units', {
                           service : 'PropertyService',
                           action  : 'getUnits'
                        });
        }

        this.callParent(arguments);
    }
});
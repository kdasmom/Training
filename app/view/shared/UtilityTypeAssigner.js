/**
 * @author Baranov A.V.
 * @date 9/25/13
 */


Ext.define('NP.view.shared.UtilityTypeAssigner', {
    extend: 'Ext.ux.form.ItemSelector',
    alias: 'widget.shared.utilitytypeassigner',

    fieldLabel: 'Utility Type',

    name        : 'utilitytypes',
    store       : Ext.create('NP.store.utility.UtilityTypes', {
        service     : 'UtilityTypeService',
        action      : 'findAll',
        autoLoad    : true
    }),
    displayField: 'UtilityType',
    valueField  : 'UtilityType_Id',
    fromTitle   : 'Unassigned',
    toTitle     : 'Assigned',
    buttons     : ['add','remove'],
    msgTarget   : 'under'
});
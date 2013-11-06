/**
 * @author Baranov A.V.
 * @date 9/25/13
 */


Ext.define('NP.view.shared.UtilityTypeAssigner', {
    extend: 'Ext.ux.form.field.BoxSelect',
    alias: 'widget.shared.utilitytypeassigner',

    requires: ['NP.store.vendor.UtilityTypes'],

    fieldLabel: 'Utility Type',

    name        : 'utilitytypes',
    displayField: 'UtilityType',
    valueField  : 'UtilityType_Id',
    msgTarget   : 'under',
    width       : 500,
    queryMode   : 'local',
    store       : {
        type    : 'vendor.utilitytypes',
        service : 'UtilityService',
        action  : 'getAllUtilityTypes',
        autoLoad: true
    }
});
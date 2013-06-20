/**
 * Store for Unit Type Measurments.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.property.UnitTypeMeasurements', {
    extend: 'NP.lib.data.Store',
    
    fields: [
        { name: 'unittype_meas_id', type: 'int' },
        { name: 'unittype_meas_name' },
        { name: 'unittype_material_id', type: 'int' },
        { name: 'unittype_material_name' }
    ]
});
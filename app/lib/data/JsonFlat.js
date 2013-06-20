/**
 * This special reader reads belongsTo data from the root data node instead of using the an association key
 *
 * @author Thomas Messier
 */
Ext.define('NP.lib.data.JsonFlat', {
    extend: 'Ext.data.reader.Json',
    alias : 'reader.jsonflat',
    
   readAssociated: function(record, data) {
        var associations = record.associations.items,
            i            = 0,
            length       = associations.length,
            association, associationData, proxy, reader, field;
        
        for (; i < length; i++) {
            association     = associations[i];
            // If the association is belongsTo or hasOne
            if (association.type == 'belongsTo' || association.type == 'hasOne') {
                if (association.prefix) {
                    associationData = {};
                    for (field in data) {
                        if (field.substring(0, association.prefix.length) == association.prefix) {
                            associationData[field.replace(association.prefix, '')] = data[field];
                        }
                    }
                } else {
                    associationData = data;
                }
            } else {
                associationData = this.getAssociatedDataRoot(data, association.associationKeyFunction || association.associationKey || association.name);
            }
            if (associationData) {
                reader = association.getReader();
                if (!reader) {
                    proxy = association.associatedModel.getProxy();
                    // if the associated model has a Reader already, use that, otherwise attempt to create a sensible one
                    if (proxy) {
                        reader = proxy.getReader();
                    } else {
                        reader = new this.constructor({
                            model: association.associatedName
                        });
                    }
                }
                association.read(record, reader, associationData);
            }  
        }
    }
});
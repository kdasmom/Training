/**
 * Model for a Phone
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.contact.Phone', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'phone_id',
	fields: [
		{ name: 'phone_id', type: 'int' },
		{ name: 'phonetype_id', type: 'int' },
		{ name: 'tablekey_id', type: 'int' },
		{ name: 'table_name' },
		{ name: 'phone_number', useNull: false },
		{ name: 'phone_ext', useNull: false },
		{ name: 'phone_countrycode', useNull: false }
	],

	validations: [
		{ field: 'table_name', type: 'length', max: 100 },
		{ field: 'phone_number', type: 'length', max: 25 },
		{ field: 'phone_ext', type: 'length', max: 25 },
		{ field: 'phone_countrycode', type: 'length', max: 25 }
	],

	getFullPhone: function() {
		return NP.model.contact.Phone.getFullPhone(this);
	},

	statics: {
		getFullPhone: function(rec) {
			if (!rec.get) {
				rec = Ext.create('NP.model.contact.Phone', rec);
			}
			var fullPhone   = '',
				phoneNumber = (rec.get('phone_number') === null) ? '' : rec.get('phone_number');

			if (rec.get('phone_countrycode') != '' && rec.get('phone_countrycode') !== null) {
				fullPhone += '+' + rec.get('phone_countrycode');
			}

			if (phoneNumber != '') {
				var phoneStripped = phoneNumber.replace(/[^\d]/g, '')
				if (phoneStripped.length == 10) {
					phoneNumber = '(' + phoneStripped.substr(0, 3) + ') ' + phoneStripped.substr(3, 3) + '-' + phoneStripped.substr(6, 4);
				}
				if (fullPhone != '') {
					fullPhone += ' ';
				}
				fullPhone += phoneNumber;

				if (rec.get('phone_ext') != '' && rec.get('phone_ext') !== null) {
					fullPhone += ' x' + rec.get('phone_ext');
				}
			}

			return fullPhone;
		}
	}
});
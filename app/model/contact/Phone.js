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
		var fullPhone   = '',
			phoneNumber = (this.get('phone_number') === null) ? '' : this.get('phone_number');

		if (this.get('phone_countrycode') != '' && this.get('phone_countrycode') !== null) {
			fullPhone += '+' + this.get('phone_countrycode');
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

			if (this.get('phone_ext') != '' && this.get('phone_ext') !== null) {
				fullPhone += ' x' + this.get('phone_ext');
			}
		}

		return fullPhone;
	}
});
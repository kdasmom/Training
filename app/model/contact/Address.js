/**
 * Model for a Address
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.contact.Address', {
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'address_id',
	fields: [
		{ name: 'address_id', type: 'int' },
		{ name: 'addresstype_id', type: 'int' },
		{ name: 'tablekey_id', type: 'int' },
		{ name: 'table_name' },
		{ name: 'address_attn', useNull: false },
		{ name: 'address_company', useNull: false },
		{ name: 'address_line1', useNull: false },
		{ name: 'address_line2', useNull: false },
		{ name: 'address_line3', useNull: false },
		{ name: 'address_city', useNull: false },
		{ name: 'address_state', useNull: false },
		{ name: 'address_zip', useNull: false },
		{ name: 'address_zipext', useNull: false },
		{ name: 'address_country', type: 'int' },
		{ name: 'address_id_alt' }
	],

	validations: [
		{ field: 'table_name', type: 'length', max: 100 },
		{ field: 'address_attn', type: 'length', max: 255 },
		{ field: 'address_company', type: 'length', max: 255 },
		{ field: 'address_line1', type: 'length', max: 255 },
		{ field: 'address_line2', type: 'length', max: 255 },
		{ field: 'address_line3', type: 'length', max: 255 },
		{ field: 'address_city', type: 'length', max: 100 },
		{ field: 'address_state', type: 'length', max: 25 },
		{ field: 'address_zip', type: 'format', matcher: /(\d{5})/ },
		{ field: 'address_zipext', type: 'format', matcher: /(\d{4})/ },
		{ field: 'address_country', type: 'length', max: 100 },
		{ field: 'address_id_alt', type: 'length', max: 50 }
	],

	getHtml: function() {
		return NP.model.contact.Address.getHtml(this);
	},

	statics: {
		getHtml: function(rec) {
			if (!rec.get) {
				rec = Ext.create('NP.model.contact.Address', rec);
			}
			var html  = '',
				city  = (rec.get('address_city') === null) ? '' : rec.get('address_city'),
				state = (rec.get('address_state') === null) ? '' : rec.get('address_state'),
				zip   = (rec.get('address_zip') === null) ? '' : rec.get('address_zip');

			for (var i=1; i<=3; i++) {
				if (rec.get('address_line'+i) !== '' && rec.get('address_line'+i) !== null) {
					html += '<div>' + rec.get('address_line'+i) + '</div>';
				}
			}

			if (city != '' || state != '' || zip) {
				html += '<div>';
				if (city != '') {
					html += city;
					if (state != '') {
						html += ', ';
					} else if (zip != '') {
						html += ' ';
					}
				}
				if (state != '') {
					html += state;
					if (zip != '') {
						html += ' ';
					}
				}
				if (zip != '') {
					html += zip;
					if (rec.get('address_zipext') != '' && rec.get('address_zipext') !== null) {
						html += '-' + rec.get('address_zipext');
					}
				}

				html += '</div>';
			}

			if (rec.get('address_country') !== null) {
				var country = Ext.getStore('system.Countries').query('id', rec.get('address_country'));
				if (country.getCount()) {
					html += '<div>' + country.getAt(0).get('name') + '</div>';
				}
			}

			return html;
		}
	}
});
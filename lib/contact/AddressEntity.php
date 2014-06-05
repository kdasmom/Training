<?php
namespace NP\contact;

/**
 * Entity class for Address
 *
 * @author Thomas Messier
 */
class AddressEntity extends \NP\core\AbstractEntity {
	
	protected $fields = array(
		'address_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'addresstype_id'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'tablekey_id'	 => array(
			'required'   => true,
			'validation' => array(
				'digits' => array()
			)
		),
		'table_name'	 => array(
			'required'   => true,
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'address_attn'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'address_company'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'address_line1'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'address_line2'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'address_line3'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>255)
			)
		),
		'address_city'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>100)
			)
		),
		'address_state'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>25)
			)
		),
		'address_zip'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		),
		'address_zipext'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>4)
			)
		),
		'address_country'	 => array(
			'validation' => array(
				'digits' => array()
			)
		),
		'address_id_alt'	 => array(
			'validation' => array(
				'stringLength' => array('max'=>50)
			)
		)
	);

	/**
	 * Returns a formatted full address
	 */
	public static function getFullAddress($address, $countryGateway) {
		$formatted = '';

		for ($i=1; $i<=3; $i++) {
			$field = "address_line{$i}";
			if (!empty($address[$field])) {
				if (!empty($formatted)) {
					$formatted .= "\n";
				}
				$formatted .= $address[$field];
			}
		}

		if (!empty($address['address_city']) || !empty($address['address_state']) || !empty($address['address_zip'])) {
			if (!empty($formatted)) {
				$formatted .= "\n";
			}
			if (!empty($address['address_city'])) {
				$formatted .= $address['address_city'];
				if (!empty($address['address_state'])) {
					$formatted .= ', ';
				} else if (!empty($address['address_zip'])) {
					$formatted .= ' ';
				}
			}
			if (!empty($address['address_state'])) {
				$formatted .= $address['address_state'];
				if (!empty($address['address_zip'])) {
					$formatted .= ' ';
				}
			}
			if (!empty($address['address_zip'])) {
				$formatted .= $address['address_zip'];
				if (!empty($address['address_zipext'])) {
					$formatted .= '-' . $address['address_zipext'];
				}
			}
		}

		if (!empty($address['address_country'])) {
			$country = $countryGateway->findValue('country_id = ?', [$address['address_country']], 'country_name');
			if ($country !== null) {
				if (!empty($formatted)) {
					$formatted .= "\n";
				}
				$formatted .= $country;
			}
		}

		return $formatted;
	}
}
?>
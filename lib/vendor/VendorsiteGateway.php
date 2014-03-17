<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 10/9/13
 * Time: 6:12 PM
 */

namespace NP\vendor;


use NP\core\AbstractGateway;
use NP\core\db\Delete;
use NP\core\db\Expression;
use NP\core\db\Insert;
use NP\core\db\Select;
use NP\core\db\Update;

class VendorsiteGateway extends AbstractGateway {

	public function getVendositeCode($vendorId, $vendorsiteAddressCity, $vendorsiteStatus = null, $aspClientId) {
		$select = new Select();
		$vendorsitecode = '';

		$where = [
			'v.vendor_id' 						=> '?',
			'a.address_city'					=> '?',
			'i.asp_client_id'					=> '?',
			'a.table_name'					=> '?'
		];

		$params = [$vendorId, $vendorsiteAddressCity, $aspClientId, 'vendorsite'];
		if ($vendorsiteStatus) {
			$where['vs.vendorsite_status'] = '?';
			$params[] = $vendorsiteStatus;
		}

		$select->from(['vs' => 'vendorsite'])
					->count(true, 'site_count')
					->join(['a' => 'address'], 'vs.vendorsite_id = a.tablekey_id', [])
					->join(['v' => 'vendor'], 'vs.vendor_id = v.vendor_id', [])
					->join(['i' => 'integrationpackage'], 'v.integration_package_id = i.integration_package_id', [])
					->where($where);

		$count = $this->adapter->query($select, $params);

		$vendorsitecode = strtoupper(substr($vendorsiteAddressCity, 0, 15-strlen($count[0]['site_count'] + 1)) . strval($count[0]['site_count']));

		return $vendorsitecode;
	}

	/**
	 * Save vendorsite favorite
	 *
	 * @param $vendorsiteId
	 * @param $propertyId
	 * @return array|bool
	 */
	public function insertFavorite($vendorsiteId, $propertyId, $action) {

		$result = $this->deleteVendorFavorite($vendorsiteId, $propertyId);

		if ($action == 'remove') {
			return $result;
		}

		$insert = new Insert();

		$insert->into('vendorfavorite')
					->columns(['vendorsite_id', 'property_id'])
					->values(Select::get()->columns([new Expression('?'), new Expression('?')]));

		$result =$this->adapter->query($insert, [$vendorsiteId, $propertyId]);

		return $result;
	}

	/**
	 * Approve vendorsite
	 *
	 * @param $asp_client_id
	 * @param $vendor_id
	 * @param $vendorsite_id
	 * @param $userprofile_id
	 * @param $approvalStatus
	 * @param $skipMessages
	 */
	public function vendorsiteApprove($asp_client_id, $approval_tracking_id, $vendorsite_id, $approvalStatus) {
		if ($approval_tracking_id && $approval_tracking_id == $vendorsite_id) {
			$result = $this->update(
				[
					'vendorsite_status'	=> $approvalStatus
				],
				[
					'vendorsite_id'	=> '?'
				],
				[$vendorsite_id]
			);

			if ($result) {

				return false;
			}
			$out_vendorsite_id = $vendorsite_id;
		} else {
			$select = new Select();

			$select->from(['vs' => 'vendorsite'])
					->columns([
						'vendorsite_code',
						'vendorsite_lastupdate_date',
						'vendorsite_ship_to_location_id',
						'vendorsite_bill_to_location_id',
						'term_id',
						'bill_contact_id',
						'paygroup_code',
						'paydatebasis_code',
						'freightterms_code',
						'vendorsite_note',
						'submit_userprofile_id',
						'vendor_universalfield1'
					])
					->join(['v' => 'vendor'], 'vs.vendor_id = v.vendor_id', [])
					->join(['i' => 'integrationpackage'], 'i.integration_package_id = v.integration_package_id', [])
					->join(['a' => 'address_view'], "vs.vendorsite_id = a.tablekey_id AND a.table_name = 'vendorsite' AND a.addresstype_name = 'Mailing'", ['addresstype_id', 'address_line1', 'address_line2', 'address_city', 'address_state', 'address_zip', 'address_zipext'])
					->join(['p' => 'phone_view'], "vs.vendorsite_id = p.tablekey_id AND p.table_name = 'vendorsite' AND p.phonetype_name = 'Main'", ['site_phone_number' => 'phone_number', 'site_phone_ext' => 'phone_ext'])
					->join(['p2' => 'phone_view'], "vs.vendorsite_id = p2.tablekey_id AND p2.table_name = 'vendorsite' AND p2.phonetype_name = 'Fax'", ['site_fax_number' => 'phone_number'])
					->join(['e' => 'email_view'], "vs.vendorsite_id = e.tablekey_id AND e.table_name = 'vendorsite' AND e.emailtype_name = 'Primary'", ['site_email_address' => 'email_address'])
					->join(['c' => 'contact_view'], "vs.vendorsite_id = c.tablekey_id AND c.table_name = 'vendorsite' AND c.contacttype_name = 'Vendor Contact'", ['person_firstname', 'person_lastname'])
					->join(['p3' => 'phone_view'], "c.contact_id = p3.tablekey_id AND p3.table_name = 'contact' AND p3.phonetype_name = 'Main'", ['contact_phone_number' => 'phone_number', 'contact_phone_ext' => 'phone_ext'])
					->where(['vs.vendorsite_id' => '?', 'i.asp_client_id' => '?']);

			$vendor = $this->adapter->query($select, [$vendorsite_id, $asp_client_id]);

			$this->update(
				[
					'vendorsite_code'					=> $vendor[0]['vendorsite_code'],
					'vendorsite_lastupdate_date'		=> $vendor[0]['vendorsite_lastupdate_date'],
					'vendorsite_ship_to_location_id'	=> $vendor[0]['vendorsite_ship_to_location_id'],
					'vendorsite_bill_to_location_id'	=> $vendor[0]['vendorsite_bill_to_location_id'],
					'term_id'							=> $vendor[0]['term_id'],
					'bill_contact_id'					=> $vendor[0]['bill_contact_id'],
					'paygroup_code'						=> $vendor[0]['paygroup_code'],
					'paydatebasis_code'					=> $vendor[0]['paydatebasis_code'],
					'freightterms_code'					=> $vendor[0]['freightterms_code'],
					'vendorsite_note'					=> $vendor[0]['vendorsite_note'],
					'submit_userprofile_id'				=> $vendor[0]['submit_userprofile_id'],
					'vendor_universalfield1'			=> $vendor[0]['vendor_universalfield1'],
					'vendorsite_status'					=> $approvalStatus
				],
				[
					'vendorsite_id'	=> '?'
				],
				[$approval_tracking_id]
			);

			$insert = new Insert();

			$insert->into('vendorfavorite')
					->columns(['vendorsite_id', 'property_id'])
					->values(Select::get()->columns([new Expression('?'), 'property_id'])
										->from(['vf' => 'vendorfavorite'])
										->whereEquals('vf.vendorsite_id', $vendorsite_id)
										->whereNotExists(Select::get()->columns([new Expression('?')])
																	->from(['vf2' => 'vendorfavorite'])
																	->whereEquals('vf2.property_id', 'vf.property_id')
																	->where([
																		'vf2.vendorsite_id'	=> '?'
																	])
										)
					);

			$this->adapter->query($insert, [$approval_tracking_id, 1, $approval_tracking_id]);


			return $vendor[0];
		}

		return $out_vendorsite_id;
	}

	/**
	 * Retrieve approval id
	 *
	 * @param $vendorsite_id
	 * @param $asp_client_id
	 * @return null
	 */
	public function findApproval($vendorsite_id, $asp_client_id) {
		$select = new Select();

		$select->from(['vs' => 'vendorsite'])
			->columns(['approval_tracking_id'])
			->join(['v' => 'vendor'], 'vs.vendor_id = v.vendor_id', [], Select::JOIN_INNER)
			->join(['i' => 'integrationpackage'], 'i.integration_package_id = v.integration_package_id', [], Select::JOIN_INNER)
			->where([
				'vs.vendorsite_id'	=> '?',
				'i.asp_client_id'	=> '?'
			]);

		$approval_id = $this->adapter->query($select, [$vendorsite_id, $asp_client_id]);

		return isset($approval_id[0]['approval_tracking_id']) ? $approval_id[0]['approval_tracking_id'] : null;
	}

	/**
	 * find address
	 *
	 * @param $vendorsite_id
	 * @param $asp_client_id
	 */
	public function findAddressAndPhoneInfoByVendorsiteId($vendorsite_id, $asp_client_id) {
		$approval_id = $this->findApproval($vendorsite_id, $asp_client_id);
		$address = [];
		if ($approval_id) {
			$select = new Select();
			$select->from(['vs' => 'vendorsite'])
				->columns([])
				->join(['v' => 'vendor'], 'vs.vendor_id = v.vendor_id', [])
				->join(['i' => 'integrationpackage'], 'i.integration_package_id = v.integration_package_id')
				->join(['a' => 'address_view'], "vs.vendorsite_id = a.tablekey_id AND a.table_name = 'vendorsite' AND a.addresstype_name = 'Mailing'", ['address_id'])
				->join(['p' => 'phone_view'], "vs.vendorsite_id = p.tablekey_id AND p.table_name = 'vendorsite' AND p.phonetype_name = 'Main'", ['site_phone_id' => 'phone_id'])
				->join(['p2' => 'phone_view'], "vs.vendorsite_id = p2.tablekey_id AND p2.table_name = 'vendorsite' AND p2.phonetype_name = 'Fax'", ['site_fax_id' => 'phone_id'])
				->join(['e' => 'email_view'], "vs.vendorsite_id = e.tablekey_id AND e.table_name = 'vendorsite' AND e.emailtype_name = 'Primary'", ['site_email_id' => 'email_id'])
				->join(['c' => 'contact_view'], "vs.vendorsite_id = c.tablekey_id AND c.table_name = 'vendorsite' AND c.contacttype_name = 'Vendor Contact'", ['person_id'])
				->join(['p3' => 'phone_view'], "c.contact_id = p3.tablekey_id AND p3.table_name = 'contact' AND p3.phonetype_name = 'Main'", ['contact_phone_id' => 'phone_id'])
				->where(['vs.vendorsite_id' => '?', 'i.asp_client_id' => '?']);

			$address = $this->adapter->query($select, [$approval_id, $asp_client_id]);
		}

		return count($address) ? $address[0] : $address;
	}
	
	/**
	 * Gets a vendorsite record using a vendor code
	 */
	public function findByVendorCode($vendor_id_alt, $integration_package_id) {
		$select = Select::get()->from(array('vs'=>'vendorsite'))
								->join(new sql\join\VendorsiteVendorJoin())
								->whereEquals('v.vendor_id_alt', '?')
								->whereEquals('v.integration_package_id', '?')
								->whereEquals('vs.vendorsite_status', '?');

		return $this->adapter->query($select, array($vendor_id_alt, $integration_package_id, 'active'));
	}


	/**
	 * Delete vendorfavorite
	 *
	 * @param $vendorsite_id
	 * @param null $property_id
	 */
	public function deleteVendorFavorite($vendorsite_id, $property_id = null) {
		$delete = new Delete();

		$where = [
			'vendorsite_id'	=> '?'
		];
		if ($property_id) {
			$where['property_id'] = '?';
		}
		$delete->from('vendorfavorite')
			->where($where);

		$result = $this->adapter->query($delete, [$vendorsite_id, $property_id]);

		return $result;
	}


	/**
	 * Rertieve alternate addresses
	 *
	 * @param $vendorsite_id
	 * @param $vendor_id
	 * @param bool $returnAll
	 * @return array|bool
	 */
	public function findAlternateAddresses($vendor_id, $vendorsite_id, $returnAll = false) {
		$select = new Select();

		$where = [
			'a.table_name' => '?'
		];
		$params = ['vendorsite'];
		if ($vendor_id) {
			$where['vs.vendor_id'] = '?';
			$params[] = $vendor_id;
		}
		if ($vendorsite_id) {
			$where['vs.vendorsite_id'] = '?';
			$params[] = $vendorsite_id;
		}
		if (!$returnAll) {
			$where['at.addresstype_name'] = '?';
			$params[] = 'Alternate';
		}


		$select->from(['vs' => 'vendorsite'])
				->join(['a' => 'address'], 'a.tablekey_id = vs.vendorsite_id', ['address_id', 'address_id_alt', 'address_line1', 'address_line2', 'address_city', 'address_state', 'address_zip', 'address_zipext', 'address_country'])
				->join(['at' => 'addresstype'], 'a.addresstype_id = at.addresstype_id', [])
				->join(['c' => 'country'], 'a.address_country = c.country_id', ['country_name'], Select::JOIN_LEFT)
				->where($where);

		return $this->adapter->query($select, $params);
	}

	/**
	 * active vendor
	 *
	 * @param $vendor_id
	 * @param $vendor_status
	 */
	public function vendorsiteActive($vendor_id, $vendor_status) {
		$update = new Update();

		$update->table('vendorsite')
				->values([
					'vendorsite_status'	=> '?'
				])
				->where(['vendor_id' => '?'])
				->whereNest('OR')
				->whereEquals('vendorsite_status', "'active'")
				->whereEquals('vendorsite_status', "'inactive'");

		$this->adapter->query($update, [$vendor_status, $vendor_id]);
	}

	/**
	 * Retrieve site count
	 *
	 * @param $vendor_id
	 * @return mixed
	 */
	public function findSiteCount($vendor_id) {
		$select = new Select();

		$select->from('vendorsite')
				->count(true, 'sitecount')
				->where(['vendor_id' => '?']);

		$result = $this->adapter->query($select, [$vendor_id]);

		return $result[0]['sitecount'];
	}

	/**
	 * Retrieve city and vendorstite code
	 *
	 * @param $vendorsite_id
	 * @param $asp_client_id
	 */
	public function getCurrentCityAndVendorsiteCode($vendorsite_id, $asp_client_id) {
		$select = new Select();
		$select->from(['vs' => 'vendorsite'])
				->columns(['vendorsite_code'])
				->join(['a' => 'address'], 'vs.vendorsite_id = a.tablekey_id', ['address_city'])
				->join(['v' => 'vendor'], 'v.vendor_id = vs.vendor_id', [])
				->join(['ip' => 'integrationpackage'], 'v.integration_package_id = ip.integration_package_id', [])
				->where(
					['vs.vendorsite_id' => '?', 'ip.asp_client_id' => '?']
			);

		$result = $this->adapter->query($select, [$vendorsite_id, $asp_client_id]);

		return $result[0];
	}

}
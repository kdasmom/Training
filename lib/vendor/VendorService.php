<?php

namespace NP\vendor;

use NP\system\BaseImportService;

/**
 * Service class for operations related to vendors
 *
 * @author Thomas Messier
 */
class VendorService extends BaseImportService {
	
	/**
	 * @var \NP\vendor\VendorGateway
	 */
	protected $vendorGateway;
	
	/**
	 * @param \NP\vendor\VendorGateway $vendorGateway VendorGateway object injected
	 */
	public function __construct(VendorGateway $vendorGateway) {
		$this->vendorGateway = $vendorGateway;
	}
	
	/**
	 * Retrieves vendor records for the vendor autocomplete when creating catalogs
	 *
	 * @param  string $keyword Keyword to use to search for a vendor
	 * @return array           Array of vendor records
	 */
	public function getForCatalogDropDown($keyword) {
		return $this->vendorGateway->getForCatalogDropDown($keyword);
	}

	/**
	 * Retrieves vendor records matching a specified tax ID. A tax ID can be provided, otherwise a vendor ID can
	 * be provided and all vendors with the same tax ID as the specified vendor will be returned.
	 *
	 * @param  string [$vendor_fedid] Tax ID to search for
	 * @param  int    [$vendor_id]    ID for the vendor who's tax ID you want to find matching vendors for
	 * @return array                  Array of vendor records
	 */
	public function getByTaxId($vendor_fedid=null, $vendor_id=null) {
		if ($vendor_fedid === null) {
			$rec = $this->vendorGateway->findById($vendor_id, array('vendor_fedid'));
			$vendor_fedid = $rec['vendor_fedid'];
		}

		return $this->vendorGateway->find(
			array('vendor_fedid'=>'?'),
			array($vendor_fedid),
			'vendor_name ASC',
			array('vendor_id','vendor_id_alt','vendor_name')
		);
	}

    /**
     * This must be implemented in child class.
     * Method accept row and entity class to save in related gateway.
     *
     * @param \ArrayObject $data Row array for entity defined in next param
     * @param string $entityClass Entity class to map data
     */
    public function save(\ArrayObject $data, $entityClass)
    {
        // TODO: Implement save() method.
    }
}

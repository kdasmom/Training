<?php

namespace NP\image;

use NP\core\AbstractGateway;

use NP\core\db\Where;
use NP\core\db\Select;
use NP\core\db\Insert;
use NP\core\db\Delete;
use NP\core\db\Update;
use NP\core\db\Expression;
use NP\property\PropertyContext;
use NP\property\sql\PropertyFilterSelect;

class ImageIndexGateway extends AbstractGateway {
	protected $table = 'image_index';
        protected $pk = 'Image_Index_Id';

        private $columns1 = [
            'Image_Index_Id',
            'Image_Index_VendorSite_Id',
            'Property_Id',
            'Image_Index_Name',
            'Image_Index_Ref',
            'Image_Index_Invoice_Date',
            'Image_Index_Due_Date',
            'Image_Index_Amount',
            'Image_Index_Date_Entered',
            'Tablekey_Id',
            'Image_Index_Source_Id',
            'Tableref_Id',
            'Image_Doctype_Id',
            'remit_advice',
            'PriorityFlag_ID_Alt',
            'image_index_NeededBy_datetm',
            'Image_Index_Exception_by',
            'Image_Index_Exception_datetm',
            'Image_Index_Exception_End_datetm',
            'image_index_indexed_datetm',
            'image_index_indexed_by',
            'cycle_from',
            'cycle_to',
            'utilityaccount_accountnumber',
            'utilityaccount_metersize',
            'universal_field1',
            'universal_field2',
            'universal_field3',
            'universal_field4',
            'universal_field5',
            'universal_field6',
            'universal_field7',
            'universal_field8'            
        ];

	public function findImagesToConvert($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);
		
		$select->whereMerge(new sql\criteria\ImageInvoiceDocCriteria())
				->whereMerge(new sql\criteria\ImageInvoiceUnassigned())
				->whereEquals('img.Image_Index_Status', 1);

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'image_index_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}

	public function findImagesToProcess($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);
		
		if ($countOnly != 'true') {
			$select->columnPendingDays();
		}

		$select->join(new sql\join\ImageIndexInvoiceJoin())
				->whereEquals('img.image_index_primary', 1)
				->whereEquals('i.invoice_status', "'open'");

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'image_index_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}

	public function findImageExceptions($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);
		
		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		// We're going to create a where object to overwrite the entire where clause because
		// we need the property filter to be within a nested block
		$where = Where::get()->equals('img.Image_Index_Status', 2)
							->nest('OR')
							->equals('img.property_id', 0)
							->isNull('img.property_id')
							->in('img.property_id', $propertyFilterSelect)
							->unnest();

		$select->join(new sql\join\ImageIndexExceptionByJoin())
				->where($where);

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'image_index_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}

	public function findImagesToIndex($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);
		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));
		
		// We're going to create a where object to overwrite the entire where clause because
		// we need the property filter to be within a nested block
		$where = Where::get()->nest('OR')
							->equals('img.property_id', 0)
							->isNull('img.property_id')
							->in('img.property_id', $propertyFilterSelect)
							->unnest()
							->merge(new sql\criteria\ImageNotIndexedCriteria());

		$select->where($where);

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'image_index_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}

	protected function getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort) {
		$select = new sql\ImageSelect();
		
		if ($countOnly == 'true') {
			$select->count(true, 'totalRecs')
					->column('image_index_id');
		} else {
			$select->columns(array(
								'Image_Index_Id',
								'Image_Index_VendorSite_Id',
								//'Property_Id',
								'Image_Index_Name',
								'Image_Index_Ref',
								'Image_Index_Invoice_Date',
								'Image_Index_Due_Date',
								'Image_Index_Amount',
								'Image_Index_Date_Entered',
								'Tablekey_Id',
								'Image_Index_Source_Id',
								'Tableref_Id',
								'Image_Doctype_Id',
								'remit_advice',
								'PriorityFlag_ID_Alt',
								'image_index_NeededBy_datetm',
								'Image_Index_Exception_by',
								'Image_Index_Exception_datetm',
								'Image_Index_Exception_End_datetm',
								'image_index_indexed_datetm',
								'image_index_indexed_by',
								'image_index_deleted_datetm',
								'image_index_deleted_by',
								'cycle_from',
								'cycle_to',
								'utilityaccount_accountnumber',
								'utilityaccount_metersize',
								'universal_field1',
								'universal_field2',
								'universal_field3',
								'universal_field4',
								'universal_field5',
								'universal_field6',
								'universal_field7',
								'universal_field8'
							))
					->columnDaysOustanding()
					->order($sort);
		}

		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		$select->join(new sql\join\ImageIndexImageSourceJoin())
			->join(new sql\join\ImageIndexDocTypeJoin())
			->join(new sql\join\ImageIndexIndexedByJoin())
			->join(new sql\join\ImageIndexPropertyJoin())
			->join(new sql\join\ImageIndexVendorsiteJoin())
			->join(new sql\join\ImageIndexPriorityFlagJoin())
			->join(new \NP\vendor\sql\join\VendorsiteVendorJoin(array('vendor_name,vendor_id_alt,vendor_status'), Select::JOIN_LEFT))
			->whereIn('img.property_id', $propertyFilterSelect);

		return $select;
	}
        
       	public function findImagesToDelete($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);
		
		/*$select->whereMerge(new sql\criteria\ImageInvoiceDocCriteria())
				->whereMerge(new sql\criteria\ImageInvoiceUnassigned())
				->whereEquals('img.Image_Index_Status', -1);*/
                $where = new Where();
                $where->isNotNull('img.image_index_deleted_datetm')
                        ->isNotNull('img.image_index_deleted_by')
                        ->greaterThan('img.Image_Index_id', 135000)
                ;
                $select->where($where);

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'image_index_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}
 

    /**
     * Delete images from database.
     * 
     * @param [] $identifiers List of image identifiers to delete.
     * @return [] Execution result.
     */
    public function deletePermanently($identifiers) {
        if (!empty($identifiers)) {
            $where = Where::get()
                ->in('image_index_id', implode(',', $identifiers))
            ;
            $delete = new Delete($this->table, $where);

            return $this->adapter->query($delete);
        }
    }

    /**
     * Mark images as deleted.
     * 
     * @param [] $identifiers List of image identifiers to delete.
     * @param int $userprofile_id User profile id who requests delete operation.
     * @return Execution result.
     */
    public function deleteTemporary($identifiers, $userprofile_id) {
        $update = Update::get()
            ->table($this->table)
                ->value('image_index_status', -1)
                ->value('tablekey_id', 0)
                ->value('image_index_primary', 0)
                ->value('image_index_deleted_datetm', '\''.date('Y-m-d H:i:s').'\'')
                ->value('image_index_deleted_by', $userprofile_id)
            ->where(
                Where::get()
                    ->in('image_index_id', implode(',', $identifiers))
            )
        ;
        return $this->adapter->query($update);
    }

    /**
     * Revert images: deleted, indexed and so on.
     * 
     * @param [] $identifiers List of image identifiers to delete.
     * @return [] Execution result.
     */
    public function revert($identifiers) {
        $update = new Update();
        $update
            ->table($this->table)
            ->value('image_index_status', 0)
                ->value('image_index_draft_invoice_id', 'null')
                ->value('image_index_deleted_datetm', 'null')
                ->value('image_index_deleted_by', 'null')
            ->where(
                Where::get()
                    ->in('image_index_id', implode(',', $identifiers))
            )
        ;
        return $this->adapter->query($update);
    }

    /**
     * Get count of the images by doctype.
     * 
     * @param int $invoiceid Invoice id.
     * @param int $doctype Document type id.
     * @return int Count of images.
     */
    public function countImagesByDoctype($invoiceid, $doctype) {
        $where = new Where();
        $where
            ->equals('tablekey_id', $invoiceid)
            ->equals('image_doctype_id', $doctype)
        ;

        $select = new Select();
        $select
            ->count(true, 'image_index_id')
            ->from('IMAGE_INDEX')
            ->where($where)
        ;

        $result = $this->adapter->query($select);
        if (!empty($result) && !empty($result[0])) {
            return $result[0]['image_index_id'];
        }
        return 0;
    }

    /**
     * Get count of the images by tableref.
     * 
     * @param int $invoiceid Invoice id.
     * @param int $tableref Tableref id.
     * @return int Count of images.
     */
    public function countImagesByTableref($invoiceid, $tableref) {
        $where = new Where();
        $where
            ->equals('tablekey_id', $invoiceid)
            ->equals('tableref_id', $tableref)
        ;

        $select = new Select();
        $select
            ->count(true, 'image_index_id')
            ->from('IMAGE_INDEX')
            ->where($where)
        ;

        $result = $this->adapter->query($select);
        if (!empty($result) && !empty($result[0])) {
            return $result[0]['image_index_id'];
        }
        return 0;
    }

    /**
     * Get Images by id depending on table reference.
     * 
     * @param int $id Image identifier.
     * @param [] $params Additional parameters.
     * @param [] $tablerefs Appropriate table references.
     * @return [] List of images.
     */
    public function getImageScan($id, $params, $tablerefs) {
        $reflist = null;
        if (!empty($params['tableref_id'])) {
            $reflist = [
                $params['tableref_id']
            ];
        }

        switch ($params['tableref_id']) {
            case 3:
                $tableref = $tablerefs[strtolower('receipt')];
                $reflist[] = $tableref;
                break;
            case 1:
                $tableref = $tablerefs[strtolower('Utility Invoice')];
                $reflist[] = $tableref;
                break;
        }

        // Property id could be number or string with comma-separated identifiers
        if (is_string($params['property_id'])) {
            $params['property_id'] = explode(',', $params['property_id']);
        } elseif (!empty($params['property_id'])) {
            $params['property_id'] = [$params['property_id']];
        } else {
            $params['property_id'] = [];
        }

        $scans =  $this->getImageScanLocal($id, $params, $reflist);
        $scans = array_merge($scans, $this->getImageScanVendor($id, $params, $reflist));
        $scans = array_merge($scans, $this->getImageScanLegacy($id, $params, $reflist));

        return $scans;
    }

    public function getImageScanForGrid($params, $tablerefs, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection) {
        $propertyFilterSelect = 
            new PropertyFilterSelect(
                new PropertyContext(
                    $userprofile_id,
                    $delegated_to_userprofile_id,
                    $contextType,
                    $contextSelection
                )
            )
        ;
        $params['property_id'] = $propertyFilterSelect->toString();

        $reflist = null;
        if (!empty($params['tableref_id'])) {
            $reflist = [
                $params['tableref_id']
            ];
        }

        switch ($params['tableref_id']) {
            case 3:
                $tableref = $tablerefs[strtolower('receipt')];
                $reflist[] = $tableref;
                break;
            case 1:
                $tableref = $tablerefs[strtolower('Utility Invoice')];
                $reflist[] = $tableref;
                break;
        }

        $scans =  $this->getImageScanLocal(null, $params, $reflist);
        $scans = array_merge($scans, $this->getImageScanVendor(null, $params, $reflist));
        $scans = array_merge($scans, $this->getImageScanLegacy(null, $params, $reflist));

        return $scans;
    }

    /**
     * Get Local Scan Images.
     * 
     * @param int $id Image identifier.
     * @param [] $params Additional parameters.
     * @param [] $tablerefs Appropriate table references.
     * @return [] List of images.
     */
    private function getImageScanLocal($id, $params, $tablerefs) {
        $select = new sql\ImageIndexSelect();

        $select
            ->join(new sql\join\ImageIndexImageSourceJoin())
            ->join(new sql\join\ImageIndexImageTransferJoin())
            ->join(new sql\join\ImageIndexUserprofileJoin(
                ['userprofile_username', 'userprofile_username AS scan_source']
            ))
            ->join(new sql\join\ImageIndexVendorsiteJoin())
            ->join(new \NP\vendor\sql\join\VendorsiteVendorJoin(
                ['vendor_name, vendor_id_alt'],
                Select::JOIN_LEFT
            ))
            ->join(new sql\join\ImageIndexPropertyJoin())
            ->join(new sql\join\ImageIndexDocTypeJoin())
            ->join(new sql\join\ImageIndexTablerefJoin())
        ;

        $where = new sql\criteria\ImageScanGetCriteria(
            $params['property_id'],
            $tablerefs
        );

        $where
            ->equals('itransfer.transfer_srcTableName', '\'userprofile\'')
        ;
        $select->where($where);

        $result = $this->adapter->query(
            $select,
            [
                $params['tableref_id'],
                $id,
                $id,
                $params['asp_client_id']
            ]
        );

        return $result;
    }

    /**
     * Get Vendor Scan Images.
     * 
     * @param int $id Image identifier.
     * @param [] $params Additional parameters.
     * @return [] List of images.
     */
    private function getImageScanVendor($id, $params) {
        $select = new sql\ImageIndexSelect();

        $select
            ->join(new sql\join\ImageIndexImageSourceJoin())
            ->join(new sql\join\ImageIndexImageTransferJoin())
            ->join(new sql\join\ImageIndexVendorsiteJoin(
                [],
                Select::JOIN_LEFT,
                'vs',
                'itransfer',
                'transfer_srcTablekey_id'
            ))
            ->join(new \NP\vendor\sql\join\VendorsiteVendorJoin(
                ['vendor_name', 'vendor_name AS scan_source, vendor_id_alt'],
                Select::JOIN_LEFT
            ))
            ->join(new sql\join\ImageIndexPropertyJoin())
            ->join(new sql\join\ImageIndexDocTypeJoin())
            ->join(new sql\join\ImageIndexTablerefJoin())
        ;

        $tablerefs = [];
        if (!empty($params['tableref_id'])) {
            $tablerefs = [$params['tableref_id']];
        }
        $where = new sql\criteria\ImageScanGetCriteria(
            $params['property_id'],
            $tablerefs
        );

        $where
            ->equals('itransfer.transfer_srcTableName', '\'vendorsite\'')
        ;
        $select->where($where);

        $result = $this->adapter->query(
            $select,
            [
                $params['tableref_id'],
                $id,
                $id,
                $params['asp_client_id']
            ]
        );

        return $result;
    }

    /**
     * Get Legacy Scan Images.
     * 
     * @param int $id Image identifier.
     * @param [] $params Additional parameters.
     * @return [] List of images.
     */
    private function getImageScanLegacy($id, $params, $tablerefs) {
        $select = new sql\ImageIndexSelect();

        $select
            ->join(new sql\join\ImageIndexImageSourceJoin(
                ['invoiceimage_source_name', 'invoiceimage_source_name AS scan_source']
            ))
            ->join(new sql\join\ImageIndexImageTransferJoin())
            ->join(new sql\join\ImageIndexVendorsiteJoin())
            ->join(new \NP\vendor\sql\join\VendorsiteVendorJoin(
                ['vendor_name, vendor_id_alt'],
                Select::JOIN_LEFT
            ))
            ->join(new sql\join\ImageIndexPropertyJoin())
            ->join(new sql\join\ImageIndexDocTypeJoin())
            ->join(new sql\join\ImageIndexTablerefJoin())
        ;

        $where = new sql\criteria\ImageScanGetCriteria(
            $params['property_id'],
            $tablerefs
        );
        $where
            ->nest('OR')
                ->equals('itransfer.transfer_srcTableName', '\'invoiceimagesource\'')
                ->isNull('itransfer.transfer_srcTableName')
            ->unnest()
        ;
        $select->where($where);

        $result = $this->adapter->query(
            $select,
            [
                $params['tableref_id'],
                $id,
                $id,
                $params['asp_client_id']
            ]
        );

        return $result;
    }

    /**
     * Find image by table reference and table identifier.
     * 
     * @param int $tablekey Target table identifier.
     * @param int $tableref Table reference.
     * @return int Image identifier.
     */
    public function lookupImage($tablekey, $tableref) {
        $where = Where::get()
            ->equals('tablekey_id', $tablekey)
            ->equals('image_index_primary', 1)
            ->equals('tableref_id', $tableref)
        ;
        $select = Select::get()
            ->column('image_index_id')
            ->from('image_index')
            ->where($where)
        ;
        $result = $this->adapter->query($select);

        if (!empty($result) && !empty($result[0])) {
            return $result[0]['image_index_id'];
        }
        return null;
    }

    /**
     * Search image by multiple criterias.
     * 
     * @param int $doctype Document type identifier.
     * @param int $searchtype Search type identifier: 1 - Image name, 2 - Scan date, 3 - Vendor.
     * @param string $searchstring Search string.
     * @param type $property_type Context type: Region, Property, Multiple Properties, All Properties.
     * @param type $property_list Context item: Item identifier(Region id or Property id) or identifiers depending 
     *      on context type.
     * @return [] List of images.
     */
    public function imageSearch($doctype, $searchtype, $searchstring, $property_type, $property_list) {
        $select01 = new sql\ImageSearchSelect();

        if ($searchtype == 1 || $searchtype == 3) {
            $searchstring = rtrim(ltrim($searchstring));

            $searchstring = str_replace('%', '|%', $searchstring);
            $searchstring = str_replace('_', '|_', $searchstring);
            $searchstring = str_replace('[', '|[', $searchstring);
            $searchstring = str_replace(']', '|]', $searchstring);
            $searchstring = str_replace('^', '|^', $searchstring);
            $searchstring = str_replace('?', '|?', $searchstring);
        }

        switch ($property_type) {
            case 'property':
            case 'multiProperty':
                $left = 'ii.property_id';
                break;
            case 'region':
                $left = 'p.region_id';
                break;
            case 'all':
                $left = 'p.property_status';
                break;
        }


        switch ($searchtype) {
            case 1:
                $select01
                    ->where(
                        Where::get()
                            ->equals('ii.image_doctype_id', $doctype)
                            ->like('ii.image_index_name', '\'%'.$searchstring.'%\' ESCAPE \'|\'')
                            ->nest('OR')
                                ->equals('ii.property_id', 0)
                                ->in($left, $property_list)
                            ->unnest()
                    )
                ;
                break;
            case 2:
                $select01
                    ->where(
                        Where::get()
                            ->equals('ii.image_doctype_id', $doctype)
                            ->equals('dbo.DateNoTime(ii.image_index_date_entered)', 'CONVERT(datetime, \''.$searchstring.'\')')
                            ->nest('OR')
                                ->equals('ii.property_id', 0)
                                ->in($left, $property_list)
                            ->unnest()
                    )
                ;
                break;
            case 3:
                $select01
                    ->where(
                        Where::get()
                            ->equals('ii.image_doctype_id', $doctype)
                            ->like('v.vendor_name', '\'%'.$searchstring.'%\' ESCAPE \'|\'')
                            ->nest('OR')
                                ->equals('ii.property_id', 0)
                                ->in($left, $property_list)
                            ->unnest()
                    )
                ;
                break;
        }
        return $this->adapter->query($select01);
    }

    /**
     * Search for deleted images.
     * 
     * @param int $vendor Vendor id.
     * @param int $invoice Invoice number.
     * @param string $deletedby Username of the user who deleted the image.
     * @return [] List of images.
     */
    public function imageSearchDeleted($vendor, $invoice = null, $deletedby = null) {
        $where = new Where();
        $where
            ->equals('v.vendor_id', $vendor)
            ->equals('ii.image_index_status', -1)
        ;
        if (!empty($invoice)) {
            $where->equals('Tablekey_Id', $invoice);
        }
        if (!empty($deletedby)) {
            $select01 = new Select();
            $select01
                ->column('userprofile_id')
                ->from('userprofile')
                ->where(
                    Where::get()->like('userprofile_username', '\'%'.$deletedby.'%\'')
                )
            ;
            $where->in('image_index_deleted_by', $select01);
        }

        $select = new sql\ImageSearchSelect();
        $select->where($where);

        return $this->adapter->query($select);
    }

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    
    
    
    
    
    
    
    






        
        
        
        
        
        
        
        public function getImageToIndex($id, $userprofile_id = 1, $delegated_to_userprofile_id = 1, $contextType = 'all', $contextSelection = null, $pageSize=null, $page=null, $sort="vendor_name") {
            $select = $this->getDashboardSelect('false', $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);
            $propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

            $where = Where::get()
                ->nest('OR')
                    ->equals('img.property_id', 0)
                    ->isNull('img.property_id')
                    ->in('img.property_id', $propertyFilterSelect)
                ->unnest()
                ->merge(new sql\criteria\ImageNotIndexedCriteria())
                ->equals("Image_Index_Id", $id)
            ;
            $select->where($where);

            return $this->adapter->query($select)[0];
	}
        
        
        
        
        
        






        public function getMainParametersForImages($identifiers) {
            $select = Select::get()
                ->from($this->table)
                ->columns(['tablekey_id', 'tableref_id', 'image_index_name', 'image_index_id'])
                ->where(
                    Where::get()
                        ->in('image_index_id', implode(',', $identifiers))
                )
            ;
            $params = $this->adapter->query($select);

            $result = [];
            if (!empty($params)) {
                foreach ($params as $values) {
                    $result[$values['image_index_id']] = [
                        'tablekey_id' => $values['tablekey_id'],
                        'tableref_id' => $values['tableref_id'],
                        'image_index_name' => $values['image_index_name']
                    ];
                }
            }
            return $result;
        }

        public function updatePrimary($identifiers, $params) {
            foreach ($params as $key => $values) {
                $where = Where::get()
                    ->notIn('image_index_id', implode(',', $identifiers))
                    ->equals('tablekey_id', $values['tablekey_id'])
                    ->equals('tableref_id', $values['tableref_id'])
                ;
                $select = Select::get()
                    ->from($this->table)
                    ->column('image_index_id')
                    ->where($where)
                    ->limit(1)
                ;

                $update = Update::get()
                    ->table($this->table)
                    ->value('image_index_primary', 1)
                    ->where(
                        Where::get()->in('image_index_id', $select)
                    )
                ;

                $this->adapter->query($update);
            }
        }

        public function updateImage($data, $params, $doctypes, $tablerefs) {
            if (!empty($data['Image_Index_Id'])) {
                $name = $data['Image_Index_Name'];
                $name = str_replace('\'', '', $name);

                $update = Update::get()->table($this->table)
                    ->value('image_index_name', $name)
                ;
                if (isset($data['universal_field1'])) 
                    $update->value('universal_field1', $data['universal_field1']);
                if (isset($data['universal_field2'])) 
                    $update->value('universal_field2', $data['universal_field2']);
                if (isset($data['universal_field3'])) 
                    $update->value('universal_field3', $data['universal_field3']);
                if (isset($data['universal_field4'])) 
                    $update->value('universal_field4', $data['universal_field4']);
                if (isset($data['universal_field5'])) 
                    $update->value('universal_field5', $data['universal_field5']);
                if (isset($data['universal_field6'])) 
                    $update->value('universal_field6', $data['universal_field6']);
                if (isset($data['universal_field7'])) 
                    $update->value('universal_field7', $data['universal_field7']);
                if (isset($data['universal_field8'])) 
                    $update->value('universal_field8', $data['universal_field8']);

                $property_id = null;
                if ($data['Image_Doctype_Id'] == $doctypes['Utility Invoice']) {
                    $data['property_id'] = $data['utility_property_id'];
                    $property_id = $data['property_id'];
                } elseif (!empty($data['property_id'])) {
                    $property_id = $data['property_id'];
                } elseif (!empty($data['property_alt_id'])) {
                    $property_id = $data['property_alt_id'];
                }
                $update->value('property_id', $property_id);

                $image_index_vendorsite_id = null;
                if ($data['Image_Doctype_Id'] == $doctypes['Utility Invoice']) {
                    $image_index_vendorsite_id = $data['utility_vendorsite_id'];
                } elseif (!empty($data['invoiceimage_vendorsite_id'])) {
                    $image_index_vendorsite_id = $data['invoiceimage_vendorsite_id'];
                } elseif (!empty($data['invoiceimage_vendorsite_alt_id'])) {
                    $image_index_vendorsite_id = $data['invoiceimage_vendorsite_alt_id'];
                }
//if (!empty) {
                $update->value('invoiceimage_vendorsite_alt_id', $image_index_vendorsite_id);
//}

                $update->value('image_index_amount', 
                    !empty($data['image_index_amount']) ? $data['image_index_amount'] : null
                );

                $refnum = "";
                if (!empty($data['invoiceimage_ref'])) {
                    $refnum = $data['invoiceimage_ref'];
                } elseif (!empty($data['po_ref'])) {
                    $refnum = $data['po_ref'];
                } elseif (!empty($data['job_number'])) {
                    $refnum = $data['job_number'];
                }
                $refnum = str_replace('\'', '', $refnum);
                $update->value('image_index_ref', 
                    !empty($refnum) ? $refnum : null
                );

                $update->value('image_index_invoice_date', 
                    !empty($data['invoiceimage_invoice_date']) ? $data['invoiceimage_invoice_date'] : null
                );

                //Start:image is being marked as exception
                if (!empty($data['mark_as_exception'])) {
                    $update->value('Image_Index_Exception_by', $params['userprofile_id']);
                    $update->value('Image_Index_Exception_datetm', date('Y-m-d H:i:s'));

                    $image_index_status = 2;
                } elseif (!empty($data['indexing_complete'])) {
                    $update->value('Image_Index_Exception_End_datetm', date('Y-m-d H:i:s'));

                    $image_index_status = 1;
                } elseif (!empty($data['image_delete'])) {
                    $update->value('image_index_deleted_datetm', date('Y-m-d H:i:s'));
                    $update->value('image_index_deleted_by', $params['userprofile_id']);

                    $image_index_status = -1;
                } else {
                    if (strtolower($params['section']) == 'exceptions') {
                        $image_index_status = 2;
                    } elseif (strtolower($params['section']) == 'index') {
                        $image_index_status = 1;
                    }
                }
                $update->value('image_index_status', $image_index_status);

                if (!empty($data['indexing_complete']) && empty($data['image_delete'])) {
                    $update->value('image_index_indexed_by', $params['userprofile_id']);
                    $update->value('image_index_indexed_datetm', date('Y-m-d H:i:s'));
                }

                if (!empty($data['exception_reason'])) {
                    $update->value('Image_Index_Exception_reason', $data['exception_reason']);
                }

                $priority = "";
                if (!empty($data['Image_Doctype_Id'])) {
                    switch ($data['Image_Doctype_Id']) {
                        case 1:
                            $priority = $data['PriorityFlag_ID_Alt_invoice'];
                            break;
                        case 2:
                            $priority = $data['PriorityFlag_ID_Alt_po'];
                            break;
                        case 3:
                            $priority = $data['PriorityFlag_ID_Alt_vef'];
                            break;
                    }
                }
                if (!empty($priority)) {
                    $update->value('PriorityFlag_ID_Alt', $priority);
                }

                if (!empty($data['invoiceimage_invoice_duedate'])) {
                    $update->value('Image_Index_Due_Date', $data['invoiceimage_invoice_duedate']);
                }

                if (!empty($data['NeededBy_datetm'])) {
                    $update->value('image_index_NeededBy_datetm', $data['NeededBy_datetm']);
                }

                if (!empty($data['image_index_draft_invoice_id'])) {
                    $update->value('image_index_draft_invoice_id', $data['image_index_draft_invoice_id']);
                }

                $tableref_id = null;
                $image_doctype_id = null;
                if (!empty($data['Image_Doctype_Id']) && $data['Image_Doctype_Id'] == 1) {
                        $image_doctype_id = $data['Image_Doctype_Id'];
                        $tableref_id = 1;

                        $update->value('remit_advice', $data['remit_advice']);
                } elseif (!empty($data['Image_Doctype_Id']) && $data['Image_Doctype_Id'] == 2) {
                        $image_doctype_id = $data['Image_Doctype_Id'];
                        $tableref_id = 3;
                } elseif (!empty($data['Image_Doctype_Id']) && $data['Image_Doctype_Id'] == 3) {
                        $image_doctype_id = $data['Image_Doctype_Id'];
                        $tableref_id = 4;
                } elseif (!empty($data['Image_Doctype_Id']) && $data['Image_Doctype_Id'] == $doctypes['receipt']) {
                        $image_doctype_id = $data['Image_Doctype_Id'];
                        $tableref_id = $tablerefs['receipt'];//getreceipt_ref.image_tableref_id
                } elseif (!empty($data['Image_Doctype_Id']) && $data['Image_Doctype_Id'] == $doctypes['Utility Invoice']) {
                        $image_doctype_id = $data['Image_Doctype_Id'];
                        $tableref_id = $tablerefs['Utility Invoice'];//qUtilityRef.image_tableref_id

                        $update->value('utilityaccount_id', $data['utilityaccount_id']);//#listFirst(request.utilityaccount_id)#
                        $update->value('utilityaccount_accountnumber', $data['utilityaccount_accountnumber']);//#listFirst(request.utilityaccount_id)#
                        $update->value('utilityaccount_metersize', $data['utilityaccount_metersize']);//#listFirst(request.utilityaccount_id)#

                        $update->value('cycle_from', !empty($data['cycle_from']) ? $data['cycle_from'] : null);//#listFirst(request.utilityaccount_id)#
                        $update->value('cycle_to', !empty($data['cycle_to']) ? $data['cycle_to'] : null);//#listFirst(request.utilityaccount_id)#
                } elseif (!empty($data['Image_Doctype_Id']) && $data['Image_Doctype_Id'] > 3) { //If doctype is "Vendor", then automatically attach image to vendor
                    $image_doctype_id = $data['Image_Doctype_Id'];
                    $tableref_id = 2;

                    if (!empty($data['invoiceimage_vendorsite_id'])) {
                        $update->value('tablekey_id', $data['invoiceimage_vendorsite_id']);//#listFirst(request.utilityaccount_id)#
                    } elseif (!empty($data['invoiceimage_vendorsite_alt_id'])) {
                        $update->value('tablekey_id', $data['invoiceimage_vendorsite_alt_id']);//#listFirst(request.utilityaccount_id)#
                    }
                }
                $update->value('image_doctype_id', !empty($image_doctype_id) ? $image_doctype_id : null);
                $update->value('tableref_id', !empty($tableref_id) ? $tableref_id : null);

                $update->where(
                    Where::get()->equals(
                        'image_index_id',
                        $data['Image_Index_Id']
                    )
                );
print_r($update->toString());
                //return $this->adapter-query($update);
            }
            return null;
        }
        
        

        /**
         * Get Image information by id.
         * 
         * @param int $id Image index id
         * @param String $filter Property filter
         * @return ImageIndexEntity Image index entity
         */
        /*public function get($id, $filter) {
            $valid = 
                !empty($filter['userprofile_id']) &&
                !empty($filter['delegated_to_userprofile_id']) &&
                !empty($filter['contextType'])
            ;
            if (!$valid) {
                return null;
            }

            $select = new sql\ImageSelect();
            $filter = new PropertyFilterSelect(
                new PropertyContext(
                    $filter['userprofile_id'],
                    $filter['delegated_to_userprofile_id'],
                    $filter['contextType'],
                    $filter['contextSelection']
                )
            );
            $where = Where::get()
                ->nest('OR')
                    ->equals('img.property_id', 0)
                    ->isNull('img.property_id')
                    ->in('img.property_id', $filter)
                ->unnest()
                ->merge(new sql\criteria\ImageNotIndexedCriteria())
                ->equals("Image_Index_Id", $id)
            ;

            $select
                ->columns($this->columns1)
                    ->columnDaysOustanding()
                ->join(new sql\join\ImageIndexImageSourceJoin())
                    ->join(new sql\join\ImageIndexDocTypeJoin())
                    ->join(new sql\join\ImageIndexIndexedByJoin())
                    ->join(new sql\join\ImageIndexPropertyJoin())
                    ->join(new sql\join\ImageIndexVendorsiteJoin())
                    ->join(new sql\join\ImageIndexPriorityFlagJoin())
                    ->join(new \NP\vendor\sql\join\VendorsiteVendorJoin(array('vendor_name,vendor_id_alt,vendor_status'), Select::JOIN_LEFT))
                ->where($where)
            ;

            $result = $this->adapter->query($select);
            if (!empty($result) && !empty($result[0])) {
                return $result[0];
            }
            return null;
        }*/


        
        
        
        
        

        
        
        








/*
ii   = img
iis  = imgs
 *   = itransfer
p    = pr
idt  = imgd
it   = imgt



@in_property_id varchar(8000) = NULL,
@in_invoiceimage_id int       = $id
@in_tableref_id int           = NULL

	---PO scan page needs to also display receipts
	DECLARE @receiptdoc int, @tableref_list varchar(25), @utilitydoc int;
	IF @in_tableref_id = 3
	BEGIN
		SELECT @receiptdoc = image_tableref_id
		FROM IMAGE_TABLEREF
		WHERE image_tableref_name = 'receipt'
	
		SET @tableref_list = CAST(@in_tableref_id as varchar(5)) + ',' + CAST(@receiptdoc as varchar(5))
	END
	ELSE IF @in_tableref_id = 1
	BEGIN
		SELECT @utilitydoc = image_tableref_id
		FROM IMAGE_TABLEREF
		WHERE image_tableref_name = 'Utility Invoice'
	
		SET @tableref_list = CAST(@in_tableref_id as varchar(5)) + ',' + CAST(@utilitydoc as varchar(5))
	END
	ELSE
		SET @tableref_list = CAST(@in_tableref_id as varchar(5))
	
	IF  @OrderBy = 'Vendor' 
	BEGIN
		SELECT * 
		FROM @IMAGE_INDEX 
		ORDER BY Vendor_Name
	END
	ELSE IF @OrderBy = 'Date' 
	BEGIN
		SELECT * 
		FROM @IMAGE_INDEX
		ORDER BY image_index_Date_Entered 
	END
END
SET IMPLICIT_TRANSACTIONS ON
        
        */
}

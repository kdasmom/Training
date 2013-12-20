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

	public function findImagesToConvert($countOnly, $docTypes=null, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);
		
		if ($docTypes === null) {
			$docTypes = 'Invoice,Utility Invoice';
		}

		$select->whereMerge(new sql\criteria\ImageInvoiceDocCriteria($docTypes))
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
								'universal_field8',
								new Expression("
									CASE
										WHEN imgt.transfer_srcTableName = 'userprofile' THEN uimgt.userprofile_username
										WHEN imgt.transfer_srcTableName = 'vendorsite' THEN vimgt.vendor_name
										ELSE imgs.invoiceimage_source_name
									END AS scan_source
								")
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
            ->join(new sql\join\ImageIndexImageTransferJoin())
            ->join(new sql\join\ImageTransferUserprofileJoin())
            ->join(new sql\join\ImageTransferVendorsiteJoin())
			->join(new \NP\vendor\sql\join\VendorsiteVendorJoin(
				[],
				Select::JOIN_LEFT,
				'vimgt',
				'vsimgt'
			))
			->join(new sql\join\ImageIndexPriorityFlagJoin())
			->join(new \NP\vendor\sql\join\VendorsiteVendorJoin(['vendor_name','vendor_id_alt','vendor_status'], Select::JOIN_LEFT))
            ->join(['delby' => 'userprofile'], 'img.image_index_deleted_by = delby.userprofile_id', ['deletedby_username' => 'userprofile_username'], Select::JOIN_LEFT)
			->whereIn('img.property_id', $propertyFilterSelect);

		return $select;
	}

	/**
	 * Get all images for a certain entity, or only the primary one
	 *
	 * @param int    $tablekey_id         The ID of the entity to get images for
	 * @param string $image_tableref_name The entity type to get the image for; valid values are 'Invoice', 'Purchase Order', 'Receipt', and 'Vendor'
	 */
	public function findEntityImages($tablekey_id, $image_tableref_name, $primaryOnly=false) {
		$select = Select::get()->allColumns('img')
								->from(array('img'=>'image_index'))
								->join(new sql\join\ImageIndexImageSourceJoin())
								->join(new sql\join\ImageIndexPropertyJoin(array('property_id_alt','property_name'), Select::JOIN_INNER))
								->join(new sql\join\ImageIndexVendorsiteJoin(array(), Select::JOIN_INNER))
								->join(new \NP\vendor\sql\join\VendorsiteVendorJoin())
								->join(new sql\join\ImageIndexImageTransferJoin())
								->join(new sql\join\ImageTransferUserprofileJoin())
								->join(new sql\join\ImageTransferVendorsiteJoin())
								->join(new \NP\vendor\sql\join\VendorsiteVendorJoin(
									array('transfer_vendor_name'=>'vendor_name'),
									Select::JOIN_LEFT,
									'vimgt',
									'vsimgt'
								))
								->whereEquals('img.Tablekey_Id', '?')
								->whereEquals('img.Image_Index_Status', 1)
								->whereEquals(
									'img.Tableref_Id',
									Select::get()->column('image_tableref_id')
												->from('image_tableref')
												->whereEquals('image_tableref_name', '?')
								);
		if ($primaryOnly) {
			$select->whereEquals('img.Image_Index_Primary', 1);
		} else {
			$select->order('img.Image_Index_Primary DESC, img.image_index_name ASC');
		}

		return $this->adapter->query($select, array($tablekey_id, $image_tableref_name));
	}

	public function findImagePath($image_index_id) {
		$select = Select::get()->columns([])
								->from(array('img'=>'image_index'))
								->join(new sql\join\ImageIndexImageTransferJoin(['transfer_filename']))
								->whereEquals('img.image_index_id', '?');

		$res = $this->adapter->query($select, [$image_index_id]);
		if (count($res)) {
			return $res[0]['transfer_filename'];
		} else {
			return null;
		}
	}
        
    public function findImagesToDelete($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);
		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		// We're going to create a where object to overwrite the entire where clause because
		// we need the property filter to be within a nested block
		$where = Where::get()->nest('OR')
								->equals('img.property_id', 0)
								->isNull('img.property_id')
								->in('img.property_id', $propertyFilterSelect)
							->unnest()
							->equals('img.Image_Index_Status', -1);

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
            ->whereIn('image_index_id', $this->createPlaceholders($identifiers))
        ;
        return $this->adapter->query($update, $identifiers);
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
     * Get Images by id
     * 
     * @param int $image_index_id
     * @return [] List of images.
     */
    public function getImageDetails($image_index_id) {
        $select = 
        	Select::get()
	        	->from(['img'=>'image_index'])
		            ->join(new sql\join\ImageIndexImageSourceJoin())
		            ->join(new sql\join\ImageIndexImageTransferJoin())
		            ->join(new sql\join\ImageIndexVendorsiteJoin(['vendorsite_id']))
		            ->join(new \NP\vendor\sql\join\VendorsiteVendorJoin(
		            	['vendor_id','vendor_name','vendor_id_alt','vendor_status'],
		            	Select::JOIN_LEFT
		           	))
		            ->join(new sql\join\ImageIndexPropertyJoin())
		            ->join(new sql\join\ImageIndexDocTypeJoin())
		            ->join(new sql\join\ImageIndexTablerefJoin())
		            ->join(new sql\join\ImageIndexUtilityAccountJoin())
		        ->whereEquals('img.image_index_id', '?');

        $result = $this->adapter->query($select, [$image_index_id]);

        return $result[0];
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

    /**
     * Get image parameters.
     * Used in "delete image" mechanism to mark primary image correctly.
     * 
     * @param [] $identifiers List of image identifiers.
     * @return [] parameters.
     */
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

    /**
     * Set primary flag of the image correctly.
     * 
     * @param [] $identifiers List of images identifiers.
     * @param [] $params Images parameters.
     */
    public function updatePrimary($identifiers, $params) {
        foreach ($params as $key => $values) {
            $where = Where::get()
                ->notIn('image_index_id', implode(',', $identifiers))
            ;
            if (empty($values['tablekey_id'])) {
                $where->isNull('tablekey_id');
            } else {
                $where->equals('tablekey_id', $values['tablekey_id']);
            }
            $where->equals('tableref_id', $values['tableref_id']);


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
}

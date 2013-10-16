<?php

namespace NP\image;

use NP\core\AbstractGateway;

use NP\core\db\Where;
use NP\core\db\Select;
use NP\property\PropertyContext;
use NP\property\sql\PropertyFilterSelect;

/**
 * Gateway for the IMAGE_INDEX table
 *
 * @author Thomas messier
 */
class ImageIndexGateway extends AbstractGateway {
	protected $table = 'image_index';

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
}

?>
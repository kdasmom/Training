<?php

namespace NP\image;

use NP\core\AbstractService;
use NP\security\SecurityService;
use NP\core\io\FileUpload;
use NP\core\db\Where;
use NP\system\ConfigService;
use NP\system\IntegrationPackageGateway;
use NP\vendor\UtilityAccountGateway;
use NP\property\PropertyGateway;
use NP\vendor\VendorGateway;
use NP\invoice\InvoiceGateway;

/**
 * Service class for operations related to Images
 *
 * @author Thomas Messier
 */
class ImageService extends AbstractService {

    protected $configService, $securityService;

    /**
     * @var array
     */
    private $validMimeTypes = array(
        'application/pdf',
        'image/gif',
        'image/jpeg',
        'image/tiff',
        'application/msword',
        'application/vnd.ms-excel',
        'application/octet-stream',
        'application/vnd.ms-powerpoint'
    );

    private $validFileExtensions = [
        'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx',
        'jpeg', 'jpg', 'gif', 'tif', 'tiff'
    ];

    public function setConfigService($configService) {
        $this->configService = $configService;
    }

    public function setSecurityService(SecurityService $securityService) {
        $this->securityService = $securityService;
    }

    /**
     * Get list of Receipts to approve
     *
     * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
     * @param  int     $userprofile_id              The active user ID, can be a delegated account
     * @param  int     $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
     * @param  string  $contextType                 The context filter type; valid values are 'property','region', and 'all'
     * @param  int     $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
     * @param  int     $pageSize                    The number of records per page; if null, all records are returned
     * @param  int     $page                        The page for which to return records
     * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
     * @return array                                Array of invoice records
     */
    public function getImagesToConvert($countOnly, $docTypes=null, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
        return $this->imageIndexGateway->findImagesToConvert($countOnly, $docTypes, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
    }

    /**
     * Get list of Receipts to approve
     *
     * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
     * @param  int     $userprofile_id              The active user ID, can be a delegated account
     * @param  int     $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
     * @param  string  $contextType                 The context filter type; valid values are 'property','region', and 'all'
     * @param  int     $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
     * @param  int     $pageSize                    The number of records per page; if null, all records are returned
     * @param  int     $page                        The page for which to return records
     * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
     * @return array                                Array of invoice records
     */
    public function getImagesToProcess($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
        return $this->imageIndexGateway->findImagesToProcess($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
    }
        
    /**
     * Get list of Receipts to approve
     *
     * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
     * @param  int     $userprofile_id              The active user ID, can be a delegated account
     * @param  int     $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
     * @param  string  $contextType                 The context filter type; valid values are 'property','region', and 'all'
     * @param  int     $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
     * @param  int     $pageSize                    The number of records per page; if null, all records are returned
     * @param  int     $page                        The page for which to return records
     * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
     * @return array                                Array of invoice records
     */
    public function getImageExceptions($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
        return $this->imageIndexGateway->findImageExceptions($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
    }

    /**
     * Get list of Receipts to approve
     *
     * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
     * @param  int     $userprofile_id              The active user ID, can be a delegated account
     * @param  int     $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
     * @param  string  $contextType                 The context filter type; valid values are 'property','region', and 'all'
     * @param  int     $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
     * @param  int     $pageSize                    The number of records per page; if null, all records are returned
     * @param  int     $page                        The page for which to return records
     * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
     * @return array                                Array of invoice records
     */
    public function getImagesToIndex($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
        return $this->imageIndexGateway->findImagesToIndex($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
    }

    /**
     * Get the absolute path to a specific image file
     *
     * @param  int    $image_index_id
     * @return string
     */
    public function getImagePath($image_index_id) {
        return $this->imageIndexGateway->findImagePath($image_index_id);
    }

    public function getImagesToDelete($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
        return $this->imageIndexGateway->findImagesToDelete($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
    }


    /**
     * Method returns file content to the output and sets correct content type.
     * This method is used to load image into iframe.
     * 
     * @param int $image_id Image identifier.
     * @param int $doc_id Document type identifier.
     * @param int $summarystat_id Parameter is used to define correct image tableref.
     * @param int $tablekey_id Identifier in $table_name parameter.
     * @param string $table_name Parameter is used to define correct image tableref.
     * @param int $invoiceimage_id Invoice id.
     * @return file content.
     */
    public function show($image_index_id) {
        try {
            $file = $this->getImagePath($image_index_id);
            if ($file === null || !file_exists($file)) {
                die('Invalid file');
            } else {
                $filename = explode('\\', $file);
                $filename = array_pop($filename);

                header('Content-type: application/pdf');
                header('Content-Disposition: inline; filename="' . $filename . '"');
                header('Content-Transfer-Encoding: binary');
                header('Content-Length: ' . filesize($file));
                header('Accept-Ranges: bytes');

                die(file_get_contents($file));
            }
        } catch (Exception $e) {
            die('Invalid file');
        }
    }

    /**
     * Delete Images API method.
     * 
     * @param boolean $permanently Delete images permanently or just mark images as deleted.
     * @param string $identifiers List identifiers string. JSON array format is used for identifiers.
     * @param int $userprofile_id Current user profile id.
     * @param int $delegation_to_userprofile_id Current delegation user profile id id.
     * @return [] Execution result.
     */
    public function delete($identifiers, $permanently = false, $userprofile_id, $delegation_to_userprofile_id = null) {
        $result = [
            'success' => false,
            'error'   => 'User profile id is not passed'
        ];

        if (!empty($userprofile_id)) {
            if (empty($delegation_to_userprofile_id)) {
                $delegation_to_userprofile_id = $userprofile_id;
            }

            $identifiers = json_decode($identifiers);
            if (!empty($identifiers)) {
                if ($permanently) {
                    //Delete real file
                    $files = $this->imageTransferGateway->getFilesById($identifiers);
                    foreach($files as $filename) {
                        if (file_exists($filename)) {
                            unlink($filename);
                        }
                    }

                    //Delete records from the database
                    $this->imageIndexGateway->deletePermanently($identifiers);
                    $this->imageTransferGateway->deletePermanently($identifiers);

                    unset($result['error']);
                    $result['success'] = true;
                } else {
                    $params = $this->imageIndexGateway->getMainParametersForImages($identifiers);
                    if (!empty($params)) {
                        $this->imageIndexGateway->deleteTemporary($identifiers, $userprofile_id);
                        $this->imageIndexGateway->updatePrimary($identifiers, $params);

                        unset($result['error']);
                        $result['success'] = true;
                    }
                }
            } else {
                $result['error'] = 'Incorrect identifiers list';
            }
        }
        return $result;
    }

    /**
     * Revert images API method.
     * 
     * @param string $identifiers List identifiers string. JSON array format is used for identifiers.
     * @return [] Execution result.
     */
    public function revert($identifiers) {
        $result = [
            'success' => false,
            'error'   => 'Incorrect identifiers list'
        ];

        $identifiers = json_decode($identifiers);
        if (!empty($identifiers)) {
            $this->imageIndexGateway->revert($identifiers);

            unset($result['error']);
            $result['success'] = true;
        }
        return $result;
    }

    /**
     * Upload images API method.
     * Method processes following operations:
     *  1. Processes file uploading operation.
     *  2. Places information about uploaded file to the database.
     * 
     * @return 
     */
    public function upload() {
        $upload = $this->processImageUpload();
        if ($upload['success']) {
            return $this->create($upload['file']);
        } else {
            return $upload;
        }
    }

    /**
     * 
     */
    public function processImageUpload() {
        $file = null;
        $destinationPath = $this->configService->get('PN.Main.FileUploadLocation');
        
        // If destination directory doesn't exist, create it
        if (!is_dir($destinationPath)) {
            mkdir($destinationPath, 0777, true);
        }

        // Create the upload object
        $fileUpload = new FileUpload(
            'Filedata',
            $destinationPath,
            [
                'allowedTypes'      => $this->validMimeTypes,
                'allowedExtensions' => $this->validFileExtensions,
                'overwrite'         => false
            ]
        );

        // Do the file upload
        $fileUpload->upload();
        $file   = $fileUpload->getFile();
        $errors = $fileUpload->getErrors();

        // Localize the errors
        foreach ($errors as $k => $v) {
            $errors[$k] = $this->localizationService->getMessage($v);
        }

        if (!count($errors)) {
            // Correct mime type for files that may get uploaded as octet-stream and are actually something else
            $mimeTypeMap = [
                'xls'  => 'application/vnd.ms-excel',
                'xlsx' => 'application/vnd.ms-excel',
                'pdf'  => 'application/pdf',
                'doc'  => 'application/msword',
                'docx' => 'application/msword',
                'tif'  => 'image/tiff',
                'tiff' => 'image/tiff',
                'gif'  => 'image/gif',
                'jpeg' => 'image/jpeg',
                'jpg'  => 'image/jpeg'
            ];

            $file = $fileUpload->getFile();
            if ($file['type'] == 'application/octet-stream') {
                if (array_key_exists($file['extension'], $mimeTypeMap)) {
                    $file['type'] = $mimeTypeMap[$file['extension']];
                }
            }
        }

        return array(
            'success' => (count($errors)) ? false : true,
            'file'    => $file,
            'errors'  => (array)$errors
        );
    }

    /**
     * Create new Image.
     * Used by upload method currently to create database records for uploaded image.
     * 
     * This method is universal and could be used for any image creation scenario.
     * If request parameter is passed then request will be transformed to the correct
     * representation.
     * 
     * @param [] $file Object contains necessary details about uploaded file.
     */
    private function create($file) {
        $errors = [];
        $this->imageIndexGateway->beginTransaction();
        
        try {
            $image_index_id = null;
            $now = \NP\util\Util::formatDateForDB();
            $userprofile_id = $this->securityService->getUserId();

            $entityData = [
                'Image_Index_Name'         => $file['filename'],
                'asp_client_id'            => $this->configService->getClientId(),
                'Image_Index_Date_Entered' => $now
            ];
            
            $imageIndex = new ImageIndexEntity($entityData);

            $errors = $this->entityValidator->validate($imageIndex);
            
            if (!count($errors)) {
                $this->imageIndexGateway->save($imageIndex);

                $imageTransfer = new ImageTransferEntity([
                    'invoiceimage_id'         => $imageIndex->Image_Index_Id,
                    'transfer_type'           => $file['type'],
                    'transfer_filename'       => $file['file_path'],
                    'transfer_srcTableName'   => 'userprofile',
                    'transfer_srcTablekey_id' => $userprofile_id
                ]);

                $errors = $this->entityValidator->validate($imageTransfer);

                if (!count($errors)) {
                    $this->imageTransferGateway->save($imageTransfer);

                    $image_index_id = $imageIndex->Image_Index_Id;
                }
            }
        } catch(\Exception $e) {
            $errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
        }
        
        if (count($errors)) {
            $this->imageIndexGateway->rollback();
            // If there was any error, try to delete the file
            try {
                unlink($file['file_path']);
            // In this case, we'll just do nothing if deleting doesn't work because it's not critical
            } catch(\Exception $e) {}
        } else {
            $this->imageIndexGateway->commit();
        }
        
        return array(
            'success'        => (count($errors)) ? false : true,
            'file'           => $file,
            'errors'         => $errors,
            'image_index_id' => $image_index_id
        );
    }

    /**
     * Adds images to an entity
     */
    public function attach($entity_id, $image_tableref_name, $image_index_id_list) {
        $errors = [];
        $new_primary_image = null;
        $this->imageIndexGateway->beginTransaction();
        
        try {
            if ($image_tableref_name === 'Invoice') {
                $entity = $this->invoiceGateway->findSingle(
                    ['invoice_id' => '?'],
                    [$entity_id],
                    ['vendorsite_id'=>'paytablekey_id','property_id']
                );
            } else if ($image_tableref_name === 'Purchase Order') {
                $entity = $this->purchaseOrderGateway->findSingle(
                    ['purchaseorder_id' => '?'],
                    [$entity_id],
                    ['vendorsite_id','property_id']
                );
            }

            $tableref_id = $this->imageTablerefGateway->getIdByName($image_tableref_name);

            // Update all images being uploaded to link them to the entity and
            // set them all to NOT be primary
            $this->imageIndexGateway->update(
                [
                    'image_index_status'        => 1,
                    'tablekey_id'               => $entity_id,
                    'tableref_id'               => $tableref_id,
                    'image_index_primary'       => 0,
                    'image_index_vendorsite_id' => $entity['vendorsite_id'],
                    'property_id'               => $entity['property_id']
                ],
                Where::get()->in(
                    'image_index_id',
                    $this->imageIndexGateway->createPlaceholders($image_index_id_list)
                ),
                $image_index_id_list
            );

            // Check if there's already a primary image
            $primaryImage = $this->imageIndexGateway->findEntityImages(
                $entity_id,
                $image_tableref_name,
                true
            );

            // If there's no primary image, set the first added image as the primary
            if ($primaryImage === null) {
                $this->imageIndexGateway->update([
                    'Image_Index_Id'      => $image_index_id_list[0],
                    'image_index_primary' => 1
                ]);

                $new_primary_image = $this->imageIndexGateway->findById($image_index_id_list[0]);
            }

            $this->imageIndexGateway->commit();
        } catch(\Exception $e) {
            $this->imageIndexGateway->rollback();
            throw $e;
        }

        return $new_primary_image;
    }
   
    /**
     * Get Image information by id.
     * 
     * @param  int   $image_index_id Image index id
     * @return array
     */
    public function get($image_index_id) {
        return $this->imageIndexGateway->getImageDetails($image_index_id);
    }

    /**
     * Search image by params.
     * 
     * @param int $doctype Document type identifier.
     * @param int $searchtype Search type identifier: 1 - Image name, 2 - Scan date, 3 - Vendor.
     * @param string $searchstring Search string.
     * @param type $contextType Context type: Region, Property, Multiple Properties, All Properties.
     * @param type $contextSelection Context item: Item identifier(Region id or Property id) or identifiers depending 
     *      on context type.
     * @return [] List of images.
     */
    public function imageSearch($doctype, $searchtype, $searchstring, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $property_status=null) {
        return $this->imageIndexGateway->imageSearch($doctype, $searchtype, $searchstring, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $property_status);
    }

    /**
     * Search Images CD.
     * 
     * @param type $doctype Document type identifier.
     * @param type $refnumber
     * @param type $property_id
     * @param type $vendor_id
     * @return [] List of images.
     */
    public function imageSearchCDIndex($doctype = null, $refnumber = null, $property_id = null, $vendor_id = null) {
        if (!empty($doctype) && $doctype > 3) {
            $result = $this->imageToCDGateway->getVendorDocs($doctype, $vendor_id);
        } else {
            $result = [];
            if ($doctype == 1 || empty($doctype)) {
                $result = array_merge(
                    $result, 
                    $this->imageToCDGateway->getInvoiceDocs($doctype, $refnumber, $property_id, $vendor_id)
                );
            }
            if ($doctype == 2 || empty($doctype)) {
                $result = array_merge(
                    $result, 
                    $this->imageToCDGateway->getPurchaseOrderDocs($doctype, $refnumber, $property_id, $vendor_id)
                );
            }
        }
        return $result;
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
        return $this->imageIndexGateway->imageSearchDeleted($vendor, $invoice, $deletedby);
    }

    /**
     * Get available Image Document Types.
     * 
     * @param [] $tablerefs List of table references.
     * @return [] List of the document types.
     */
    public function getImageDoctypes($tablerefs) {
        return $this->imageDoctypeGateway->getImageDoctypes($tablerefs);
    }

    /**
     * Get document type list.
     * Result is used for the comboboxes.
     * 
     * @return [] List of the document types.
     */
    public function getDocTypes() {
        return $this->imageDoctypeGateway->listDocTypes();
    }

    /**
     * Makes the specified image a primary image
     * @param  int $image_index_id
     */
    public function makePrimary($image_index_id) {
        $this->imageIndexGateway->makePrimary($image_index_id);
    }

    public function update($data) {
        $doctypes = $this->imageDoctypeGateway->getIdByNames(['receipt', 'Utility Invoice']);
        $tablerefs = $this->imageTablerefGateway->getIdByNames(['receipt', 'Utility Invoice']);

        $params = $data['params'];
        $entity = $data['imageindex'];

        $entity['Image_Index_Name'] =
            str_replace('\'', '', $entity['Image_Index_Name'])
        ;

        if ($entity['Image_Doctype_Id'] == $doctypes[strtolower('Utility Invoice')]) {
            //$entity['Property_Id'] = $params['utility_property_id'];
        } elseif (empty($entity['Property_Id'])) {
            if (empty($entity['Property_Alt_Id'])) {
                $entity['Property_Id'] = null;
            }
        }

        if ($entity['Image_Doctype_Id'] == $doctypes[strtolower('Utility Invoice')]) {
            //$entity['Image_Index_VendorSite_Id'] = $params['utility_vendorsite_id'];
        } elseif (empty($entity['Image_Index_VendorSite_Id'])) {
            if (!empty($entity['invoiceimage_vendorsite_alt_id'])) {
                $entity['Image_Index_VendorSite_Id'] = $entity['invoiceimage_vendorsite_alt_id'];
            } else {
                $entity['Image_Index_VendorSite_Id'] = null;
            }
        }

        $refnum = '';
        if (!empty($entity['Image_Index_Ref'])) {
            $refnum = $entity['Image_Index_Ref'];
        } elseif (!empty($entity['po_ref'])) {
            $refnum = $entity['po_ref'];
        } else {
            $refnum = '';
        }
        $entity['Image_Index_Ref'] = str_replace('\'', '', $refnum);

        if ($params['action'] == 'exception') {
            // If image should be marked as "Exception"
            $entity['Image_Index_Exception_by'] = $params['userprofile_id'];
            $entity['Image_Index_Exception_datetm'] = date('Y-m-d H:i:s');
            $entity['Image_Index_Status'] = 2;
        } elseif ($params['action'] == 'complete') {
            // If image was marked as "Exception" but now it should be indexed.
            // This action could be processed from "Exception" section(tab).
            $entity['Image_Index_Exception_End_datetm'] = date('Y-m-d H:i:s');
            $entity['Image_Index_Status'] = 1;
        } elseif (!empty($params['image_delete'])) {
            // If image should be deleted. This action is moved to the separate
            // delete method.
            $entity['image_index_deleted_by'] = $params['userprofile_id'];
            $entity['image_index_deleted_datetm'] = date('Y-m-d H:i:s');
            $entity['Image_Index_Status'] = -1;
        } else {
            // If parameters were not passed, then default action should be selected.
            // If current section is "Exceptions" then this is exception image.
            // If current section is "Index" then this is usual indexed image.
            if (strtolower($params['section']) == 'exceptions') {
                $entity['Image_Index_Status'] = 2;
            } elseif (strtolower($params['section']) == 'index') {
                $entity['Image_Index_Status'] = 1;
            }
        }

        // This block is not needed anymore
        if ($params['action'] == 'complete' && empty($params['image_delete'])) {
            $entity['image_index_indexed_by'] = $params['userprofile_id'];
            $entity['image_index_indexed_datetm'] = date('Y-m-d H:i:s');
        }

        if (!empty($entity['utilityaccount_id'])) {
            $utilAccount = $this->utilityAccountGateway->findById($entity['utilityaccount_id']);
            
            $entity['Property_Id'] = $utilAccount['property_id'];
            $entity['Image_Index_VendorSite_Id'] = $utilAccount['Vendorsite_Id'];
        }

        if ($entity['Image_Doctype_Id'] == 1) {
            $tableref_id = 1;
        } elseif ($entity['Image_Doctype_Id'] == 2) {
            $tableref_id = 3;
        } elseif ($entity['Image_Doctype_Id'] == 3) {
            $tableref_id = 4;
        } elseif ($entity['Image_Doctype_Id'] == $doctypes[strtolower('receipt')]) {
            $tableref_id = $tablerefs[strtolower('receipt')];
        } elseif ($entity['Image_Doctype_Id'] == $doctypes[strtolower('Utility Invoice')]) {
            $tableref_id = $tablerefs[strtolower('Utility Invoice')];
        } elseif ($entity['Image_Doctype_Id'] > 3) {
            $tableref_id = 2;

            if (!empty($entity['Image_Index_VendorSite_Id'])) {
                $entity['Tablekey_Id'] = $entity['Image_Index_VendorSite_Id'];//#listFirst(request.utilityaccount_id)#
            } elseif (!empty($entity['invoiceimage_vendorsite_alt_id'])) {
                $entity['Tablekey_Id'] = $entity['invoiceimage_vendorsite_alt_id'];//#listFirst(request.utilityaccount_id)#
            }
        }
        $entity['Tableref_Id'] = !empty($tableref_id) ? $tableref_id : null;

        $entity['Image_Index_Id'] = intval($entity['Image_Index_Id']);
        $entity['asp_client_id'] =  $this->configService->getClientId();

        $image = new ImageIndexEntity($entity);

        $errors = $this->entityValidator->validate($image);
        if (!count($errors)) {
            try {
                $this->imageIndexGateway->save($image);
            } catch (\Exception $e) {
                $errors[] = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
            }
        }

        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors
        );
    }
}
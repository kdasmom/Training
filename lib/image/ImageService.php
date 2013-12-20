<?php

namespace NP\image;

use NP\core\AbstractService;
use NP\security\SecurityService;
use NP\core\io\FileUpload;
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
     * Get images for an invoice (all or primary only)
     */
    public function getInvoiceImages($invoice_id, $mainOnly=false) {
        return $this->imageIndexGateway->findEntityImages($invoice_id, 'Invoice', $mainOnly);
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
        $upload = $this->uploadProcess();
        if ($upload['success']) {
            return $this->create($upload);
        }
    }

    /**
     * Process file uploading.
     * Method processes following operations:
     *  1. Get pure file name and file extension.
     *  2. Check file name for incorrect symbols.
     *  3. Move uploaded file to the correct place.
     *  4. Correct mime-type if default php mechanism get it wrong.
     * 
     * @return [] Object with file details.
     */
    private function uploadProcess() {
        $field = 'Filedata';
        $target = $this->configService->get('PN.Main.FileUploadLocation');
        if (!is_dir($target)) {
            mkdir($target, 0777, true);
        }

        $mimetypes = [
            'xls'   => 'application/vnd.ms-excel',
            'xlsx'  => 'application/vnd.ms-excel',
            'pdf'   => 'application/pdf',
            'doc'   => 'application/msword',
            'docx'  => 'application/msword',
            'tif'   => 'image/tiff',
            'tiff'  => 'image/tiff',
            'gif'   => 'image/gif',
            'jpeg'  => 'image/jpeg',
            'jpg'   => 'image/jpeg'
        ];
        $extensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'jpeg', 'jpg', 'gif', 'tif', 'tiff'];

        // Remove extension
        $filename = $_FILES['Filedata']['name'];
        $fileextension = null;
        foreach($extensions as $extension) {
            if (substr($filename, -(strlen($extension) + 1)) == '.'.$extension) {
                $filename = substr($filename, 0, strlen($filename) - strlen($extension) - 1);
                $fileextension = $extension;

                break;
            }
        }
        // If file extension is not correct then interrupt uploading.
        if (!$fileextension) return;

        // Check file name for incorrect symbol usage.
        $symbols = 
            ['/', '"', ':', ';', '\'', '#', '!', '@', '$', '%', '^', '&', '*', '(', ')', '<', '>', '?']
        ;
        foreach ($symbols as $symbol) {
            str_replace($symbol, '', $filename);
        }

        // Make file name unique.
        $fullname = 
            $filename.
                $this->securityService->getUserId().
                date('mdYHis').
            '.'.
            $fileextension
        ;

        // Coorect target file name according to the rules which are described before.
        $_FILES['Filedata']['name'] = $fullname;

        // Upload file
        $params = [
            'allowedTypes'  => [
                'application/pdf',
                'image/gif',
                'image/jpeg',
                'image/tiff',
                'application/msword',
                'application/vnd.ms-excel',
                'application/octet-stream',
                'application/vnd.ms-powerpoint'
            ]
        ];

        $upload =
            new FileUpload($field, $target, $params)
        ;
        $upload->upload();

        //Correct mime type if necessary
        $mimetype = $upload->getFile()['type'];
        if ($mimetype == 'application/octet-stream') {
            foreach ($mimetypes as $extension => $type) {
                if ($fileextension == $extension) {
                    $mimetype = $type;
                }
            }
        }

        $result = [
            'success'   => 
                count($upload->getErrors()) > 0 ? false : true
            ,
            'mimetype'  => $mimetype,
            'filename'  => $filename,
            'fullname'  => $target . $fullname
        ];
        return $result;
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
     * @param [] $request
     */
    private function create($file, $request = []) {
        $params = $this->prepareCreateParams();
        $request = $this->prepareCreateRequest($request, $params);

        if ($request['transfer_srcTablekey_id'] == -1) {
            $source = 
                $this->invoiceImageSourceGateway->getByName($request['transfer_srcTableName'])
            ;
            $request['transfer_srcTableName'] = 'INVOICEIMAGESOURCE';
            $request['transfer_srcTablekey_id'] = $source['source_id_alt'];
            $request['invoiceimage_source_id']  = $source['source_id'];
        }

        // IMAGE INDEX: prepare data for save
        $imageIndexData = 
            $this->prepareCreateImage($file, $params, $request)
        ;

        // Adjust image_tableref_id because it couldn't be done earlier during IMAGE INDEX data 
        // preparation. 
        if ($request['invoice_id'] == -1) {
            // This should be done because original logic allows different nonlinear assignment.
            $request['image_tableref_id'] = 0;
        }

        // Find out is this primary image or not
        if ($request['image_tableref_id'] <> 5) {
            if ($request['invoice_id'] > 0) {
                $count = $this->imageIndexGateway->countImagesByTableref(
                    isset($imageIndexData['image_tableref_id']) ? $imageIndexData['image_tableref_id'] :$request['image_tableref_id'],
                    $request['invoice_id']
                );

                $imageIndexData['image_index_status'] = 1;
                $imageIndexData['image_index_primary'] = $count > 1 ? 0 : 1;
            }
        } else {
            $count = $this->imageIndexGateway->countImagesByDoctype(
                $imageIndexData['image_doctype'],
                $request['invoice_id']
            );
            if ($count > 1) {
                $imageIndexData['image_index_status'] = 1;
                $imageIndexData['image_index_primary'] = 0;
            }
        }

        // IMAGE INDEX: prepare entity for save
        $imageIndexEntity = new ImageIndexEntity([
            'Image_Index_Name'          => 
                isset($imageIndexData['invoiceimage_name']) ? 
                    $imageIndexData['invoiceimage_name'] : 
                    'Invoice Image'
            ,
            'Image_Index_Id_Alt'        => $request['document_id'],
            'Image_Index_VendorSite_Id' => $request['vendorsite_id'],
            'Property_Id'               => $request['property_id'],
            'Image_Index_Ref'           => $request['invoiceimage_ref'],
            'Image_Index_Amount'        => $request['invoiceimage_amount'],
            'Image_Index_Invoice_Date'  =>
                isset($imageIndexData['invoiceimage_date']) ? 
                    $imageIndexData['invoiceimage_name'] :
                    $request['invoiceimage_date']
            ,
            'asp_client_id'             => $request['asp_client_id'],
            'Tablekey_Id'               => $request['invoice_id'],
            'Image_Index_Status'        =>
                isset($imageIndexData['invoiceimage_status']) ?
                    $imageIndexData['invoiceimage_status'] :
                    $request['invoiceimage_status']
            ,
            'Image_Index_Source_Id'     => 
                empty($request['invoiceimage_source_id']) ? 
                    1 :
                    $request['invoiceimage_source_id']
            ,
            'Tableref_Id'               =>
                isset($imageIndexData['image_tableref_id']) ? 
                    $imageIndexData['image_tableref_id'] :
                    $request['image_tableref_id']
            ,
            'Image_Index_Date_Entered'  => date('Y-m-d H:i:s'),
            'Image_Doctype_Id'          => $imageIndexData['image_doctype'],
            'Image_Index_Primary'       => 
                !empty($imageIndexData['image_index_primary']) ?
                    $imageIndexData['image_index_primary'] :
                    1
            ,
            'image_index_indexed_datetm'=> $imageIndexData['image_index_indexed_datetm'],
            'image_index_indexed_by'    => $imageIndexData['image_index_indexed_by']
        ]);

        $errors = $this->entityValidator->validate($imageIndexEntity);
        if (!count($errors)) {
            try {
                $this->imageIndexGateway->beginTransaction();

                // IMAGE INDEX: Save data
                $invoiceimage_id = $this->imageIndexGateway->save($imageIndexEntity);
            } catch (\Exception $e) {
                $this->imageIndexGateway->rollback();
                return [
                    'field' => 'global', 
                    'msg' => $this->handleUnexpectedError($e)
                ];
            }
        }        
        
        // IMAGE TRANSFER: prepare data for save
        // IMAGE TRANSFER: prepare entity for save
        $imageTransferEntity = new ImageTransferEntity([
            'transfer_type'           => $file['mimetype'],
            'transfer_status'         => 1,
            'transfer_filename'       => $file['fullname'],
            'transfer_documentid'     => $request['document_id'],
            'transfer_databaseid'     => $request['database_id'],
            'invoiceimage_id'         => $invoiceimage_id,
            'transfer_srcTableName'   => $request['transfer_srcTableName'],
            'transfer_srcTablekey_id' => $request['transfer_srcTablekey_id']
        ]);

        $errors = $this->entityValidator->validate($imageTransferEntity);
        if (!count($errors)) {
            try {
                $this->imageTransferGateway->beginTransaction();

                //IMAGE TRANSFER: Save data
                $this->imageTransferGateway->save($imageTransferEntity);
            } catch (\Exception $e) {
                $this->imageIndexGateway->rollback();
                $this->imageTransferGateway->rollback();

                return [
                    'field' => 'global', 
                    'msg' => $this->handleUnexpectedError($e)
                ];
            }
        }        
        $this->imageIndexGateway->commit();
        $this->imageTransferGateway->commit();

        if (is_numeric($request['invoice_id']) && $request['invoice_id'] > 0) {
            // Log this operation
            $activities = $this->auditactivityGateway->getIdByNames(['ImgUploaded', 'ImgAdded']);
            $type       = $this->audittypeGateway->getIdByTableref($request['image_tableref_id']);

            $this->auditlogGateway->logImageUploaded(
                $type, 
                $activities['ImgUploaded'],
                $request['invoice_id'],
                $invoiceimage_id,
                $this->invoiceImageSourceGateway->getById($request['invoiceimage_source_id']), //$invoiceimage_source_name,
                $this->securityService->getUserId(),
                $request['delegation_to_userprofile_id']
            );
            $this->auditlogGateway->logImageAdded(
                $type, 
                $activities['ImgUploaded'],
                $request['invoice_id'],
                $invoiceimage_id,
                $this->securityService->getUserId(),
                $request['delegation_to_userprofile_id']
            );
        }

        return $invoiceimage_id;
    }

    /**
     * Prepare useful parameters for image creation mechanism. 
     * Request from database some additional values which will be used during image creation process.
     * 
     * @return [] Object with useful parameters.
     */    
    private function prepareCreateParams() {
        $result = [
            'tableref' => [],
            'doctypes' => []
        ];
        $result['tableref'][strtolower('vendor')] = 
            $this->imageTablerefGateway->getIdByName('vendor')
        ;

        $doctypes = 
            $this->imageDoctypeGateway->getIdByNames(['receipt', 'Vendor Access'])
        ;
        foreach ($doctypes as $doctype => $id) {
            $result['doctypes'][strtolower($doctype)] = $id;
        }

        return $result;
    }

    /**
     * Prepare request data.
     * Before saving some fields should have specific values, some fields should be initilized.
     * All preparations should be done in this method.
     * 
     * @param [] $request Request 
     * @return [] Prepared request object.
     */
    private function prepareCreateRequest($request) {
        $result = $request;

        if (isset($request['VendorEst_id'])) {
            $result['image_tableref_id'] = 4;
        } elseif (isset($request['table_name'])) {
            if ($request['table_name'] == 'purchaseorder') {
                $result['image_tableref_id'] = 3;
            } elseif ($request['table_name'] == 'receipt') {
                $result['image_tableref_id'] = 7;
            }
        } elseif (!isset($request['invoice_id']) && isset($request['vendorsite_id'])) {
            $result['image_tableref_id'] = $request['image_tableref_id'];
        } else {
            $result['image_tableref_id'] = 0;
        }

        if (!isset($request['database_id'])) {
            $result['document_id'] = 0;
        }
        if (!isset($request['database_id'])) {
            $result['database_id'] = 0;
        }

        if (!isset($request['vendorsite_id'])) {
            $result['vendorsite_id'] = null;
        }
        if (!isset($request['property_id'])) {
            $result['property_id'] = null;
        }
        if (!isset($request['invoiceimage_ref'])) {
            $result['invoiceimage_ref'] = null;
        }
        if (!isset($request['invoiceimage_amount'])) {
            $result['invoiceimage_amount'] = null;
        }

        if (isset($request['invoiceimage_date']) && $request['invoiceimage_date'] != "") {
            $result['invoiceimage_date'] = urldecode($request['invoiceimage_date']); // pass null, field timestamped, but really - no
        } elseif (isset($request['doc_datetm'])) {
            $result['invoiceimage_date'] = $request['doc_datetm'];
        } else {
            $result['invoiceimage_date'] = null;
        }

        $result['asp_client_id'] = $this->configService->getClientId();

        if (isset($request['invoice_id'])) {
            $result['invoice_id'] = $request['invoice_id'];
        } elseif (isset($request['VendorEst_id'])) {
            $result['invoice_id'] = $request['VendorEst_id'];
        } elseif (isset($request['tablekey_id'])) {
            $result['invoice_id'] = $request['tablekey_id'];
        } elseif (isset($request['vendorsite_id'])) {
            $result['invoice_id'] = -1;
        } else {
            $result['invoice_id'] = 0;
        }

        if (!isset($request['invoiceimage_source_id'])) {
            $result['invoiceimage_source_id'] = 1;
        }

        if (isset($request['vendorsite_id'])) {
            $result['invoiceimage_status'] = 1;
        } else {
            $result['invoiceimage_status'] = 0;
        }

        if (!isset($request['transfer_srcTableName'])) {
            $result['transfer_srcTableName'] = 'userprofile';
        }
        if (!isset($request['transfer_srcTablekey_id'])) {
            $result['transfer_srcTablekey_id'] = $this->securityService->getUserId();
        }

        if (!isset($request['delegation_to_userprofile_id'])) {
            $result['delegation_to_userprofile_id'] = $this->securityService->getUserId();; 
        }

        if (!empty($request['invoice_id'])) {
            $referrences = $this->invoiceGateway->getInvoiceRef($request['invoice_id']);
            if (count($referrences) > 0) {
                $request['invoiceimage_ref'] = $referrences[0]['invoice_ref'];
            }
        }

        return $result;
    }

    /**
     * Prepare Image Index data for save.
     * 
     * @param type $file Uploaded file data.
     * @param type $params Calculated parameters, based on database requests and so on.
     * @param type $request  Request contains all primary parameters.
     */
    private function prepareCreateImage($file, $params, $request) {
        $data = [];

        $data['invoiceimage_name'] = $file['filename'];
        if (empty($data['invoiceimage_name'])) {
            $data['invoiceimage_name'] = 'Invoice Image';
        }

        if ($request['invoiceimage_source_id'] <> 1) {
            $data['image_doctype'] = 1;
        }

        if ($request['invoiceimage_date'] == '1900-01-01 00:00:00.000') {
            $data['invoiceimage_date'] = null;
        }

        if ($request['invoice_id'] == 0) {
            $data['image_doctype'] = 0;
            $data['image_tableref_id'] = 0;
        } elseif ($request['invoice_id'] == -1) {
            $data['image_doctype'] = $request['image_tableref_id'];
            $data['image_tableref_id'] = $params['tableref'][strtolower('vendor')];

            $request['image_tableref_id'] = 0; // It also will be updated in the caller method
        } else {
            $data['image_doctype'] = 1;
            $data['image_tableref_id'] = 1;
        }

        if (isset($request['invoiceimage_status'])) {
            if ($request['property_id'] == 0 || is_null($request['property_id']))
                $data['invoiceimage_status'] = 0;
            if ($request['vendorsite_id'] == 0 || is_null($request['vendorsite_id']))
                $data['invoiceimage_status'] = 0;
        }

        if ($request['image_tableref_id'] == 3) {
            $data['image_tableref_id'] = $request['image_tableref_id'];
            $data['invoiceimage_status'] = 1;
            $data['image_doctype'] = 2;
        } elseif ($request['image_tableref_id'] == 7) {
            $data['image_tableref_id'] = $request['image_tableref_id'];
            $data['invoiceimage_status'] = 1;
            $data['image_doctype'] = $params['doctypes'][strtolower('receipt')];
        } elseif ($request['image_tableref_id'] == 4) {
            $data['image_tableref_id'] = $request['image_tableref_id'];
            $data['invoiceimage_status'] = 1;
            $data['image_doctype'] = 3;
        } elseif ($request['image_tableref_id'] == 5) {
            $data['image_tableref_id'] = $request['image_tableref_id'];
            $data['invoiceimage_status'] = 0;
            $data['image_doctype'] = $params['doctypes'][strtolower('Vendor Access')];
        }

        $data['image_index_indexed_datetm'] = null;
        $data['image_index_indexed_by']     = null;

        return $data;
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
    public function imageSearch($doctype, $searchtype, $searchstring, $contextType, $contextSelection) {
        return $this->imageIndexGateway->imageSearch($doctype, $searchtype, $searchstring, $contextType, $contextSelection);
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
<?php

namespace NP\image;

use NP\core\AbstractService;
use NP\security\SecurityService;
use NP\core\io\FileUpload;
use NP\system\ConfigService;
use NP\system\IntegrationPackageGateway;

/**
 * Service class for operations related to Images
 *
 * @author Thomas Messier
 */
class ImageService extends AbstractService {

	protected $securityService, $imageIndexGateway, $imageTransferGateway, $configService, $imageTablerefGateway, $imageDoctypeGateway, $invoiceImageSourceGateway,
                $auditactivityGateway, $auditlogGateway, $audittypeGateway, $integrationPackageGateway;

	public function __construct(ImageIndexGateway $imageIndexGateway, ImageTransferGateway $imageTransferGateway, ConfigService $configService, ImageTablerefGateway $imageTablerefGateway,
                ImageDoctypeGateway $imageDoctypeGateway, InvoiceImageSourceGateway $invoiceImageSourceGateway, AuditactivityGateway $auditactivityGateway,AuditlogGateway $auditlogGateway, 
                AudittypeGateway $audittypeGateway, IntegrationPackageGateway $integrationPackageGateway) {
		$this->imageIndexGateway    = $imageIndexGateway;
		$this->imageTransferGateway = $imageTransferGateway;
                $this->configService        = $configService;
                $this->imageTablerefGateway = $imageTablerefGateway;
                $this->imageDoctypeGateway  = $imageDoctypeGateway;
                $this->auditactivityGateway  = $auditactivityGateway;
                $this->auditlogGateway      = $auditlogGateway;
                $this->audittypeGateway     = $audittypeGateway;
                $this->invoiceImageSourceGateway = $invoiceImageSourceGateway;
                $this->integrationPackageGateway = $integrationPackageGateway;
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
	public function getImagesToConvert($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->imageIndexGateway->findImagesToConvert($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}
	public function getImagesToConvert1($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
            $countOnly = 'false';
            return $this->imageIndexGateway->findImagesToConvert($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
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
	public function getImagesToProcess1($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
                   $countOnly = 'false';
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

	public function getImageExceptions1($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
            $countOnly = 'false';
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

	public function getImagesToIndex1($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
            $countOnly = false;
		return $this->imageIndexGateway->findImagesToIndex($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

        public function getImagesToDelete($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
            $countOnly = false;
		return $this->imageIndexGateway->findImagesToDelete($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
        }


        
        
        




        /**
         * Upload file.
         * 
         * @return type
         */
        private function upload() {
            $field = 'Filedata';
            $target = $_SERVER['DOCUMENT_ROOT'] . '/files/';

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
            $filename .=
                $this->securityService->getUserId().
                date('mdYHis')
            ;

            // Coorect target file name according to the rules which are described before.
            $_FILES['Filedata']['name'] = 
                $filename.
                '.'.
                $fileextension
            ;

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
                'fullname'  => $target . $filename . '.' .$fileextension
            ];
            return $result;
        }

        /**
         * 
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

            $data['image_index_indexed_datetm'] = date('Y-m-d H:i:s');
            $data['image_index_indexed_by']     = $this->securityService->getUserId();

            return $data;
        }

        private function prepareCreateParams() {
            $result = [];

            $params['tableref'] = [];
            $params['tableref'][strtolower('vendor')] = $this->imageTablerefGateway->getIdByName('vendor');

            $doctypes = $this->imageDoctypeGateway->getIdByNames(['receipt', 'Vendor Access']);

            $params['doctypes'] = [];
            foreach ($doctypes as $doctype => $id) {
                $params['doctypes'][strtolower($doctype)] = $id;
            }

            return $result;
        }
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
                $result['delegation_to_userprofile_id'] = 1; 
                // Don't know what this parameter means client.delegation_to_userprofile_id
                //<cfset client.delegation_to_userprofile_id = request.delegation_to_userprofile_id /> || <cfset client.delegation_to_userprofile_id = request.userprofile_id />
            }

            if (!empty($request['invoice_id'])) {
                $referrences = $this->imageIndexGateway->getInvoiceRef($request['invoice_id']);
                if (count($referrences) > 0) {
                    $request['invoiceimage_ref'] = $referrences[0]['invoice_ref'];
                }
            }

            return $result;
        }

        private function create($file, $request = []) {
            $params = $this->prepareCreateParams();
            $request = $this->prepareCreateRequest($request);

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
                $this->prepareCreateImage($file, $params,$request)
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
                'image_index_name'          => 
                    isset($imageIndexData['invoiceimage_name']) ? 
                        $imageIndexData['invoiceimage_name'] : 
                        'Invoice Image'
                ,
                'image_index_id_alt'        => $request['document_id'],
                'image_index_vendorsite_id' => $request['vendorsite_id'],
                'property_id'               => $request['property_id'],
                'image_index_ref'           => $request['invoiceimage_ref'],
                'image_index_amount'        => $request['invoiceimage_amount'],
                'image_index_invoice_date'  =>
                    isset($imageIndexData['invoiceimage_date']) ? 
                        $imageIndexData['invoiceimage_name'] :
                        $request['invoiceimage_date']
                ,
                'asp_client_id'             => $request['asp_client_id'],
                'tablekey_id'               => $request['invoice_id'],
                'image_index_status'        =>
                    isset($imageIndexData['invoiceimage_status']) ?
                        $imageIndexData['invoiceimage_status'] :
                        $request['invoiceimage_status']
                ,
                'image_index_source_id'     => $request['invoiceimage_source_id'],
                'tableref_id'               =>
                    isset($imageIndexData['image_tableref_id']) ? 
                        $imageIndexData['image_tableref_id'] :
                        $request['image_tableref_id']
                ,
                'image_doctype_id'          => $imageIndexData['image_doctype'],
                'image_index_primary'       => 
                    !empty($imageIndexData['image_index_primary']) ?
                        $imageIndexData['image_index_primary'] :
                        1
                ,
                'image_index_indexed_datetm'=> $imageIndexData['image_index_indexed_datetm'],
                'image_index_indexed_by'    => $imageIndexData['image_index_indexed_by']
            ]);

            // IMAGE INDEX: Save data
            $invoiceimage_id = $this->imageIndexGateway->save($imageIndexEntity);

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

            //IMAGE TRANSFER: Save data
            $this->imageTransferGateway->save($imageTransferEntity);

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

        public function save() {
            $upload = $this->upload();
            if ($upload['success']) {
                return $this->create($upload);
            }
        }

        public function show($image_id = null, $doc_id = null, $summarystat_id = null, $tablekey_id = null, $table_name = null, $invoiceimage_id = null) {
            if (!empty($image_id)) {
                $imageindex_id = $image_id;
            } elseif (!empty($doc_id) && !empty($summarystat_id)) {
                $tableref = 'invoice';
                if (in_array($summarystat_id, [3, 9, 14, 17, 26, 29])) {
                    $tableref = 'purchase order';
                } elseif (in_array($summarystat_id, [4, 6, 8, 10, 15, 16, 18, 19, 20, 21, 23, 25])) {
                    $tableref = 'invoice';
                } elseif (in_array($summarystat_id, [5, 13])) {
                    $tableref = 'vendor';
                } elseif (in_array($tableref, [27, 28])) {
                    $tableref = 'receipt';
                }

                $tableref = $this->imageTablerefGateway->getIdByName($tableref);
                $imageindex_id = $this->imageIndexGateway->lookupImage($doc_id, $tableref);
            } elseif (!empty($tablekey_id) && !empty($table_name)) {
                $tableref = 'invoice';
                if ($table_name = 'purchaseorder' || $table_name = 'purchase order') {
                    $tableref = 'purchase order';
                } elseif ($table_name == 'receipt') {
                    $tableref = 'receipt';
                }

                $tableref = $this->imageTablerefGateway->getIdByName($tableref);
                $imageindex_id = $this->imageIndexGateway->lookupImage($tablekey_id, $tableref);
            } elseif (empty($invoiceimage_id) || (!empty($invoiceimage_id) && $invoiceimage_id == "")) {
                $imageindex_id = 0;
            }

            $transfer = $this->imageTransferGateway->getByInvoiceImageId($imageindex_id);

            header('Content-Type: ' . $transfer['type']);
            die(file_get_contents($transfer['filename']));
        }

        public function listDocTypes() {
            $list = [
                'Invoice',
                'Purchase Order',
                'Receipt',
                'Utility Invoice'
            ];
            $types = $this->imageDoctypeGateway->find();

            $result = [];
            foreach ($types as $type) {
                if (in_array($type['image_doctype_name'], $list)) {
                    $result[] = $type;
                }
            }
            return $result;
        }
        public function listIntegrationPackages() {
            return $this->integrationPackageGateway->find();
        }

        public function delete($permanently = false, $identifiers, $delegation_to_userprofile_id = null) {
            $userprofile_id = $this->securityService->getUserId();
            if (empty($delegation_to_userprofile_id)) {
                $delegation_to_userprofile_id = $userprofile_id;
            }
            $identifiers = json_decode($identifiers);

            if (!empty($identifiers)) {
                if ($permanently) {
                    //Delete real file
                    $files = $this->imageTransferGateway->getFilesById($identifiers);
                    foreach($files as $filename) {
                        unlink($filename);
                    }

                    //Delete records from the database
                    $this->imageIndexGateway->deletePermanently($identifiers);
                    $this->imageTransferGateway->deletePermanently($identifiers);

                    return ['success' => true];
                } else {
                    $params = $this->imageIndexGateway->getMainParametersForImages($identifiers);
                    if (!empty($params)) {
                        $this->imageIndexGateway->deleteTemporary($identifiers, $userprofile_id);
                        $this->imageIndexGateway->updatePrimary($identifiers, $params);

                        return ['success' => true];
                    }
                }
                
            }
        }

        

        
        
        
        
        
        
        
        
        /**
         * Get Image information by id.
         * 
         * @param int $id Image index id
         * @param String $filter Property filter
         * @return ImageIndexEntity Image index entity
         */
        public function get($id, $filter = []) {
            $tablerefs =
                $this->imageTablerefGateway->getIdByNames(
                    ['receipt', 'Utility Invoice']
                )
            ;
            $scans = $this->imageIndexGateway->getImageScan(
                $id,
                [
                    'property_id'   => null,
                    'tableref_id'   => null,
                    'asp_client_id' => $this->configService->getClientId()
                ],
                $tablerefs
            );

            if (!empty($scans) && !empty($scans[0])) {
                return $scans[0];
            }
        }

        public function update($data) {
            $doctypes = $this->imageDoctypeGateway->getIdByNames(['receipt', 'Utility Invoice']);
            $tablerefs = $this->imageTablerefGateway->getIdByNames(['receipt', 'Utility Invoice']);

            $params = $data['params'];
            /*$data['mark_as_exception'] = null;
            $data['indexing_complete'] = null;
            $data['image_delete'] = null;
            $data['image_index_draft_invoice_id'] = null;*/

            $entity = $data['imageindex'];

            $entity['Image_Index_Name'] =
                str_replace('\'', '', $entity['Image_Index_Name'])
            ;

            if ($entity['Image_Doctype_Id'] == $doctypes[strtolower('Utility Invoice')]) {
                //$entity['Property_Id'] = $entity[] request.property_id = request.utility_property_id не в модели -> требует отдельного разбора

                //<cfset request.property_id = request.utility_property_id />
                //<cfqueryparam cfsqltype="CF_SQL_INTEGER" value="#request.property_id#" null="No">
            } elseif (empty($entity['Property_Id'])) {
                if (!empty($params['Property_Alt_Id'])) {
                    $entity['Property_Id'] = $params['Property_Alt_Id'];
                } else {
                    $entity['Property_Id'] = null;
                }
            }

            if ($entity['Image_Doctype_Id'] == $doctypes[strtolower('Utility Invoice')]) {
                $entity['Image_Index_VendorSite_Id'] = $params['utility_vendorsite_id'];
            } elseif (!empty($params['invoiceimage_vendorsite_id'])) {
                $entity['Image_Index_VendorSite_Id'] = $params['invoiceimage_vendorsite_id'];
            } elseif (!empty($params['invoiceimage_vendorsite_alt_id'])) {
                $entity['Image_Index_VendorSite_Id'] = $params['invoiceimage_vendorsite_alt_id'];
            } else {
                $entity['Image_Index_VendorSite_Id'] = null;
            }

            $refnum = '';
            if (!empty($params['invoiceimage_ref'])) {
                $refnum = $params['invoiceimage_ref'];
            } elseif (!empty($params['po_ref'])) {
                $refnum = $params['po_ref'];
            } else {
                $refnum = '';
            }
            $entity['Image_Index_Ref'] = str_replace('\'', '', $refnum);

            if (!empty($params['mark_as_exception'])) {
                $entity['Image_Index_Exception_by'] = $params['userprofile_id'];
                $entity['Image_Index_Exception_datetm'] = date('Y-m-d H:i:s');
                $entity['Image_Index_Status'] = 2;
            } elseif (!empty($params['indexing_complete'])) {
                $entity['Image_Index_Exception_End_datetm'] = date('Y-m-d H:i:s');
                $entity['Image_Index_Status'] = 1;
            } elseif (!empty($params['image_delete'])) {
                $entity['image_index_deleted_by'] = $params['userprofile_id'];
                $entity['image_index_deleted_datetm'] = date('Y-m-d H:i:s');
                $entity['image_index_status'] = -1;
            } else {
                if (strtolower($params['section']) == 'exceptions') {
                    $entity['image_index_status'] = 2;
                } elseif (strtolower($params['section']) == 'index') {
                    $entity['image_index_status'] = 1;
                }
            }

            if (!empty($params['indexing_complete']) && empty($params['image_delete'])) {
                $entity['image_index_indexed_by'] = $params['userprofile_id'];
                $entity['image_index_indexed_datetm'] = date('Y-m-d H:i:s');
            }

            $flag = "";
            switch ($entity['Image_Doctype_Id']) {
                case 1:
                    $flag = $params['PriorityFlag_ID_Alt_invoice'];
                    break;
                case 2:
                    $flag = $params['PriorityFlag_ID_Alt_po'];
                    break;
                case 3:
                    $flag = $params['PriorityFlag_ID_Alt_vef'];
                    break;
                default:
                    $flag = '';
            }
            if (!empty($flag)) {
                $entity['PriorityFlag_ID_Alt'] = $flag;
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

                // Эти поля должны автоматически прийти
//                        $update->value('utilityaccount_id', $data['utilityaccount_id']);//#listFirst(request.utilityaccount_id)#
//                        $update->value('utilityaccount_accountnumber', $data['utilityaccount_accountnumber']);//#listFirst(request.utilityaccount_id)#
//                        $update->value('utilityaccount_metersize', $data['utilityaccount_metersize']);//#listFirst(request.utilityaccount_id)#
//
//                        $update->value('cycle_from', !empty($data['cycle_from']) ? $data['cycle_from'] : null);//#listFirst(request.utilityaccount_id)#
//                        $update->value('cycle_to', !empty($data['cycle_to']) ? $data['cycle_to'] : null);//#listFirst(request.utilityaccount_id)#
            } elseif ($entity['Image_Doctype_Id'] > 3) {
                $tableref_id = 2;

                if (!empty($params['invoiceimage_vendorsite_id'])) {
                    $entity['Tablekey_Id'] = $params['invoiceimage_vendorsite_id'];//#listFirst(request.utilityaccount_id)#
                } elseif (!empty($params['invoiceimage_vendorsite_alt_id'])) {
                    $entity['Tablekey_Id'] = $params['invoiceimage_vendorsite_alt_id'];//#listFirst(request.utilityaccount_id)#
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

            //return $this->imageIndexGateway->updateImage($data['imageindex'], $params, $doctypes, $tablerefs);
        }
}



 /*$filter['userprofile_id'] =
                !empty($filter['userprofile_id']) ?
                    intval($filter['userprofile_id']) :
                    $this->securityService->getUserId()
            ;
            $filter['delegated_to_userprofile_id'] =
                !empty($filter['delegated_to_userprofile_id']) ?
                    intval($filter['delegated_to_userprofile_id']) :
                    $this->securityService->getUserId()
            ;
            $filter['contextType'] =
                !empty($filter['contextType']) ?
                    $filter['contextType'] :
                    'all'
            ;
            $filter['contextSelection'] =
                !empty($filter['contextSelection']) ?
                    $filter['contextSelection'] :
                    null
            ;

/*




        private function indexPrepareRequest() {
            $request = [];
$request = $_REQUEST;
            // Service fields: maybe moved into params
            $request['mark_as_exception'] = null;
            $request['indexing_complete'] = null;
            $request['image_delete'] = null;
            $request['image_index_draft_invoice_id'] = null;

            // Actual fields
            //$request['doctype'] = $_REQUEST['field-doctype-inputEl'];
            $request['doctype'] = $_REQUEST['Image_Doctype_Id'];
            //$request['invoiceimage_name'] = $_REQUEST['field-imagename-inputEl'];
//            $request['integration_package_id'] = $_REQUEST['field-integration-package-inputEl'];

  //          $request['property_id'] = $_REQUEST['field-property-inputEl'];
    //        $request['property_alt_id'] = $_REQUEST['field-property-code-inputEl'];
/*
            $request['invoiceimage_vendorsite_id'] = $_REQUEST['field-vendor-inputEl'];
            $request['invoiceimage_vendorsite_alt_id'] = $_REQUEST['field-vendor-code-inputEl'];

            $request['invoiceimage_ref'] = $_REQUEST['field-invoice-number-inputEl'];
            
            $request['invoiceimage_invoice_date'] = $_REQUEST['field-invoice-date-inputEl'];
            $request['invoiceimage_invoice_duedate'] = $_REQUEST['field-due-date-inputEl'];

            $request['image_index_amount'] = $_REQUEST['field-amount-inputEl'];

            //$request['remit_advice'] = $_REQUEST['field-remittance-advice-inputEl'];

            //$request['NeededBy_datetm'] = $_REQUEST['field-needed-by-inputEl'];

            $request['PriorityFlag_ID_Alt_invoice'] = $_REQUEST['field-priority-invoice-inputEl'];
            $request['PriorityFlag_ID_Alt_po'] = $request['PriorityFlag_ID_Alt_invoice']; // This field should be used depending on which doctype is used.
            $request['PriorityFlag_ID_Alt_vef'] = $request['PriorityFlag_ID_Alt_invoice']; // This field should be used depending on which doctype is used.

            $request['exception_reason'] = $_REQUEST['field-exception-reason-inputEl'];

            $request['utilityaccount_accountnumber'] = $_REQUEST['field-account-number-inputEl'];
            $request['utilityaccount_metersize'] = $_REQUEST['field-meter-number-inputEl'];

            $request['cycle_to'] = $_REQUEST['field-cycle-to-date-inputEl'];
            $request['cycle_from'] = $_REQUEST['field-cycle-from-date-inputEl'];

            $request['po_ref'] = $_REQUEST['field-p0-number-inputEl'];

            $request['job_number'] = null;//Look like this field is unused now.

            //$request['utility_property_id'] = $_REQUEST['utility_property_id'];
            //$request['utility_vendorsite_id'] = $_REQUEST['utility_vendorsite_id'];
            //$request['utilityaccount_id'] = $_REQUEST['utilityaccount_id'];
* /
            / *$request['universal_field1'] = $_REQUEST['universal_field1'];
            $request['universal_field2'] = $_REQUEST['universal_field2'];
            $request['universal_field3'] = $_REQUEST['universal_field3'];
            $request['universal_field4'] = $_REQUEST['universal_field4'];
            $request['universal_field5'] = $_REQUEST['universal_field5'];
            $request['universal_field6'] = $_REQUEST['universal_field6'];
            $request['universal_field7'] = $_REQUEST['universal_field7'];
            $request['universal_field8'] = $_REQUEST['universal_field8'];* /
            return $request;
        }
        
        
        public function indexImages($data) {
            $params = [];
            $params['doctypes'] = $this->imageDoctypeGateway->getIdByNames(['receipt', 'Utility Invoice']);
            $params['tablerefs'] = $this->imageTablerefGateway->getIdByNames(['receipt', 'Utility Invoice']);

            $params['userprofile_id'] = $this->securityService->getUserId();
            //$params['section']//image_index_status = <cfif request.top_tab_type EQ "Exceptions">2<cfelseif request.top_tab_type EQ "Scanned">1</cfif>, вместо Scanned будет index

            $_REQUEST = (array) $_REQUEST[0]->data->imageindex;
            
            $request = $this->indexPrepareRequest();
            //print_r($params);
            //print_r($request);

            $this->imageIndexGateway->updateImage($request, $params);
        }







*/



/*
@in_invoiceimage_id varchar(8000),
@in_invoiceimage_status int,
@in_userprofile_id int = NULL,
@in_delegation_to_userprofile_id int = NULL
BEGIN
			
			SELECT @audittype_id = audittype_id
			FROM AUDITTYPE
			WHERE audittype = (
				SELECT REPLACE(image_tableref_name, ' ', '')
				FROM IMAGE_TABLEREF
				WHERE image_tableref_id = @tableref_id
			);
			
			SELECT @auditactivity_id = auditactivity_id
			FROM AUDITACTIVITY
			WHERE auditactivity = 'ImgDel';
			
			INSERT INTO auditlog (
				userprofile_id,
				delegation_to_userprofile_id,
				tablekey_id,
				auditactivity_id,
				audittype_id,
				field_old_value,
				DTS
			) VALUES (
				@in_userprofile_id,
				@in_delegation_to_userprofile_id,
				@invoice_id,
				@auditactivity_id,
				@audittype_id,
				@image_index_name,
				getDate()
			);
		END
*/
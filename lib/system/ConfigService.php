<?php

namespace NP\system;

use NP\core\AbstractService;
use NP\core\Exception;
use NP\core\Config;
use NP\security\SecurityService;
use NP\util\Util;

/**
 * Service class for operations related to app configuration
 *
 * @author Thomas Messier
 */
class ConfigService extends AbstractService {
	
	protected $config, $securityService, $siteService, $appName, $intPkgGateway, $configsysGateway, $configSysValGateway, $pnUniversalFieldGateway;
	
	public function __construct(Config $config, SecurityService $securityService, SiteService $siteService, IntegrationPackageGateway $intPkgGateway, ConfigsysGateway $configsysGateway, ConfigSysValGateway $configSysValGateway, PnUniversalFieldGateway $pnUniversalFieldGateway) {
		$this->config           = $config;
		$this->securityService  = $securityService;
		$this->siteService      = $siteService;
		$this->intPkgGateway    = $intPkgGateway;
		$this->configsysGateway = $configsysGateway;
		$this->configSysValGateway = $configSysValGateway;
		$this->pnUniversalFieldGateway = $pnUniversalFieldGateway;

		$this->appName          = $siteService->getAppName();
		
		// Defaulting locale to "en" for now until we implement this, will then probably come from session
		$this->setLocale('en');
	}
	
	/**
	 * Returns all items in the cache
	 *
	 * @return array
	 */
	public function getAll() {
		return $this->config->getAll();
	}
	
	/**
	 * Get a specific item from the cache
	 *
	 * @param  string $key        The key for the item you want to retrieve
	 * @param  mixed  $defaultVal Default value to use if $key is not found in the cache (optional); defaults to null
	 * @return mixed
	 */
	public function get($key, $defaultVal=null) {
		return $this->config->get($key, $defaultVal);
	}
	
	/**
	 * Checks if a specific item is in the cache
	 *
	 * @param  string $key        The key for the item you want to check
	 * @return boolean
	 */
	public function isCached($key) {
		return $this->config->isCached($key);
	}
	
	/**
	 * Get custom field data for an entity
	 *
	 * @param  string $customfield_pn_type      The entity type
	 * @param  int    $customfielddata_table_id The id of the entity
	 * @return array                            An associative array with the custom field data
	 */
	public function getCustomFieldData($customfield_pn_type, $customfielddata_table_id) {

		return $this->pnCustomFieldsGateway->findCustomFieldData($customfield_pn_type, $customfielddata_table_id);
	}

	/**
	 * Get all invoice/PO custom field config data
	 *
	 * @return array An associative array with all the relevant configuration values for invoice/po header and line custom fields
	 */
	public function getInvoicePoCustomFields() {
		$arCustomSettings = $this->configsysGateway->getCustomFieldSettings();
		
		$arIntReqs = $this->integrationRequirementsGateway->find();
		
		$arFields = array(
			"header" => array("fields"=>array()),
			"line" => array("fields"=>array()),
		);
		
		$arTemp = array();
		foreach($arCustomSettings as $rec) {
			$arTemp[$rec["configsys_name"]] = $rec["configsysval_val"];
		}
		
		$arMaxlength = array(
			"header" => array(),
			"line" => array()	
		);
		
		foreach($arIntReqs as $rec) {
			$arMaxlength["header"][7][$rec["integration_package_id"]] = $rec["custom_field7_maxlength"];
			$arMaxlength["header"][8][$rec["integration_package_id"]] = $rec["custom_field8_maxlength"];
			$arMaxlength["line"][7][$rec["integration_package_id"]] = $rec["custom_field7_lineitem_maxlength"];
			$arMaxlength["line"][8][$rec["integration_package_id"]] = $rec["custom_field8_lineitem_maxlength"];
		}
		
		$invOnCount = 0;
		$poOnCount = 0;
		$poLineOnCount = 0;
		$invLineOnCount = 0;
		
		for ($i=1; $i<=8; $i++) {
			// Loop through this twice just to avoid code repetition for header and line item fields
			for ($j=1; $j<=2; $j++) {
				if ($i <= 6) {
					$fieldType = 'select';
				} else {
					$fieldType = 'text';
				}
				
				if ($j == 1) {
					if (array_key_exists("CP.CUSTOM_FIELD".$i."_TYPE", $arTemp)) {
						$fieldType = $arTemp["CP.CUSTOM_FIELD".$i."_TYPE"];
					}
					$suffix = '';
					$key = 'header';
					$invOnCount += $arTemp["CP.INVOICE_CUSTOM_FIELD".$i."_ON_OFF"];
					$poOnCount += $arTemp["CP.PO_CUSTOM_FIELD".$i."_ON_OFF"];
				} else {
					$suffix = '_LINEITEM';
					$key = 'line';
					$poLineOnCount += $arTemp["CP.INVOICE_CUSTOM_FIELD".$i."_LINEITEM_ON_OFF"];
					$invLineOnCount += $arTemp["CP.PO_CUSTOM_FIELD".$i."_LINEITEM_ON_OFF"];
				}
				$arFields[$key]["fields"][$i] = array(
					"fieldNumber" => $i,
					"type"        => $fieldType,
					"label"       => $arTemp["CP.CUSTOM_FIELD_LABEL".$i.$suffix],
					"invOn"       => ($arTemp["CP.INVOICE_CUSTOM_FIELD".$i.$suffix."_ON_OFF"] == '1') ? true : false,
					"invRequired" => ($arTemp["CP.INVOICE_CUSTOM_FIELD".$i.$suffix."_REQ"] == '1') ? true : false,
					"poOn"        => ($arTemp["CP.PO_CUSTOM_FIELD".$i.$suffix."_ON_OFF"] == '1') ? true : false,
					"poRequired"  => ($arTemp["CP.PO_CUSTOM_FIELD".$i.$suffix."_REQ"] == '1') ? true : false
				);
				if (array_key_exists($i, $arMaxlength[$key])) {
					$arFields[$key]["fields"][$i]["maxlength"] = $arMaxlength[$key][$i];
				}
			}
		}
		$arFields["header"]["invOnCount"] = $invOnCount;
		$arFields["header"]["poOnCount"] = $poOnCount;
		$arFields["line"]["poLineOnCount"] = $poLineOnCount;
		$arFields["line"]["invLineOnCount"] = $invLineOnCount;
		
		return $arFields;
	}
	
	/**
	 * Gets values for a custom field drop down 
	 *
	 * @param  string  $customfield_pn_type    The entity type for which we want to get custom field options
	 * @param  int     $universal_field_number The custom field number
	 * @param  boolean [$activeOnly=true]      Whether or not to retrieve only active items
	 * @param  int     [$isLineItem=1]         Whether or not it's a line or header custom field (0=header; 1=line); defaults to 1
	 * @param  int     [$glaccount_id]         Associated GL account ID (optional); defaults to null
	 * @return array
	 */
	public function getCustomFieldOptions($customfield_pn_type, $universal_field_number, $activeOnly=true, 
										  $isLineItem=1, $glaccount_id=null, $keyword=null) {
		return $this->pnUniversalFieldGateway->findCustomFieldOptions(
			$customfield_pn_type,
			$universal_field_number,
			$activeOnly,
			$isLineItem,
			$glaccount_id,
			$keyword
		);
	}

	/**
	 * Gets lookup codes for a specified type
	 *
	 * @param  string $lookupcode_type The type of lookup code to retrieve
	 * @return array
	 */
	public function getLookupCodes($lookupcode_type) {
		return $this->lookupcodeGateway->find(
			array('lookupcode_type'=>"'{$lookupcode_type}'"), 
			array(), 
			'lookupcode_description ASC',
			array('lookupcode_id','lookupcode_description', 'lookupcode_code')
		);
	}

	/**
	 * Sets the current locale for the app
	 *
	 * @param string $locale
	 */
	public function setLocale($locale) {
		// Setup a Zend translator
		$translator = new \Zend\I18n\Translator\Translator();

		// Setup translation for Zend Validator module
		$language = $locale;
		// If no folder matches the locale name, just use the first part of the name (assuming it's in en_US format)
		if (stream_resolve_include_path("resources/languages/{$locale}/Zend_Validate.php") === false) {
			$language = array_shift(explode('_', $locale));
		}
		
		$resourcePath = stream_resolve_include_path("resources/languages/{$language}/Zend_Validate.php");
		if ($resourcePath === false) {
			throw new \NP\core\Exception("The locale \"{$locale}\" is invalid.");
		}

		// Add the default translation file from the Zend library
		$translator->addTranslationFile(
		    'phpArray',
		    $resourcePath,
		    'default',
		    $locale
		);
		// Set the locale on the translator
		$translator->setLocale($locale);

		// Make this the default translator for all validations
		\Zend\Validator\AbstractValidator::setDefaultTranslator($translator);
	}

	/**
	 * Returns a value from the $config array
	 *
	 * @param  string $key The name of the config option to retrieve
	 * @return mixed       The value of the config option
	 */
	public function getConfig($key) {
		return $this->config->getConfig($key);
	}

	/**
	 * Shortcut for getConfig('appRoot')
	 */
	public function getAppRoot() {
		return $this->getConfig('appRoot');
	}

	/**
	 * Gets the name of the client
	 *
	 * @return string The name of the client's app
	 */
	public function getAppName() {
		return $this->appName;
	}

	/**
	 * Returns path to the root client folder
	 */
	public function getClientFolder() {
		return $this->getAppRoot() . '/clients/' . $this->getAppName();
	}

	/**
	 * Get the client ID for the site currently being accessed
	 *
	 * @return int The id of the client
	 */
	public function getClientId() {
		return $this->siteService->getClientId();
	}
	
	/**
	 * Get the login URL for the site currently being accessed
	 *
	 * @return int The id of the client
	 */
	public function getLoginUrl() {
		return $this->siteService->getLoginUrl();
	}

	/**
	 * Returns the Timezone abbreviation for the server
	 *
	 * @return string
	 */
	public function getTimezoneAbr() {
		$date = new \DateTime();
		return $date->format('T');
	}

	/**
	 * Retrieves all integration packages for the app
	 *
	 * @return array Array of integration package records
	 */
	public function getIntegrationPackages() {
		return $this->integrationPackageGateway->find(null, null, 'integration_package_name');
	}
	
	
	/**
	 * Retrieves password configuration fields
	 *
	 * @return array Array of password configuration fields
	 */
	public function getPasswordConfiguration () {
		$arPassCfg = $this->configsysGateway->getPasswordConfiguration();
		
		$arTemp = array();
		foreach($arPassCfg as $rec) {
			$arTemp[strtolower($rec["configsys_name"])] = $rec["configsysval_val"];
		}
		return $arTemp;
	}

	/**
	 * Saves password configuration fields
	 *
	 * @param  array $data An associative array with the data needed to save password configuration
	 * @return array       An array with success status of the operation and any errors that happened
	 */
	public function setPasswordConfiguration ($data) {
		$errors = $this->configsysGateway->savePasswordConfiguration($data);
		
		$this->config->loadConfigCache();
		
		// return the status of the save along with the errors if any
		return array(
			'success'    => (count($errors)) ? false : true,
			'errors'     => $errors
		);
	}

	/**
	 * Retrieve settings list
	 *
	 * @param null $settingList
	 * @param null $defaultlist
	 * @return array
	 */
	public function getCPSettings($settingList = null, $defaultlist = null) {
		if (!$settingList) {
			return [];
		}

		return $this->configsysGateway->getCPSettings($settingList , $defaultlist);
	}
	
	/**
	 * Retrieve integrationpackage info
	 *
	 * @param int|null $asp_client_id
	 * @param int|null $userprofile_id
	 * @return array|mixed
	 */
	public function findByAspClientIdAndUserprofileId($userprofile_id = null) {
		if (!$userprofile_id) {
			return [];
		}
		return $this->intPkgGateway->findByAspClientIdAndUserprofileId($this->getClientId(), $userprofile_id);
	}

	/**
	 * Retrieve sys value by name
	 *
	 * @param $name
	 * @return mixed
	 */
	public function findSysValueByName($name) {
		return $this->configsysGateway->findConfigSysValByName($name);
	}

	/**
	 * Save audit log
	 *
	 * @param $userprofile_id
	 * @param $tablekey_id
	 * @param $audittype_id
	 * @param $field_name
	 * @param $field_new_value
	 * @param $control_value
	 */
	public function saveAuditLog($userprofile_id, $tablekey_id, $audittype_id, $field_name, $field_new_value, $control_value = null) {

		$this->configsysGateway->saveAuditLog($userprofile_id, $tablekey_id, $audittype_id, $field_name, $field_new_value, $control_value);
	}

	/**
	 * Gets the file name of the custom logo set for this client
	 *
	 * @return string
	 */
	public function getCustomLogoName() {
		$client = $this->clientGateway->find(null, null, null, ['logo_file']);

		return $client[0]['logo_file'];
	}

	/**
	 * 
	 */
	public function getCustomLogoPath() {
		return "{$this->getAppRoot()}/clients/{$this->getAppName()}/web/images/logos";
	}

	/**
	 * Saves a client logo
	 *
	 * @return array     Array with status info on the operation
	 */
	public function saveClientLogo() {
		$fileName = null;

		$this->clientGateway->beginTransaction();

		try {
			$this->removeClientLogo();

			$destPath = $this->getCustomLogoPath();
			
			// If destination directory doesn't exist, create it
			if (!is_dir($destPath)) {
				mkdir($destPath, 0777, true);
			}

			// Create the upload object
			$fileUpload = new \NP\core\io\FileUpload(
				'logo_file', 
				$destPath, 
				[
					'allowedTypes' => [
						'image/gif',
						'image/jpeg',
						'image/png',
						'image/pjpeg'
					],
					'overwrite'    => false
				]
			);

			// Do the file upload
			$fileUpload->upload();
			$errors = $fileUpload->getErrors();

			// If there are no errors, run the resize operations and DB updates
			if (!count($errors)) {
				// Resize the image if necessary
				$fileName = $fileUpload->getFile();
				$fileName = $fileName['uploaded_name'];
				\NP\util\Util::resizeImage("{$destPath}/{$fileName}", 500, 170);

				$this->clientGateway->update(['logo_file'=>$fileName]);
			}
		} catch(\Exception $e) {
			$errors[] = $this->handleUnexpectedError($e);
		}

		if (count($errors)) {
			foreach ($errors as $i=>$error) {
				$errors[$i] = $this->localizationService->getMessage($error);
			}
			$this->clientGateway->rollback();
		} else {
			$this->clientGateway->commit();
		}

		return array(
			'success'   => (count($errors)) ? false : true,
			'logo_file' => $fileName,
			'errors'    => $errors
		);
	}

	/**
	 * Removes a catalog logo
	 *
	 */
	public function removeClientLogo() {
		$fileName = $this->getCustomLogoName();
		$filePath = "{$this->getCustomLogoPath()}/{$this->getCustomLogoName()}";

		if (!empty($fileName) && file_exists($filePath)) {
			unlink($filePath);
		}

		$this->clientGateway->update(['logo_file'=>null]);
	}

    public function showClientLogo() {
    	$filename = $this->getCustomLogoName();
    	$file = "{$this->getCustomLogoPath()}/{$filename}";
    	try {
            if ($file === null || !file_exists($file)) {
                die('Invalid file');
            } else {
                $ext = explode('.', $filename);
                $ext = strtolower(array_pop($ext));

                header("Content-type: image/{$ext}");

                die(file_get_contents($file));
            }
        } catch (Exception $e) {
            die('Invalid file');
        }
    }

	/**
	 * Retrieve sysvals list
	 *
	 * @param null $configsysclient_name
	 * @param null $configsysval_load
	 * @param null $configsyscat_name
	 * @param null $configsysval_show
	 * @return array|bool
	 */
	public function getConfigSysValByCat($configsysclient_name = null, $configsysval_load = null, $configsyscat_name = null, $configsysval_show = null) {
		return $this->configsysGateway->getConfigSysValByCat($configsysclient_name, $configsysval_load, $configsyscat_name, $configsysval_show);
	}

	/**
	 * List of vals for the combobox
	 *
	 * @param null $configsyslkp_id
	 * @return array|bool
	 */
	public function getConfigSysLkpVal($configsyslkp_id = null) {
		return $this->configsysGateway->getConfigSysLkpVal($configsyslkp_id);
	}

	/**
	 * List of val for table field
	 *
	 * @param null $tablename
	 * @param null $configsys_tbl_name_fld
	 * @param null $configsys_tbl_val_fld
	 * @return array|bool
	 */
	public function getConfigSysValTable($tablename = null, $configsys_tbl_name_fld = null, $configsys_tbl_val_fld = null) {
		if (!$tablename || !$configsys_tbl_val_fld || !$configsys_tbl_name_fld) {
			return [];
		}

		return $this->configsysGateway->getConfigSysValTable($tablename, $configsys_tbl_name_fld, $configsys_tbl_val_fld);
	}

	/**
	 * save settings
	 *
	 * @param $data
	 * @return array
	 */
	public function saveSettings($data) {

		foreach ($data as $key => $value) {
			if (strstr($key, 'setting_')) {
				$setting = explode('_', $key);

				try {
					$this->configSysValGateway->update(
						['configsysval_updated_by' => $data['userprofile_id'], 'configsysval_val' => $value, 'configsysval_updated_datetm' => Util::formatDateForDB()],
						['configsysval_id' => '?'],
						[$setting[1]]
					);
				} catch(\Exception $e) {
					return [
						'success'	=> false,
						'errors'	=> ['field' => 'global', 'msg' => $e->getMessage(), 'extra' => null]
					];
				}
			}

			$this->config->loadConfigCache();
			return [
				'success'	=> true,
				'errors'	=> []
			];
		}

	}

	/**
	 * Retrieve headers list
	 *
	 * @param int $limit
	 * @param int $page
	 * @param string $sort
	 * @return array|bool
	 */
	public function getHeaders($limit = 25, $page = 1, $sort = 'configsys_name') {
		return $this->configsysGateway->getHeaderVals($limit, $page, $sort);
	}

	/**
	 * Retrieve line items list
	 *
	 * @param int $limit
	 * @param int $page
	 * @param string $sort
	 * @return array|bool
	 */
	public function getLineItems($limit = 25, $page = 1, $sort = 'configsys_name') {
		return $this->configsysGateway->getLineItems($limit, $page, $sort);
	}

	/**
	 * Return custom fields list
	 *
	 * @param int $limit
	 * @param int $page
	 * @param string $sort
	 * @param string $fieldname
	 * @return array|bool
	 */
	public function getCustomFields($limit = 25, $page = 1, $sort = 'controlpanelitem_name', $fieldname = 'serviceField') {
		return $this->configsysGateway->getCustomFields($limit, $page, $sort, $fieldname);
	}

	/**
	 * Get header values
	 *
	 * @param null $asp_client_id
	 * @param null $fid
	 * @return array
	 */
	public function getHeaderValues($fid = null) {
		$data = [];
		$asp_client_id = $this->getClientId();

		if (!$fid) {
			return false;
		}

		$data['inv_custom_field_on_off'] = $this->configsysGateway->getControlPanelItem($asp_client_id, 'INVOICE_CUSTOM_FIELD' . $fid . '_ON_OFF', "");
		$data['po_custom_field_on_off'] = $this->configsysGateway->getControlPanelItem($asp_client_id, 'PO_CUSTOM_FIELD' . $fid . '_ON_OFF', "");
		$data['vef_custom_field_on_off'] = $this->configsysGateway->getControlPanelItem($asp_client_id, 'VEF_CUSTOM_FIELD' . $fid . '_ON_OFF', "");
		$data['inv_custom_field_req'] = $this->configsysGateway->getControlPanelItem($asp_client_id, 'INVOICE_CUSTOM_FIELD' . $fid . '_REQ', "");
		$data['po_custom_field_req'] = $this->configsysGateway->getControlPanelItem($asp_client_id, 'PO_CUSTOM_FIELD' . $fid . '_REQ', "");
		$data['vef_custom_field_req'] = $this->configsysGateway->getControlPanelItem($asp_client_id, 'VEF_CUSTOM_FIELD' . $fid . '_REQ', "");
		$data['custom_field_lbl'] = $this->configsysGateway->getControlPanelItem($asp_client_id, 'CUSTOM_FIELD_LABEL' . $fid, "");
		$data['inv_custom_field_imgindex'] = $this->configsysGateway->getControlPanelItem($asp_client_id, 'invoice_custom_field' . $fid . '_imgindex', "");
		$data['customFieldType'] = $this->configsysGateway->getControlPanelItem($asp_client_id, 'custom_field' . $fid . '_type', 'select');
		$data['maxlength'] = in_array($fid, [7,8]) ? $this->configsysGateway->getFieldLength($fid) : 0;

		return $data;
	}

	public function getCustomFieldsData($fid) {
		if(!$fid || in_array($fid, [7, 8])) {
			return [];
		}

		return $this->configsysGateway->getCustomFieldData($fid);
	}

	public function saveOrder(){

	}

	/**
	 * Delete universal field
	 *
	 * @param $universal_field_id
	 */
	public function deleteUniversalField($universal_field_id) {
		return $this->configsysGateway->deleteUniversalField($universal_field_id);
	}

	public function saveUniversalFields($data = null) {
		if (!$data) {
			return false;
		}
		if ($data['action'] == 'new') {
			return $this->pnUniversalFieldGateway->insert([
				'universal_field_data'		=> $data['universal_field_data'],
				'universal_field_number'	=> $data['universal_field_number'],
				'universal_field_status'	=> $data['universal_field_status'],
				'universal_field_order'		=> 0,
				'customfield_pn_type'		=> 'customInvoicePO'
			]);
		} else {
			return $this->pnUniversalFieldGateway->updateUniversalField($data);
		}
	}

	public function saveOrderForCustomFields($data = []) {
		if (count($data) == 0) {
			return true;
		}

		foreach ($data as $item) {
			$this->pnUniversalFieldGateway->update(['universal_field_order' => $item['universal_field_order']], ['universal_field_id' => '?'], [$item['universal_field_id']]);
		}

		return true;
	}

	public function updateCustomField($data) {
		foreach ($data as $key => $value) {
			if ($key !== 'islineitem' && $key !== 'custom_field_maxlength' && $key !== 'customFieldType' && $key !== 'custom_fieldnumber') {
				$this->updateField($key, $value, $data['custom_fieldnumber'], $data['islineitem']);
			}
		}

		if ($data['custom_fieldnumber'] == 7 || $data['custom_fieldnumber'] == 8) {
			$this->configSysValGateway->updateUniversalFieldLength($data['custom_field_maxlength'], $data['custom_fieldnumber']);
		}

		$this->configSysValGateway->updateUniversalFieldType($data['customFieldType'], $data['custom_fieldnumber']);

		return true;
	}

	protected function updateField($key, $value, $fid, $lineitem) {
		switch($key) {
			case 'field_imgindex':
				if (!$lineitem) {
					$this->configSysValGateway->updateCustomField($value, 'CP.invoice_custom_field' .$fid . '_imgindex');
				}
				break;
			case 'field_inv_on_off':
				if (!$lineitem) {
					$this->configSysValGateway->updateCustomField($value, 'CP.INVOICE_CUSTOM_FIELD' . $fid . '_ON_OFF');
				} else {
					$this->configSysValGateway->updateCustomField($value, 'CP.INVOICE_CUSTOM_FIELD' . $fid . '_LINEITEM_ON_OFF');
				}
				break;
			case 'field_inv_req':
				if (!$lineitem) {
					$this->configSysValGateway->updateCustomField($value, 'CP.invoice_custom_field' . $fid . '_REQ');
				} else {
					$this->configSysValGateway->updateCustomField($value, 'CP.INVOICE_CUSTOM_FIELD' . $fid . '_LINEITEM_REQ');
				}
				break;
			case 'field_po_on_off':
				if (!$lineitem) {
					$this->configSysValGateway->updateCustomField($value, 'CP.PO_CUSTOM_FIELD' . $fid . '_ON_OFF');
				} else {
					$this->configSysValGateway->updateCustomField($value, 'CP.PO_CUSTOM_FIELD' . $fid . '_LINEITEM_ON_OFF');
				}
				break;
			case 'field_po_req':
				if (!$lineitem) {
					$this->configSysValGateway->updateCustomField($value, 'CP.PO_CUSTOM_FIELD' . $fid . '_REQ');
				} else {
					$this->configSysValGateway->updateCustomField($value, 'CP.PO_CUSTOM_FIELD' . $fid . '_LINEITEM_REQ');
				}
				break;
			case 'field_vef_on_off':
				if (!$lineitem) {
					$this->configSysValGateway->updateCustomField($value, 'CP.VEF_CUSTOM_FIELD' . $fid . '_ON_OFF');
				} else {
					$this->configSysValGateway->updateCustomField($value, 'CP.VEF_CUSTOM_FIELD' .$fid . '_LINEITEM_ON_OFF');
				}
				break;
			case 'field_vef_req':
				if (!$lineitem) {
					$this->configSysValGateway->updateCustomField($value, 'CP.VEF_CUSTOM_FIELD' . $fid . '_REQ');
				} else {
					$this->configSysValGateway->updateCustomField($value, 'CP.VEF_CUSTOM_FIELD' . $fid . '_LINEITEM_REQ');
				}
				break;
			case 'field_lbl':
				if (!$lineitem) {
					$this->configSysValGateway->updateCustomField($value, 'CP.CUSTOM_FIELD_LABEL' . $fid);
				} else {
					$this->configSysValGateway->updateCustomField($value, 'CP.CUSTOM_FIELD_LABEL' . $fid . '_LINEITEM');
				}
				break;
		}
	}
}

?>
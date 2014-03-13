<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Delete;
use NP\core\db\Expression;
use NP\core\db\Insert;
use NP\core\db\Update;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\system\sql\InvoiceOnOffSelect;
use NP\util\Util;

/**
 * Gateway for the CONFIGSYS table
 *
 * @author Thomas Messier
 */
class ConfigsysGateway extends AbstractGateway {
	
	/**
	 * Modify the default Select object used to run queries on CONFIGSYS to include the CONFIGSYSVAL data as well
	 *
	 * @param \NP\core\db\Select
	 */
	public function getSelect() {
		$select = new Select();
		$select->from('configsys')
				->join(array('cv'=>'configsysval'), 'configsys.configsys_id = cv.configsys_id');
		
		return $select;
	}
	
	/**
	 * Returns all records from CONFIGSYS table relevant to custom field configurations
	 *
	 * @return array
	 */
	public function getCustomFieldSettings() {
		$select = new Select();
		$where = new Where(null, 'or');
		$where->like('c.configsys_name', "'%_CUSTOM_FIELD%_ON_OFF'")
			  ->like('c.configsys_name', "'CP.CUSTOM_FIELD%_TYPE'")
			  ->like('c.configsys_name', "'%_CUSTOM_FIELD%_REQ'")
			  ->like('c.configsys_name', "'%CUSTOM_FIELD_LABEL%'");

		$select->from(array('c'=>'configsys'))
				->columns(array('configsys_id','configsys_name'))
				->join(array('cv'=>'configsysval'), 
						'c.configsys_id = cv.configsys_id',
						array('configsysval_id','configsysval_val'))
				->where($where);
		
		return $this->adapter->query($select);
	}
	
	/**
	 * Returns records from CONFIGSYS table relevant to password configuration
	 *
	 * @return array
	 */
	public function getPasswordConfiguration() {
		$select = new Select();
		$where = new Where(null, 'or');
		$where->like('c.configsys_name', "'CP.PASSWORD_MIN_LENGTH'")
		->like('c.configsys_name', "'CP.PASSWORD_EXPIRE_INTERVAL'")
		->like('c.configsys_name', "'CP.PASSWORD_HISTORY_INTERVAL'")
		->like('c.configsys_name', "'CP.PASSWORD_CHANGE_ON_LOGIN'");
	
		$select->from(array('c'=>'configsys'))
		->columns(array('configsys_id','configsys_name'))
		->join(array('cv'=>'configsysval'),
				'c.configsys_id = cv.configsys_id',
				array('configsysval_id','configsysval_val'))
				->where($where);
	
		return $this->adapter->query($select);
	}
	
	/**
	 * Saves new Password Configuration to Database
	 *
	 * @param  array $data An associative array with the data needed to save password configuration
	 * @return array $errors Array containing DB errors if occured
	 */
	public function savePasswordConfiguration($data) {
		
		$errors = array();
		
		foreach ($data as $key => $val){
			
			/*
			 * TODO
			 * Modify NP\core\db\Update class to work with joined tables
			 */
			$updateSQL = "UPDATE cv SET
				cv.configsysval_val = ?
				FROM configsysval cv
					INNER JOIN configsys c ON c.configsys_id = cv.configsys_id
				WHERE c.configsys_name = ?";
			
			try {
				$this->adapter->query($updateSQL, array($val, $key));
			} catch (\Exception $e) {
				$errors[] = array(
						"field" => $key,
						"msg"	=> $e->getMessage());
			}
		}
	
		return $errors;
	}

	/**
	 * Retrieve settings list
	 *
	 * @param $settingList
	 * @param null $defaultlist
	 * @return array|bool
	 */
	public function getCPSettings($settingList, $defaultlist = null) {
		$select = new Select();

		$select->from(['c' => 'configsys'])
				->columns(['controlpanelitem_name' => new Expression("REPLACE(c.configsys_name, 'CP.', '')")])
				->join(['cv' => 'configsysval'], 'c.configsys_id = cv.configsys_id', ['controlpanelitem_value' => 'configsysval_val'])
				->whereIn('c.configsys_name', "'" . str_replace(',', "','", $settingList) . "'");

		$result = $this->adapter->query($select);

		$settingList = explode(',', $settingList);
		$settingList = array_flip($settingList);

		$items = [];
		foreach ($result as $item) {
			$items[$item['controlpanelitem_name']] = $item['controlpanelitem_value'];
		}

		foreach ($settingList as $key => $value) {
			$settingList[str_replace('CP.', '', $key)] = $value;
			unset($settingList[$key]);
		}

		$index = 0;
		foreach ($settingList as $key => &$value) {
			if (!array_key_exists($key, $items)) {
				if ($defaultlist) {
					$value = $defaultlist[$index];
				} {
					$value = '';
				}
			} else {
				$value = $items[$key];
			}
		}

		return $settingList;
	}

	/*
	 * Retrieve sys value by name
	 *
	 * @param $name
	 * @return mixed
	 */
	public function findConfigSysValByName($name, $default_value = null) {
		$select  = new Select();

		$select->from(['c' => 'configsys'])
					->join(['cv' => 'configsysval'], 'c.configsys_id = cv.configsys_id', ['configsysval_val'])
					->where(['c.configsys_name' => '?']);

		$result = $this->adapter->query($select, [$name]);

		return isset($result[0]['configsysval_val']) ? $result[0]['configsysval_val'] : $default_value;
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
		if ($control_value) {
			$select = new Select();

			$select->from(['c' => 'configsys'])
					->join(['cv' => 'configsysval'], 'c.configsys_id = cv.configsys_id', ['configsysval_val'])
					->where(['c.configsys_name' => '?']);

			$result = $this->adapter->query($select, ['C' . $control_value]);
		}
		if ($control_value && $result[0]['configsysval_val'] == 1) {
			$insert = new Insert();

			$insert->into('auditlog')
				->columns(['userprofile_id', 'tablekey_id', 'auditactivity_id', 'audittype_id', 'field_name', 'field_new_value'])
				->values(Select::get()->columns([
					new Expression('?'),
					new Expression('?'),
					'auditactivity_id',
					new Expression('?'),
					new Expression('?'),
					new Expression('?')
					])
					->from('auditactivity')
					->where(['auditactivity' => '?']));

			$this->adapter->query($insert, [$userprofile_id, $tablekey_id, $audittype_id, $field_name, $field_new_value]);
		}
	}

	/**
	 * Retrieve sysvals list
	 *
	 * @param $configsysclient_name
	 * @param $configsysval_load
	 * @param $configsyscat_name
	 * @param $configsysval_show
	 * @return array|bool
	 */
	public function getConfigSysValByCat($configsysclient_name, $configsysval_load, $configsyscat_name, $configsysval_show) {
		$select = new Select();

		$select->from(['cv' => 'configsysval'])
			->columns(['configsysval_id', 'configsysval_val', 'configsysval_active'])
			->join(['c' => 'configsys'], 'cv.configsys_id = c.configsys_id', ['configsys_id', 'configsyslkp_id', 'configsys_range', 'configsys_tbl', 'configsys_tbl_order_fld', 'configsys_tbl_name_fld', 'configsys_tbl_val_fld', 'configsys_name', 'configsys_displayname', 'configsys_shortname', 'configsys_required', 'configsys_maxlength'], Select::JOIN_INNER)
			->join(['cl' => 'configsysclient'], 'cv.configsysclient_id = cl.configsysclient_id', [], Select::JOIN_INNER)
			->join(['ct' => 'configsystype'], 'c.configsystype_id = ct.configsystype_id', ['configsystype_name'], Select::JOIN_LEFT)
			->join(['cc' => 'configsyscat'], 'c.configsyscat_id = cc.configsyscat_id', [], Select::JOIN_LEFT)
			->join(['c2' => 'configsys'], 'c.configsys_parent_yesno_id = c2.configsys_id', [], Select::JOIN_LEFT)
			->join(['cv2' => 'configsysval'], ' c2.configsys_id = cv2.configsys_id', ['parent_configsysval_id' => 'configsysval_id'], Select::JOIN_LEFT)
			->whereNest('OR')
			->whereEquals('cc.configsyscat_name', '?')
			->whereIsNull('?')
			->whereUnNest()
			->whereNest('OR')
			->whereEquals('cv.configsysval_load', '?')
			->whereIsNull('?')
			->whereUnNest()
			->whereNest('OR')
			->whereEquals('cv.configsysval_show', '?')
			->whereIsNull('?')
			->whereUnNest()
			->whereEquals('cl.configsysclient_name', '?');

		return $this->adapter->query($select, [$configsyscat_name, $configsyscat_name, $configsysval_load, $configsysval_load, $configsysval_show, $configsysval_show, $configsysclient_name]);
	}

	/**
	 * return values for the list
	 *
	 * @param $configsyslkp_id
	 * @return array|bool
	 */
	public function getConfigSysLkpVal($configsyslkp_id) {
		$select = new Select();

		$select->from(['c' => 'configsyslkpval'])
			->where(['configsyslkp_id' => '?'])
			->order('configsyslkpval_order');

		return $this->adapter->query($select, [$configsyslkp_id]);
	}

	public function getConfigSysValTable($tablename, $configsys_tbl_name_fld, $configsys_tbl_val_fld) {
		$select = new Select();

		$select->from(['t' => $tablename])
			->columns([
				'configsyslkpval_name'	=> $configsys_tbl_name_fld,
				'configsyslkpval_val'	=> $configsys_tbl_val_fld
			])
			->order('configsys_tbl_order_fld');

		return $this->adapter->query($select);
	}

	public function getHeaderVals($pageSize, $page, $order) {
		$select = new Select();

		$select->from(['c2' => 'configsys'])
			->columns([
				'controlpanelitem_name'		=> 'configsys_name',
				'controlpanelitem_required'	=> 'configsys_required',
				'inv_on_off' => new sql\CustomFieldSelect(8),
				'inv_req' => new sql\CustomFieldSelect(5),
				'po_on_off' => new sql\CustomFieldSelect(8),
				'po_req' => new sql\CustomFieldSelect(5),
				'vef_on_off' => new sql\CustomFieldSelect(8),
				'vef_req' => new sql\CustomFieldSelect(5),
				'imgidx_on_off' => new sql\CustomFieldSelect(10),
				'type' => new sql\CustomFieldSelect(6),
			])
			->join(['cv2' => 'configsysval'], ' c2.configsys_id = cv2.configsys_id', ['controlpanelitem_value' => 'configsysval_val'])
			->whereLike('c2.configsys_name', '?')
			->whereNotLike('c2.configsys_name', '?')
			->whereEquals('cv2.configsysval_active', '?')
			->order($order)
			->offset($pageSize * ($page - 1))
			->limit($pageSize);

		return $this->adapter->query($select, [
			'CP.INVOICE_CUSTOM_FIELD%', 1, '%_ON_OFF', '%LINEITEM%',
			'CP.INVOICE_CUSTOM_FIELD%', 1, '%_REQ', '%LINEITEM%',
			'CP.PO_CUSTOM_FIELD%', 1, '%_ON_OFF', '%LINEITEM%',
			'CP.PO_CUSTOM_FIELD%', 1, '%_REQ', '%LINEITEM%',
			'CP.VEF_CUSTOM_FIELD%', 1, '%_ON_OFF', '%LINEITEM%',
			'CP.VEF_CUSTOM_FIELD%', 1, '%_REQ', '%LINEITEM%',
			'CP.INVOICE_CUSTOM_FIELD%', 1, '%_IMGINDEX', '%LINEITEM%',
			'CP.CUSTOM_FIELD%', 1, '%_TYPE', '%LINEITEM%',
			'CP.CUSTOM_FIELD_LABEL%', '%LINEITEM%', 1
		]);
	}

	public function getLineItems($pageSize, $page, $order) {
		$select = new Select();

		$select->from(['c2' => 'configsys'])
			->columns([
				'controlpanelitem_name'		=> 'configsys_name',
				'controlpanelitem_required'	=> 'configsys_required',
				'inv_on_off' => new sql\CustomFieldSelect(17, false, 10),
				'inv_req' => new sql\CustomFieldSelect(14, false, 10),
				'po_on_off' => new sql\CustomFieldSelect(17, false, 10),
				'po_req' => new sql\CustomFieldSelect(14, false, 10),
				'vef_on_off' => new sql\CustomFieldSelect(17, false, 10),
				'vef_req' => new sql\CustomFieldSelect(17, false, 10),
				'imgidx_on_off' => new sql\CustomFieldSelect(14, false, 10)
			])
			->join(['cv2' => 'configsysval'], ' c2.configsys_id = cv2.configsys_id', ['controlpanelitem_value' => 'configsysval_val'])
			->whereLike('c2.configsys_name', '?')
			->whereLike('c2.configsys_name', '?')
			->whereEquals('cv2.configsysval_active', '?')
			->order($order)
			->offset($pageSize * ($page - 1))
			->limit($pageSize);

		return $this->adapter->query($select, [
			'CP.INVOICE_CUSTOM_FIELD%', 1, '%LINEITEM_ON_OFF',
			'CP.INVOICE_CUSTOM_FIELD%', 1, '%LINEITEM_REQ',
			'CP.PO_CUSTOM_FIELD%', 1, '%LINEITEM_ON_OFF',
			'CP.PO_CUSTOM_FIELD%', 1, '%LINEITEM_REQ',
			'CP.VEF_CUSTOM_FIELD%', 1, '%LINEITEM_ON_OFF',
			'CP.VEF_CUSTOM_FIELD%', 1, '%LINEITEM_REQ',
			'CP.INVOICE_CUSTOM_FIELD%', 1, '%_IMGINDEX',
			'CP.CUSTOM_FIELD_LABEL%', '%LINEITEM%', 1
		]);
	}

	/**
	 * get service fields list
	 * @param $pageSize
	 * @param $page
	 * @param $order
	 * @return array|bool
	 */
	public function getCustomFields($pageSize, $page, $order, $fieldname = 'serviceField') {
		$select = new Select();

		$select->from(['p' => 'pncustomfields'])
			->columns([
				'customfield_id',
				'controlpanelitem_name'		=> 'customfield_name',
				'controlpanelitem_required'	=> 'customfield_required',
				'controlpanelitem_value'	=> 'customfield_label',
				'po_on_off'					=> 'customfield_status',
				'po_req'					=> 'customfield_required'
			])
			->whereLike('customfield_name', '?')
			->order($order)
			->offset($pageSize * ($page - 1))
			->limit($pageSize);

		return $this->adapter->query($select, [$fieldname . '%']);
	}

	/**
	 * Return control panel item
	 *
	 * @param $asp_client_id
	 * @param $controlpanelitem_name
	 * @param $controlpanelitem_value_default
	 * @param $controlpanelitem_value
	 * @return mixed
	 */
	public function getControlPanelItem($asp_client_id, $controlpanelitem_name, $controlpanelitem_value_default = '') {
		$select = new Select();

		$select->from(['c' => 'configsys'])
			->columns(['controlpanelitem_value' => new Expression("isnull(cv.configsysval_val, ?)")])
			->join(['cv' => 'configsysval'], 'c.configsys_id = cv.configsys_id', [])
			->where(['c.configsys_name' => '?']);

		$result = $this->adapter->query($select, [$controlpanelitem_value_default, 'CP.' . $controlpanelitem_name]);

		return !isset($result[0]) ? $controlpanelitem_value_default : $result[0]['controlpanelitem_value'];
	}

	/**
	 * Return custom field length
	 *
	 * @param $fid
	 * @return int
	 */
	public function getFieldLength($fid, $tabindex){
		$select = new Select();
		$column = "custom_field{$fid}";

		$column .= $tabindex == ConfigService::TABINDEX_CUSTOMFIELD_HEADERS ? "_maxlength" : ($tabindex == ConfigService::TABINDEX_CUSTOMFIELD_LINEITEMS ? "_lineitem_maxlength" : '');

		$select->from(['ir' => 'integrationrequirements'])
			->columns(['maxlength' => $column])
			->limit(1);

		$result = $this->adapter->query($select);

		return !isset($result[0]) ? 0 : $result[0]['maxlength'];
	}

	/**
	 * Save config value
	 *
	 * @param $name
	 * @param $value
	 * @param $userprofile_id
	 * @return array|bool
	 */
	public function saveConfigValue($name, $value, $userprofile_id) {
		$update = new Update();
		$select = new Select();

		$select->from(['c' => 'configsys'])
			->limit(1)
			->columns([])
			->join(['cv' => 'configsysval'], 'cv.configsys_id = c.configsys_id', ['configsysval_id'])
			->where(
				[
					'c.configsys_name'	=> '?'
				]
			);

		$id = $this->adapter->query($select, [$name]);

		$value = !$value ? 0 : $value;

		$update->table('configsysval')
			->values(
				[
					'configsysval_val'		=> "$value",
					'configsysval_updated_datetm'	=> "'" . Util::formatDateForDB() . "'",
					'configsysval_updated_by'		=> $userprofile_id
				]
			)
			->where(
				[
					'configsysval_id' => '?'
				]
			);

		$result = $this->adapter->query($update, [$id[0]['configsysval_id']]);

		return $result;
	}
}

?>
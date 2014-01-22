<?php

namespace NP\workflow;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Update;
use NP\user\UserprofileRoleGateway;
use NP\vendor\VendorGateway;

/**
 * Gateway for the WFRULE table
 *
 * @author 
 */
class WfRuleGateway extends AbstractGateway {
        protected $pk = 'wfrule_id';
	protected $table = 'wfrule';

	protected $userprofileRoleGateway, $vendorGateway, $wfActionGateway;

	public function __construct(Adapter $adapter, UserprofileRoleGateway $userprofileRoleGateway, VendorGateway $vendorGateway, WFActionGateway $wfActionGateway) {
		$this->userprofileRoleGateway = $userprofileRoleGateway;
                $this->vendorGateway = $vendorGateway;
                $this->wfActionGateway = $wfActionGateway;
		
		parent::__construct($adapter);
	}

	/**
	 * Checks to see if there's an active optional workflow rule for the current property and user 
	 *
	 * @param  int     $property_id
	 * @param  int     $userprofile_id
	 * @return boolean
	 */
	public function hasOptionalRule($property_id, $userprofile_id) {
		$user = $this->userprofileRoleGateway->find(
			'userprofile_id = ?',
			[$userprofile_id],
			null,
			['userprofilerole_id','role_id']
		);

		$res = $this->adapter->query(
			Select::get()->count(true, 'ruleCount')
						->from(['wr'=>'wfrule'])
						->join(new sql\join\WfRuleWfRuleTypeJoin([]))
						->join(new sql\join\WfRuleWfActionJoin())
						->join(new sql\join\WfRuleWfRuleTargetJoin())
						->whereEquals('wr.wfrule_status', "'active'")
						->whereEquals('wrt.wfruletype_name', "'Optional Workflow'")
						->whereEquals('wrta.tablekey_id', '?')
						->whereNest('OR')
							->whereNest()
								->whereEquals('wa.wfaction_originator_tablename', "'userprofilerole'")
								->whereEquals('wa.wfaction_originator_tablekey_id', '?')
							->whereUnnest()
							->whereNest()
								->whereEquals('wa.wfaction_originator_tablename', "'role'")
								->whereEquals('wa.wfaction_originator_tablekey_id', '?')
							->whereUnnest()
						->whereUnnest(),
			[$property_id, $user[0]['userprofilerole_id'], $user[0]['role_id']]
		);

		return ($res[0]['ruleCount']) ? true : false;
	}




    public function findRule($asp_client_id, $type, $criteria, $page, $size, $order) {
        if (!empty($criteria) && $criteria <> '0') {
            $criteria = json_decode($criteria);
        } elseif (!empty($criteria)) {
            $criteria = null;
        } else {
            $criteria = [0];
        }
        if (!empty($criteria) && is_array($criteria)) {
            $criteria = '('.implode(',', $criteria).')';
        }

        $selectors = [];
        switch ($type) {
            case 0: 
                $selectors[] = new sql\SearchSelect($asp_client_id, $order);
                break;
            case 1:
                if (empty($criteria)) {
                    $criteria = new Select('property', ['property_id']);
                }
                $selectors[] = new sql\SearchByPropertySelect($asp_client_id, $criteria);
                break;
            case 2:
                if (empty($criteria)) {
                    $criteria = new Select('glaccount', ['glaccount_id']);
                }
                $selectors[] = new sql\SearchByGLAccountSelect01($asp_client_id, $criteria);
                $selectors[] = new sql\SearchByGLAccountSelect02($asp_client_id, $criteria);
                break;
            case 3:
                if (empty($criteria)) {
                    $criteria = new Select('userprofilerole', ['userprofilerole_id']);
                }
                $selectors[] = new sql\SearchByUserSelect01($asp_client_id, $criteria);
                $selectors[] = new sql\SearchByUserSelect02($asp_client_id, $criteria);
                break;
            case 4:
                if (empty($criteria)) {
                    $criteria = new Select('role', ['role_id']);
                }
                $selectors[] = new sql\SearchByRoleSelect01($asp_client_id, $criteria);
                $selectors[] = new sql\SearchByRoleSelect02($asp_client_id, $criteria);
                break;
            case 5:
                if (empty($criteria)) {
                    $criteria = new Select('vendor', ['vendor_id']);
                }
                $selectors[] = new sql\SearchByVendorSelect($asp_client_id, $criteria);
                break;
            case 6:
                if (empty($criteria)) {
                    $criteria = new Select('wfruletype', ['wfruletype_id']);
                }
                $selectors[] = new sql\SearchByRuleTypeSelect($asp_client_id, $criteria);
                break;
        }

        $result = [];
        if ($type != 0) {
            if (!empty($selectors)) {
                foreach($selectors as $select) {
                    $result[] = $this->adapter->query($select);
                }
            }
        } else {
            if (!empty($size)) {
                $result = $this->getPagingArray($selectors[0], [], $size, $page, 'wfrule_id');
            } else {
                $result = $this->adapter->query($selectors[0]);
            }
        }
        return $result;
    }

    public function getRule($ruleid, $asp_client_id, $params = []) {
        $result = [
            'rule' => $this->adapter->query(
                new sql\GetRuleSelect($ruleid, $asp_client_id)
            ),
            'scope' => $this->adapter->query(
                new sql\GetRuleScopeSelect($ruleid, $asp_client_id)
            ),
            'routes' => $this->adapter->query(
                new sql\GetRuleRoutesSelect($ruleid, $asp_client_id)
            ),
            'actions' => $this->adapter->query(
                new sql\GetRuleActionsSelect($ruleid, $asp_client_id)
            ),
            'properties' => $this->adapter->query(
                new sql\GetRulePropertiesSelect($ruleid)
            ),

            'codes' => [],
            'units' => [],
            'vendors' => [],
            'contracts' => [],
            'categories' => []
        ];

        if (!empty($result['rule']) && !empty($result['rule'][0])) {
            $result['rule'] = $result['rule'][0];

            $count = $this->adapter->query(
                new \NP\property\sql\GetPropertiesCountSelect($asp_client_id)
            );

            $selected = 0;
            $properties = [];
            foreach ($result['properties'] as $property) {
                $selected++;
                $properties[$property['property_id']] = [
                    'property_id' => $property['property_id'],
                    'property_name' => $property['property_name'],
                    'region_name' => 
                        empty($property['region_name']) ?
                            'None' :
                            $property['region_name']
                ];
            }

            $result['properties'] = [
                'all' => 
                    $count == $selected
                ,
                'properties' => $properties
            ];

            $keys = [];
            foreach ($result['scope'] as $scope) {
                $keys[] = $scope['tablekey_id'];
            }
            if (empty($keys)) { $keys = [0]; }

            $type = $result['rule']['wfruletype_id'];

//			if ($result['rule']['wfrule_status'] != 'new') {
//				$result['rule']['originator'] = $this->adapter->query(
//					new sql\GetRuleOriginatorSelect($ruleid, $asp_client_id, $type)
//				);
//			}

            if (in_array($type, [3, 7, 8, 13, 29, 31, 33, 37])) {
                $result['codes'] = $this->adapter->query(
                    new sql\GLAccountByWFRuleSelect($ruleid, $asp_client_id)
                );
            }
            if (in_array($type, [35, 36])) {
                $result['units'] = $this->adapter->query(
                    new \NP\property\sql\GetUnitsSelect($keys)
                );

                if (!empty($result['units'])) {
                    for ($i = 0; $i < count($result['units']); $i++) {
                        $result['units'][$i]['unitcode'] =
                            !empty($params) && 
                                !empty($params['UnitAttachDisplay']) && 
                                $params['UnitAttachDisplay'] == 'unitcode'
                        ;

                        if ($result['units'][$i]['building_id_alt'] != '') {
                            $result['units'][$i]['unit_display'] = strtoupper(
                                $result['units'][$i]['building_id_alt']
                                .' - '.
                                $result['units'][$i]['unit_number']
                            );
                        } else {
                            $result['units'][$i]['unit_display'] = strtoupper(
                                $result['units'][$i]['unit_number']
                            );
                        }
                    }
                }
            }
//            if (in_array($type, [9, 10, 11, 12, 14, 30, 32, 34, 38])) {
                $result['categories'] = $this->adapter->query(
                    new sql\GLAccountByWFRuleSelect($ruleid, $asp_client_id)
                );
//            }
            if (in_array($type, [24, 25, 26, 27])) {
                $result['contracts'] = $this->adapter->query(
                    new sql\JobContractByWFRuleScope($ruleid)
                );
            }
            if (in_array($type, [6, 16])) {
                $vendors = $this->vendorGateway->find(
                    Where::get()
                        ->in('v.vendor_id', implode(',', $keys))
                    ,
                    [],
                    null,
                    ['vendor_id', 'vendor_name']
                );
                
                foreach ($vendors as $vendor) {
                    $result['vendors'][$vendor['vendor_id']] = $vendor['vendor_name'];
                }
            }

            if ($type == 4) {
                $result['routes'] = [];
            }

            for ($i = 0; $i < count($result['routes']); $i++) {
                switch ($result['routes'][$i]['wfaction_receipient_tablename']) {
                    case 'role':
                        $result['routes'][$i]['forwards'] = 'Role';
                        $result['routes'][$i]['names'] = $result['routes'][$i]['role_name'];
                        break;
                    case 'userprofilerole':
                        $result['routes'][$i]['forwards'] = 'User';
                        $result['routes'][$i]['names'] = 
                            $result['routes'][$i]['person_lastname'].', '.
                            $result['routes'][$i]['person_firstname'].' '.
                            $result['routes'][$i]['person_middlename']
                        ;
                        if ($result['routes'][$i]['userprofile_status'] == 'inactive') {
                            $result['routes'][$i]['names'] .= ' (Inactive)';
                        }
                        break;
                    default:
                        $result['routes'][$i]['forwards'] = 'Next Level';
                        $result['routes'][$i]['names'] = '- -';
                }

                switch ($result['routes'][$i]['wfaction_originator_tablename']) {
                    case 'role':
                        $result['routes'][$i]['originator'] = 'Role';
                        $result['routes'][$i]['onames'] = $result['routes'][$i]['role_name_originator'];
                        break;
                    case 'userprofilerole':
                        $result['routes'][$i]['originator'] = 'User';
                        $result['routes'][$i]['onames'] = 
                            $result['routes'][$i]['person_lastname_originator'].', '.
                            $result['routes'][$i]['person_firstname_originator'].' '.
                            $result['routes'][$i]['person_middlename_originator']
                        ;
                        if ($result['routes'][$i]['userprofile_status_originator'] == 'inactive') {
                            $result['routes'][$i]['onames'] .= ' (Inactive)';
                        }
                        break;
                    default:
                        $result['routes'][$i]['originator'] = '---';
                }
            }
        }
        return $result;
    }

    public function getRuleHours($ruleid, $asp_client_id) {
        $select = new sql\GetRuleHoursSelect($ruleid, $asp_client_id);
        return $this->adapter->query($select);
    }

    public function getRuleProperties($ruleid) {
        $select = new sql\GetRulePropertiesSelect($ruleid);
        return $this->adapter->query($select);
    }

    public function setRuleStatus($id, $status) {
        if ($status == 1) {
            $routes = $this->wfActionGateway->find(
                Where::get()
                    ->equals('wfrule_id', $id)
            );
            $status = 
                count($routes) > 0 ?
                    'active':
                    'new'
            ;
        } elseif ($status == 3) {
            $status = 'inactive';
        } else {
            $status = 'deactive';
        }
        $update = new Update();
        $update
            ->table($this->table)
            ->value('wfrule_status', '\''.$status.'\'')
            ->whereEquals('wfrule_id', new \NP\core\db\Expression($id))
        ;
        return $this->adapter->query($update);
    }
}
/*
USER_PROPERTY_LISTING
TREE_GLACCOUNT_MASTER_LIST
TREE_ROLE
 */
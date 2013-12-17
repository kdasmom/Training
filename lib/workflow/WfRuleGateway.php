<?php

namespace NP\workflow;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;
use NP\user\UserprofileRoleGateway;

/**
 * Gateway for the WFRULE table
 *
 * @author 
 */
class WfRuleGateway extends AbstractGateway {
	protected $userprofileRoleGateway;

	public function __construct(Adapter $adapter, UserprofileRoleGateway $userprofileRoleGateway) {
		$this->userprofileRoleGateway = $userprofileRoleGateway;
		
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

    public function getRule($ruleid, $asp_client_id) {
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
            )
        ];

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
                    break;
                case 'userprofilerole':
                    $result['routes'][$i]['originator'] = 'User';
                    break;
                default:
                    $result['routes'][$i]['originator'] = '---';
            }
            $result['routes'][$i]['onames'] = '===ONAMES===';
        }
/*
SELECT 
    w.wfaction_receipient_tablename,w.wfaction_receipient_tablekey_id,w.wfaction_originator_tablename, w.wfaction_originator_tablekey_id,
    w.wfaction_id,w.wfrule_id,
    r.role_name,ur.userprofilerole_id,

    u.userprofile_status,ps.person_lastname,ps.person_firstname,ps.person_middlename 
        SELECT 
            CASE 
                WHEN w.wfaction_originator_tablename='role' THEN (
                    Select role_name FROM ROLE where role_id = w.wfaction_originator_tablekey_id
                )
		WHEN w.wfaction_originator_tablename='userprofilerole' THEN (
                    Select ISNULL(PERSON.person_lastname, '')+', '+ISNULL(PERSON.person_firstname, '')+' '+ISNULL(PERSON.person_middlename, '')  +
                        CASE USERPROFILE.userprofile_status
                            WHEN 'inactive' THEN ' (Inactive)'
                            ELSE ''
                        END 	
                    FROM USERPROFILEROLE
                        INNER JOIN STAFF ON USERPROFILEROLE.tablekey_id = STAFF.staff_id 
                        INNER JOIN PERSON ON STAFF.person_id = PERSON.person_id
                        INNER JOIN USERPROFILE ON USERPROFILE.userprofile_id = USERPROFILEROLE.userprofile_id
                    WHERE USERPROFILEROLE.userprofilerole_id = w.wfaction_originator_tablekey_id 			 
                )
                ELSE '---'
            END AS onames
*/
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

}
/*
USER_PROPERTY_LISTING
TREE_GLACCOUNT_MASTER_LIST
TREE_ROLE
 */
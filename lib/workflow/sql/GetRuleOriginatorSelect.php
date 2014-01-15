<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

class GetRuleOriginatorSelect extends Select {
	public function __construct($ruleid, $asp_client_id, $ruletypeid) {
		parent::__construct();

/*
	SELECT
		r.role_name,
		ur.userprofilerole_id,
		w.wfaction_receipient_tablename,
		w.wfaction_receipient_tablekey_id,
		w.wfaction_originator_tablename,
		w.wfaction_originator_tablekey_id,
		w.wfaction_id,
		w.wfrule_id,
  	CASE
  		WHEN @in_wfruletype_id = 15   THEN '---'
  		WHEN w.wfaction_receipient_tablename='role'   THEN 'Role'
		WHEN w.wfaction_receipient_tablename='userprofilerole'   THEN 'User'
		ELSE 'Next Level'
		END AS forwards,
  	CASE
  		WHEN @in_wfruletype_id = 15   THEN '---'
  		WHEN w.wfaction_receipient_tablename='role'   THEN r.role_name
		WHEN w.wfaction_receipient_tablename='userprofilerole'
			THEN
			(ISNULL(ps.person_lastname, '')+', '+ISNULL(ps.person_firstname, '')+' '+ISNULL(ps.person_middlename, '')) +
				CASE u.userprofile_status
					WHEN 'inactive' THEN ' (Inactive)'
					ELSE ''
				END
			ELSE '- -'
			END AS names,
 	CASE
  		WHEN w.wfaction_originator_tablename='role' THEN 'Role'
		WHEN w.wfaction_originator_tablename='userprofilerole' THEN 'User'
		ELSE '---'
		END AS originator,
  	CASE
  		WHEN w.wfaction_originator_tablename='role' THEN (Select role_name FROM ROLE where role_id = w.wfaction_originator_tablekey_id)
		WHEN w.wfaction_originator_tablename='userprofilerole'
			THEN (
				Select ISNULL(PERSON.person_lastname, '')+', '+ISNULL(PERSON.person_firstname, '')+' '+ISNULL(PERSON.person_middlename, '')  +
					CASE userprofile_status
						WHEN 'inactive' THEN ' (Inactive)'
						ELSE ''
					END
				FROM
				USERPROFILEROLE
				INNER JOIN USERPROFILE u ON u.userprofile_id = USERPROFILEROLE.userprofile_id
				INNER JOIN STAFF ON USERPROFILEROLE.tablekey_id = STAFF.staff_id
				INNER JOIN PERSON ON STAFF.person_id = PERSON.person_id
				WHERE USERPROFILEROLE.userprofilerole_id = w.wfaction_originator_tablekey_id
			     )
		ELSE '---'
		END AS onames
	FROM wfaction w
		LEFT OUTER JOIN role  r on (r.role_id=w.wfaction_receipient_tablekey_id and w.wfaction_receipient_tablename='role')
		LEFT OUTER JOIN userprofilerole ur on (ur.userprofilerole_id =w.wfaction_receipient_tablekey_id and w.wfaction_receipient_tablename='userprofilerole')
		LEFT OUTER JOIN userprofile u on u.userprofile_id=ur.userprofile_id AND u.asp_client_id=@in_asp_client_id
		LEFT OUTER JOIN  STAFF s ON ur.tablekey_id = s.staff_id
		LEFT OUTER JOIN  PERSON ps ON s.person_id = ps.person_id
	WHERE w.wfrule_id=@in_wfrule_id
*/


		$this->columns([
//				'role_name',
//				'userprofilerole_id',
				'wfaction_receipient_tablename',
				'wfaction_receipient_tablekey_id',
				'wfaction_originator_tablename',
				'wfaction_originator_tablekey_id',
				'wfaction_id',
				'wfrule_id',
				'forwards' => new Expression("
					CASE
						WHEN {$ruletypeid} = 15 THEN '---'
						WHEN w.wfaction_receipient_tablename='role' THEN 'Role'
						WHEN w.wfaction_receipient_tablename='userprofilerole' THEN 'User'
						ELSE 'Next Level'
						END
				"),
				'names' => new Expression("
					CASE
						WHEN {$ruletypeid} = 15 THEN '---'
						WHEN w.wfaction_receipient_tablename='role' THEN r.role_name
						WHEN w.wfaction_receipient_tablename='userprofilerole'
							THEN
							(ISNULL(ps.person_lastname, '')+', '+ISNULL(ps.person_firstname, '')+' '+ISNULL(ps.person_middlename, '')) +
								CASE u.userprofile_status
									WHEN 'inactive' THEN ' (Inactive)'
									ELSE ''
								END
							ELSE '- -'
							END
				"),
				'originator' => new Expression("
					CASE
						WHEN w.wfaction_originator_tablename='role' THEN 'Role'
						WHEN w.wfaction_originator_tablename='userprofilerole' THEN 'User'
						ELSE '---'
						END
				"),
				'onames' => new Expression("
					CASE
						WHEN w.wfaction_originator_tablename='role' THEN (

						Select role_name FROM ROLE where role_id = w.wfaction_originator_tablekey_id)
						WHEN w.wfaction_originator_tablename='userprofilerole'
							THEN (
								Select ISNULL(PERSON.person_lastname, '')+', '+ISNULL(PERSON.person_firstname, '')+' '+ISNULL(PERSON.person_middlename, '')  +
									CASE userprofile_status
										WHEN 'inactive' THEN ' (Inactive)'
										ELSE ''
									END
								FROM
								USERPROFILEROLE
								INNER JOIN USERPROFILE u ON u.userprofile_id = USERPROFILEROLE.userprofile_id
								INNER JOIN STAFF ON USERPROFILEROLE.tablekey_id = STAFF.staff_id
								INNER JOIN PERSON ON STAFF.person_id = PERSON.person_id
								WHERE USERPROFILEROLE.userprofilerole_id = w.wfaction_originator_tablekey_id
								 )
						ELSE '---'
						END
				")
			])
			->from(['w' => 'wfaction'])
				->join(
					['r' => 'role'],
					'r.role_id=w.wfaction_receipient_tablekey_id and w.wfaction_receipient_tablename=\'role\'',
					['role_name'],
					Select::JOIN_LEFT_OUTER
				)
				->join(
					['ur' => 'userprofilerole'],
					'ur.userprofilerole_id=w.wfaction_receipient_tablekey_id and w.wfaction_receipient_tablename=\'userprofilerole\'',
					['userprofilerole_id'],
					Select::JOIN_LEFT_OUTER
				)
				->join(
					['u' => 'userprofile'],
					'u.userprofile_id=ur.userprofile_id and u.asp_client_id=' . $asp_client_id,
					[],
					Select::JOIN_LEFT_OUTER
				)
				->join(
					['s' => 'STAFF'],
					'ur.tablekey_id = s.staff_id',
					[],
					Select::JOIN_LEFT_OUTER
				)
				->join(
					['ps' => 'PERSON'],
					's.person_id = ps.person_id',
					[],
					Select::JOIN_LEFT_OUTER
				)
		;



/*
		$this->columns([
			new Expression("
					CASE
						WHEN w.wfaction_originator_tablename='role' THEN (" .
				Select::get()->column('role_name')
					->from('ROLE')
					->where('role_id = w.wfaction_originator_tablekey_id') . ")
						WHEN w.wfaction_originator_tablename='userprofilerole'
							THEN (
								Select ISNULL(PERSON.person_lastname, '')+', '+ISNULL(PERSON.person_firstname, '')+' '+ISNULL(PERSON.person_middlename, '')  +
									CASE userprofile_status
										WHEN 'inactive' THEN ' (Inactive)'
										ELSE ''
									END
								FROM
								USERPROFILEROLE
								INNER JOIN USERPROFILE u ON u.userprofile_id = USERPROFILEROLE.userprofile_id
								INNER JOIN STAFF ON USERPROFILEROLE.tablekey_id = STAFF.staff_id
								INNER JOIN PERSON ON STAFF.person_id = PERSON.person_id
								WHERE USERPROFILEROLE.userprofilerole_id = w.wfaction_originator_tablekey_id
								 )
						ELSE '---'
						END AS onames
				")
		])
			->from(['w' => 'wfaction'])
		;
*/
		$where = Where::get()
			->equals('w.wfrule_id', $ruleid)
		;
		$this->where($where);


//		echo "<pre>1";
//		print_r($this);
//		print_r($this->toString());
//		echo "1</pre>";
	}
}
<?php

namespace NP\shared;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the NOTE table
 *
 * @author Thomas Messier
 */
class NoteGateway extends AbstractGateway {
	
	public function findHoldNotes($invoice_id) {
		return $this->adapter->query(
			Select::get()
				->columns(['note','note_createddatetm'])
				->from(['n'=>'note'])
					->join(
						['ot'=>'objecttype'],
						'ot.objtype_id = n.objecttype_id AND ot.objtype_id_alt = 1',
						[]
					)
					->join(
						['r'=>'reason'],
						'n.reason_id = r.reason_id',
						['reason_text']
					)
					->join(
						['u'=>'userprofile'],
						'n.userprofile_id = u.userprofile_id',
						['userprofile_id']
					)
				->whereEquals('n.table_name', "'invoice'")
				->whereEquals('n.tablekey_id', '?')
				->order('n.note_createddatetm'),
			[$invoice_id]
		);
	}

}

?>
<?php

namespace NP\property;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the UNITTYPE table
 *
 * @author Thomas Messier
 */
class UnitTypeGateway extends AbstractGateway {

	/**
	 * Override getSelect() to add some joins by default
	 */
	public function getSelect() {
		$select = new Select();
		$select->from(array('ut'=>'unittype'))
				->join(array('u'=>'userprofile'),
						'ut.unittype_updated_by = u.userprofile_id',
						null,
						Select::JOIN_LEFT);

		return $select;
	}
        
        public function findByAltId($type)
    {
        $select = new Select();
        $select ->from('unittype')
            ->columns(array('id' => 'unittype_id'))
            ->where("unittype_name = ?");

        $res = $this->adapter->query($select, array($type));

        return $res[0];
    }

}

?>
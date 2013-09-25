<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/24/13
 * Time: 2:19 PM
 */

namespace NP\utility;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;

/**
 * Gateway for the UTILITYTYPE table
 *
 * @author
 */
class UtilityTypeGateway extends AbstractGateway {

    public function __construct(Adapter $adapter) {
        parent::__construct($adapter);

    }

    /***
     * Retrieve utility types assigned to the selected utility
     *
     * @param $utility_id
     * @return array|bool
     */
    public function findByUtilityId($utility_id) {
        $select =  new Select();

        $select->from(['ut' => 'utilitytype'])
            ->join(['uts' => 'utilitytypes'], 'ut.utilitytype_id = uts.utilitytype_id', [])
            ->where(['uts.utility_id' => '?']);

        return $this->adapter->query($select, [$utility_id]);
    }

}

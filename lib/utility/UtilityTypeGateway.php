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


    public function saveUtility($data) {
        $spid = $this->adapter->query('SELECT @@SPID as spid');

    }

}

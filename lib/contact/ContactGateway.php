<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/24/13
 * Time: 5:41 PM
 */

namespace NP\contact;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;

class ContactGateway extends AbstractGateway {

    public function __construct(Adapter $adapter) {
        return parent::__construct($adapter);
    }
}
<?php

namespace NP\user;

use NP\system\BaseImportServiceGateway;

/**
 * Gateway for the USERPROPERTY table
 *
 * @author Zubik Aliaksandr
 */
class UserPropertyGateway extends BaseImportServiceGateway {

     protected $table = 'PROPERTYUSERPROFILE';
     
     protected $pk = 'propuser_id';
     
}

?>
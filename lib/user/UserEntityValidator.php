<?php

namespace NP\user;

use NP\system\BaseImportServiceEntityValidator;
use NP\core\db\Select;

class UserEntityValidator extends BaseImportServiceEntityValidator{
    
protected $roleGateway, $stateGateway;

    /**
     * @param RoleGateway $roleGateway
     */
    public function __construct(RoleGateway $roleGateway)
    {
        $this->roleGateway = $roleGateway;
    }

    /**
     * @param \ArrayObject $row
     * @param \ArrayObject $errors
     * @return BaseImportServiceEntityValidator|void
     */
    protected function validate(\ArrayObject $row, \ArrayObject $errors)
    {
        $select = new Select();
        $select ->from('ROLE')
                ->columns(array('id' => 'role_id'))
                ->where("role_name = ?");

        $result = $this->roleGateway->adapter->query($select, array($row['UserGroup']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('UserGroup', 'importFieldUserGroupError');
        }
   }
}

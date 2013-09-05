<?php

namespace NP\user;

use NP\system\BaseImportServiceEntityValidator;
use NP\core\db\Select;
use NP\user\UserprofileGateway;
use NP\property\PropertyGateway;

class UserPropertyEntityValidator extends BaseImportServiceEntityValidator{
    
    protected $userprofileGateway, $propertyGateway;

    public function __construct(UserprofileGateway $userprofileGateway, PropertyGateway $propertyGateway)
    {
        $this->userprofileGateway = $userprofileGateway;
        $this->propertyGateway = $propertyGateway;
    }

    /**
     * @param \ArrayObject $row
     * @param \ArrayObject $errors
     * @return BaseImportServiceEntityValidator|void
     */
    protected function validate(\ArrayObject $row, \ArrayObject $errors)
    {
        $select = new Select();
        $select ->from('USERPROFILE')
                ->columns(array('id' => 'userprofile_id'))
                ->where("userprofile_username = ?");

        $result = $this->userprofileGateway->adapter->query($select, array($row['Username']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('Username', 'importFieldUsernameError');
        }
        
        $select = new Select();
        $select ->from('PROPERTY')
            ->columns(array('id' => 'property_id'))
            ->where("property_id_alt = ? ");

        $result = $this->propertyGateway->adapter->query($select, array($row['PropertyCode']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('PropertyCode', 'importFieldPropertyCodeError');
        }  
   }
}

<?php

namespace NP\invoice;

use NP\gl\GLAccountGateway;
use NP\property\PropertyGateway;
use NP\system\BaseImportServiceEntityValidator;
use NP\core\db\Select;

class InvoiceExportEntityValidator extends BaseImportServiceEntityValidator{

  protected $glaccountGateway, $propertyGateway;

    /**
     * @param GLAccountGateway $glaccountGateway
     * @param PropertyGateway $propertyGateway
     */
    public function __construct(GLAccountGateway $glaccountGateway, PropertyGateway $propertyGateway)
    {
        $this->glaccountGateway = $glaccountGateway;
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
        $select ->from('PROPERTY')
            ->columns(array('id' => 'property_id'))
            ->where("property_id_alt = ? ");

        $result = $this->propertyGateway->adapter->query($select, array($row['PropertyCode']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('PropertyCode', 'importFieldPropertyCodeError');
        }   
        
        $select = new Select();
        $select ->from('GLACCOUNT')
            ->columns(array('id' => 'glaccount_id'))
            ->where("glaccount_number = ? ");

        $result = $this->glaccountGateway->adapter->query($select, array($row['AccountNumber']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('AccountNumber', 'importFieldGLCodeError');
        }  
   }
}

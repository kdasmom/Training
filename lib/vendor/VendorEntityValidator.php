<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 9/2/13
 * Time: 6:11 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


use NP\system\BaseImportServiceEntityValidator;
use NP\core\db\Select;

class VendorEntityValidator extends BaseImportServiceEntityValidator
{

    /**
     * @var \NP\core\db\Adapter
     */
    protected $adapter;

    /**
     * @param \NP\core\db\Adapter $adapter
     */
    public function __construct(\NP\core\db\Adapter $adapter)
    {
        $this->adapter = $adapter;
    }

    /**
     * @param \ArrayObject $row
     * @param \ArrayObject $errors
     * @return BaseImportServiceEntityValidator
     */
    protected function validate(\ArrayObject $row, \ArrayObject $errors)
    {
        $rowFlipped = array_flip($row->getArrayCopy());
        array_walk($rowFlipped, function(&$a, $b) { $a = preg_replace('/\s/', '', preg_replace('/\W/', '', $a)); });
        extract(array_flip($rowFlipped), EXTR_PREFIX_INVALID, 'row');

        //var_dump(get_defined_vars());die;

        $select = new Select();
        $select ->from('integrationpackage')
            ->columns(array('id' => 'integration_package_id'))
            ->where("integration_package_name = ?");

        $resultIntegrationPackage = $this->adapter->query($select, array($IntegrationPackage));

        if (empty($resultIntegrationPackage)) {
            $this->addLocalizedErrorMessage('Integration Package', 'Invalid Integration Package');
        }

        $select = new Select();
        $select ->from('vendor')
            ->columns(array('id' => 'vendor_id'))
            ->where("vendor_id_alt = ? AND integration_package_id = ?");

        $result = $this->adapter->query($select, array($VendorID, empty($resultIntegrationPackage)?null:$resultIntegrationPackage[0]['id']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('Vendor ID', 'Invalid Vendor ID');
        }

        $query = "SELECT vendortype_id FROM VENDORTYPE WHERE vendortype_name = ?";
        $result = $this->adapter->query($query, array($VendorType));
        if (empty($result)) {
            $this->addLocalizedErrorMessage('Vendor Type', 'Invalid Vendor Type');
        }
        //var_dump(get_defined_vars());
        //die;
        /*
        Vendor ID
        Name
        Federal ID
        Tax Report Name
        Status
        Vendor Type
        Pay Priority
        Created Date
        Last Update Date
        1099 Reportable?
        Term Date Basis
        Pay Date Basis
        Default GL code
        Phone
        Fax
        Address 1
        Address 2
        City
        State
        Zip Code
        Contact Last Name
        Contact First Name
        Integration Package
        */

    }
}

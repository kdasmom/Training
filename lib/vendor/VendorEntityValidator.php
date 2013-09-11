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
        $select = new Select();
        $select ->from('INTEGRATIONPACKAGE')
                ->columns(array('id' => 'integration_package_id'))
                ->where("integration_package_name = ?");

        $integrationPackage = $this->adapter->query($select, array($row['IntegrationPackage']));
        
        if (empty($integrationPackage)) {
            $this->addLocalizedErrorMessage('IntegrationPackage', 'importFieldIntegrationPackageNameError');
        }
        
        $select = new Select();
        $select ->from('VENDOR')
            ->columns(array('id' => 'vendor_id'))
            ->where("vendor_id_alt = ? ");

        $vendor = $this->adapter->query($select, array($row['VendorID']));

        if (!empty($vendor)) {
            $this->addLocalizedErrorMessage('VendorID', 'importFieldVendorIDError');
        }  
    }
}

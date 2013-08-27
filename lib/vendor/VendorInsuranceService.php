<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/27/13
 * Time: 11:22 AM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


use NP\system\BaseImportService;

class VendorInsuranceService extends BaseImportService
{

    /**
     * @var VendorInsuranceGateway
     */
    protected $gateway;

    public function __construct(VendorInsuranceGateway $gateway)
    {
        $this->gateway = $gateway;
    }

    /**
     * This must be implemented in child class.
     * Method accept row and entity class to save in related gateway.
     *
     * @param \ArrayObject $data Row array for entity defined in next param
     * @param string $entityClass Entity class to map data
     */
    public function save(\ArrayObject $data, $entityClass)
    {
        // TODO: Implement save() method.

        $data = array(
            'tablekey_id',
            'insurancetype_id',
            'insurance_company',
            'insurance_policynum',
            'insurance_expdatetm',
            'insurance_status',
            'insurance_policy_effective_datetm',
            'insurance_policy_limit',
            'insurance_additional_insured_listed'
        );
    }
}

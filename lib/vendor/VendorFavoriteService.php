<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/20/13
 * Time: 10:47 AM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


use NP\system\BaseImportService;

class VendorFavoriteService extends BaseImportService {

    /**
     * @var VendorFavoriteGateway
     */
    protected $gateway;

    /**
     * @var VendorFavoriteEntityValidator
     */
    protected $validator;

    public function __construct(VendorFavoriteGateway $gateway, VendorFavoriteEntityValidator $validator)
    {
        $this->gateway = $gateway;
        $this->validator = $validator;
    }

    /**
     * @param $data array Row array for entity defined in next param
     * @param $entityClass string Entity class to map data
     */
    public function save(\ArrayObject $data, $entityClass)
    {
        // TODO: Implement save() method.
    }
}

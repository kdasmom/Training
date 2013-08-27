<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/27/13
 * Time: 3:20 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


use NP\system\BaseImportService;

class VendorGLService extends BaseImportService
{

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
    }
}

<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/7/13
 * Time: 6:32 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\system;


use NP\core\AbstractEntity;

class VirtualEntity extends AbstractEntity {
    public function __construct($fields, $data)
    {
        $this->fields = $fields;
        parent::__construct($data);
    }
}

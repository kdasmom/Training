<?php

namespace NP\system;


use NP\system\BaseImportServiceGateway;

class SplitGateway extends BaseImportServiceGateway {
    
    protected $table = 'DFSPLIT';
    
    protected $pk = 'dfsplit_id';
}
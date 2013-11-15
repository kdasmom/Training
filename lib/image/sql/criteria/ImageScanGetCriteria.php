<?php

namespace NP\image\sql\criteria;

use NP\core\db\Where;
use NP\core\db\Select;
use NP\core\db\Expression;

class ImageScanGetCriteria extends Where {
    public function __construct($alias='img') {
        parent::__construct();

        $this
            ->nest('OR')
                ->isNull(new Expression('?'))//$params['tableref_id']
                ->equals('img.Tableref_id', new Expression('?'))
            ->unnest()
            ->nest('OR')
                ->equals('img.Image_Index_Id', new Expression('?'))
                ->nest('AND')
                    ->isNull(new Expression('?'))// $id
                    ->nest('OR')
                        ->isNull('img.Property_Id')
                        ->in('img.Property_Id', new Expression('?'))
                    ->unnest()
                    ->equals('img.asp_client_id', new Expression('?'))
                    ->nest('OR')
                        ->isNull('img.Tablekey_Id')
                        ->equals('img.Tablekey_Id', 0)
                    ->unnest()
                    ->in('img.Image_Index_Status', implode(',', [1, 2]))
                ->unnest()
            ->unnest()
        ;
    }
}
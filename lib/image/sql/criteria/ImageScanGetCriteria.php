<?php

namespace NP\image\sql\criteria;

use NP\core\db\Where;
use NP\core\db\Select;
use NP\core\db\Expression;

class ImageScanGetCriteria extends Where {
    public function __construct($properties, $tablerefs) {
        parent::__construct();

        if (empty($tablerefs)) {
            $tablerefs = 'null';
        }
        if (is_array($tablerefs)) {
            $tablerefs = implode(',', $tablerefs);
        }

        if (empty($properties)) {
            $properties = 'null';
        }
        if (is_array($properties)) {
            $properties = implode(',', $properties);
        }

        $this
            ->nest('OR')
                ->isNull(new Expression('?'))//$params['tableref_id']
                ->in('img.Tableref_id', $tablerefs)
            ->unnest()
            ->nest('OR')
                ->equals('img.Image_Index_Id', new Expression('?'))
                ->nest('AND')
                    ->isNull(new Expression('?'))// $id
                    ->nest('OR')
                        ->isNull('img.Property_Id')
                        ->in('img.Property_Id', $properties)
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
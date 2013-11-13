<?php
namespace NP\image;

class ImageIndexEntity extends \NP\core\AbstractEntity {
    protected $fields = [
        'image_index_id'            => [],

        'image_index_name'          => [
            'defaultValue'  => 'Invoice Image'
        ],
        'image_index_id_alt'        => [
            'defaultValue'  => 0
        ],
        'image_index_vendorsite_id' => [
            'defaultValue'  => null
        ],
        'property_id'               => [
            'defaultValue'  => null
        ],
        'image_index_ref'           => [
            'defaultValue'  => null
        ],
        'image_index_amount'        => [
            'defaultValue'  => null
        ],
        'image_index_invoice_date'  => [
            'defaultValue'  => null
        ],
        'asp_client_id'             => [
            'required'      => true
        ],
        'tablekey_id'               => [
            'defaultValue'  => 0
        ],
        'image_index_status'        => [
            'defaultValue'  => 0
        ],
        'image_index_source_id'     => [
            'defaultValue'  => 1
        ],
        'tableref_id'               => [
            'defaultValue'  => 0
        ],
        'image_doctype_id'          => [
            'defaultValue'  => 0
        ],
        'image_index_primary'       => [
            'defaultValue'  => 1
        ],
        'image_index_indexed_datetm'=> [
            'defaultValue'  => null
        ],
        'image_index_indexed_by'    => [
            'defaultValue'  => null
        ]
    ];
}
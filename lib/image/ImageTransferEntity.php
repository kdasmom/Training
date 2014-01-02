<?php
namespace NP\image;

class ImageTransferEntity extends \NP\core\AbstractEntity {
    protected $fields = [
        'image_transfer_id'         => [],

        'transfer_type'             => [
            'required'      => true
        ],
        'transfer_status'           => [
            'defaultValue'  => 1
        ],
        'transfer_filename'         => [
            'required'      => true
        ],
        'transfer_documentid'       => [
            'defaultValue'  => 0
        ],
        'transfer_databaseid'       => [
            'defaultValue'  => 0
        ],
        'invoiceimage_id'           => [
            'required'      => true
        ],
        'transfer_srcTableName'     => [
            'defaultValue'  => 'userprofile'
        ],
        'transfer_srcTablekey_id'   => [
            'required'      => true
        ]
    ];
}
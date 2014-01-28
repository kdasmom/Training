<?php
namespace NP\shared;

use NP\core\AbstractGateway;
use NP\core\db\Where;
use NP\core\db\Select;
use NP\core\db\Expression;
use NP\core\db\Insert;

class AuditlogGateway extends AbstractGateway {
    protected $table = 'auditlog';

    public function logImageUploaded($audittype, $auditactivity, $invoice_id, $invoiceimage_id, $invoiceimage_source_name, $userprofile_id, $delegation_to_userprofile_id) {
        $select = Select::get()->from('IMAGE_INDEX')
            ->columns([
                '1' => new Expression('?'),
                '2' => new Expression('?'),
                '3' => new Expression('?'),
                '4' => new Expression('?'),
                'image_index_name' => 'image_index_name',
                'image_index_date_entered' => 'image_index_date_entered',
                '5' => new Expression('?'),
                '6' => new Expression('?')
            ])
            ->where(
                Where::get()->equals('image_index_id', $invoiceimage_id)
            )
        ;
        $insert = Insert::get()->into($this->table)
            ->columns([
                'tablekey_id',
                'auditactivity_id',
                'audittype_id',
                'field_name',
                'field_old_value',
                'DTS',
                'userprofile_id',
                'delegation_to_userprofile_id'
            ])
            ->values($select);
        ;
        $params = [
            $invoice_id,
            $auditactivity,
            $audittype,
            $invoiceimage_source_name,
            $userprofile_id,
            $delegation_to_userprofile_id,
            $invoiceimage_id
        ];

        return $this->adapter->query($insert, $params);
    }

    public function logImageAdded($audittype, $auditactivity, $invoice_id, $invoiceimage_id, $userprofile_id, $delegation_to_userprofile_id) {
        $select = Select::get()->from('IMAGE_INDEX')
            ->columns([
                '1' => new Expression('?'),
                '2' => new Expression('?'),
                '3' => new Expression('?'),
                'image_index_name' => 'image_index_name',
                'image_index_date_entered' => 'image_index_date_entered',
                '5' => new Expression('?'),
                '6' => new Expression('?')
            ])
            ->where(
                Where::get()->equals('image_index_id', $invoiceimage_id)
            )
        ;
        $insert = Insert::get()->into($this->table)
            ->columns([
                'tablekey_id',
                'auditactivity_id',
                'audittype_id',
                'field_old_value',
                'DTS',
                'userprofile_id',
                'delegation_to_userprofile_id'
            ])
            ->values($select);
        ;
        $params = [
            $invoice_id,
            $auditactivity,
            $audittype,
            $userprofile_id,
            $delegation_to_userprofile_id,
            $invoiceimage_id
        ];

        return $this->adapter->query($insert, $params);
    }
}
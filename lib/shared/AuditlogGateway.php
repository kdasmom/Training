<?php
namespace NP\shared;

use NP\core\AbstractGateway;
use NP\core\db\Where;
use NP\core\db\Select;
use NP\core\db\Expression;
use NP\core\db\Insert;

class AuditlogGateway extends AbstractGateway {
    
    public function logImageUploaded($image_index_id_list, $tablekey_id, $auditactivity_id, $audittype_id) {
        $insert = Insert::get()
            ->into($this->table)
            ->columns([
                'tablekey_id',
                'auditactivity_id',
                'audittype_id',
                'field_old_value',
                'DTS',
                'field_name'
            ])
            ->values(
                Select::get()
                    ->columns([
                        new Expression($tablekey_id),
                        new Expression($auditactivity_id),
                        new Expression($audittype_id),
                        'image_index_name',
                        'image_index_date_entered',
                        new Expression("
                            CASE
                                WHEN imgs.invoiceimage_source_name = 'Local Scan' THEN ISNULL(t.userprofile_username, '')
                                ELSE imgs.invoiceimage_source_name
                            END
                        ")
                    ])
                    ->from(['img'=>'image_index'])
                        ->join(new \NP\image\sql\join\ImageIndexImageSourceJoin([], Select::JOIN_LEFT))
                        ->join(
                            [
                                't' => Select::get()
                                            ->column('invoiceimage_id')
                                            ->from(['imgt'=>'image_transfer'])
                                                ->join(new \NP\image\sql\join\ImageTransferUserprofileJoin(['userprofile_username'], Select::JOIN_INNER))
                            ],
                            'img.image_index_id = t.invoiceimage_id',
                            [],
                            Select::JOIN_LEFT
                        )
                    ->whereIn('img.image_index_id', $this->createPlaceholders($image_index_id_list))
                    ->whereNotExists(
                        Select::get()
                            ->from(['a'=>'auditlog'])
                            ->whereEquals('a.tablekey_id', '?')
                            ->whereEquals('a.auditactivity_id', '?')
                            ->whereEquals('a.audittype_id', '?')
                            ->whereEquals('a.field_old_value', 'img.image_index_name')
                            ->whereEquals('a.DTS', 'img.image_index_date_entered')
                    )
            );
        
        $params = array_merge($image_index_id_list, [$tablekey_id, $auditactivity_id, $audittype_id]);

        return $this->adapter->query($insert, $params);
    }

    public function logImageAdded($image_index_id_list, $userprofile_id, $delegation_to_userprofile_id, $tablekey_id, $auditactivity_id, $audittype_id, $vendorsite_id) {
        $now = \NP\util\Util::formatDateForDB();
        
        $insert = Insert::get()
            ->into($this->table)
            ->columns([
                'tablekey_id',
                'auditactivity_id',
                'audittype_id',
                'field_old_value',
                'DTS',
                'userprofile_id',
                'delegation_to_userprofile_id'
            ])
            ->values(
                Select::get()
                    ->columns([
                        new Expression($tablekey_id),
                        new Expression($auditactivity_id),
                        new Expression($audittype_id),
                        'image_index_name',
                        new Expression("'{$now}'"),
                        new Expression($userprofile_id),
                        new Expression($delegation_to_userprofile_id)
                    ])
                    ->from('image_index')
                    ->whereIn('image_index_id', $this->createPlaceholders($image_index_id_list))
                    ->whereNest('OR')
                        ->whereNotEquals('image_index_status', 1)
                        ->whereNotEquals('tablekey_id', '?')
                        ->whereNotEquals('image_index_vendorsite_id', '?')
                    ->whereUnnest()
            );
        
        $params = array_merge($image_index_id_list, [$tablekey_id, $vendorsite_id]);

        return $this->adapter->query($insert, $params);
    }

    public function logImageIndexed($image_index_id_list, $tablekey_id, $auditactivity_id, $audittype_id, $vendorsite_id) {
        $insert = Insert::get()
            ->into($this->table)
            ->columns([
                'tablekey_id',
                'auditactivity_id',
                'audittype_id',
                'field_old_value',
                'DTS',
                'userprofile_id',
                'field_name'
            ])
            ->values(
                Select::get()
                    ->columns([
                        new Expression($tablekey_id),
                        new Expression($auditactivity_id),
                        new Expression($audittype_id),
                        'image_index_name',
                        new Expression('
                            CASE
                                WHEN img.image_index_indexed_datetm IS NULL THEN img.image_index_date_entered
                                ELSE img.image_index_indexed_datetm
                            END
                        '),
                        'image_index_indexed_by'
                    ])
                    ->from(['img'=>'image_index'])
                        ->join(new \NP\image\sql\join\ImageIndexImageSourceJoin(['invoiceimage_source_name'], Select::JOIN_LEFT))
                    ->whereIn('img.image_index_id', $this->createPlaceholders($image_index_id_list))
                    ->whereNest('OR')
                        ->whereNest()
                            ->whereIsNotNull('img.image_index_indexed_datetm')
                            ->whereExists(
                                Select::get()
                                    ->from(['u'=>'userprofile'])
                                    ->whereEquals('u.userprofile_id', 'img.image_index_indexed_by')
                            )
                        ->whereUnnest()
                        ->whereIn('imgs.invoiceimage_source_name', "'NexusServices','Nexus Services'")
                    ->whereUnnest()
                    ->whereNest('OR')
                        ->whereNotEquals('img.image_index_status', 1)
                        ->whereNotEquals('img.tablekey_id', '?')
                        ->whereNotEquals('img.image_index_vendorsite_id', '?')
                    ->whereUnnest()
                    ->whereNotExists(
                        Select::get()
                            ->from(['a'=>'auditlog'])
                            ->whereEquals('a.tablekey_id', '?')
                            ->whereEquals('a.auditactivity_id', '?')
                            ->whereEquals('a.audittype_id', '?')
                            ->whereEquals('a.field_old_value', 'img.image_index_name')
                            ->whereEquals(
                                'a.DTS',
                                'CASE
                                    WHEN img.image_index_indexed_datetm IS NULL THEN img.image_index_date_entered
                                    ELSE img.image_index_indexed_datetm
                                END'
                            )
                    )
            );
        
        $params = array_merge($image_index_id_list, [$tablekey_id, $vendorsite_id, $tablekey_id, $auditactivity_id, $audittype_id]);

        return $this->adapter->query($insert, $params);
    }
}
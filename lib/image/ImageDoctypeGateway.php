<?php
namespace NP\image;

use NP\core\AbstractGateway;
use NP\core\db\Where;
use NP\core\db\Select;
use NP\core\db\Expression;

class ImageDoctypeGateway extends AbstractGateway {
    protected $table = 'image_doctype';

    protected $configService, $securityService;
    
    public function setConfigService(\NP\system\ConfigService $configService) {
        $this->configService = $configService;
    }

    public function setSecurityService(\NP\security\SecurityService $securityService) {
        $this->securityService = $securityService;
    }

    public function getIdByName($name) {
        $result = $this->find(
            Where::get()->equals(
                'image_doctype_name',
                '\''.$name.'\''
            ),
            [],
            null,
            ['image_doctype_id']
        );

        if (!empty($result) && !empty($result[0])) {
            return $result[0]['image_doctype_id'];
        }
        return null;
    }

    public function getIdByNames($names) {
        $result = $this->find(
            Where::get()->in(
                'image_doctype_name',
                '\''.implode('\',\'', $names).'\''
            ),
            [],
            null,
            ['image_doctype_id', 'image_doctype_name']
        );        

        if (!empty($result)) {
            $data = [];
            foreach($result as $key => $value) {
                $data[strtolower($value['image_doctype_name'])] = $value['image_doctype_id'];
            }
            return $data;
        }
        return null;
    }

    public function listDoctypes() {
        $webDocumentz = $this->configService->get('pn.main.WebDocumentz');
        
        $select = Select::get()
                        ->allColumns()
                        ->column(
                            new Expression("
                                CASE
                                    WHEN image_doctype_name = 'Utility Invoice' THEN 1
                                    ELSE image_doctype_id
                                END
                            "),
                            'image_doctype_sort'
                        )
                        ->from('image_doctype')
                        ->whereOr()
                        ->order('image_doctype_sort,image_doctype_name');

        if (($webDocumentz == '1' || $webDocumentz == '2') && $this->securityService->hasPermission(2081)) {
            $select->whereEquals('tableref_id', 1);
        }
        if ($webDocumentz == '2') {
            if ($this->securityService->hasPermission(2087)) {
                $select->whereIn('tableref_id', '3,7');
            }
            if ($this->securityService->hasPermission(2088)) {
                $select->whereEquals('tableref_id', 4);
            }
            if ($this->securityService->hasPermission(2089)) {
                $select->whereEquals('tableref_id', 2);
            }
            if ($this->securityService->hasPermission(6094)) {
                $select->whereEquals('tableref_id', 8);
            }
        }

        return $this->adapter->query($select);
    }

    public function getImageDoctypes($tablerefs) {
        if (!empty($tablerefs)) {
            $select = new Select();
            $select
                ->from($this->table)
                ->where(
                    Where::get()
                        ->greaterThan('universal_field_status', 0)
                        ->in('tableref_id', $tablerefs)
                )
            ;
            return $this->adapter->query($select);
        }
    }
}
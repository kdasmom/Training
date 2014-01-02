<?php
namespace NP\image;

use NP\core\AbstractGateway;
use NP\core\db\Where;
use NP\core\db\Select;

class ImageTablerefGateway extends AbstractGateway {
    protected $table = 'image_tableref';

    public function getIdByName($name) {
        $result = $this->find(
            Where::get()->equals(
                'image_tableref_name',
                '\''.$name.'\''
            ),
            [],
            null,
            ['image_tableref_id']
        );

        if (!empty($result) && !empty($result[0])) {
            return $result[0]['image_tableref_id'];
        }
        return null;
    }

    public function getIdByNames($names) {
        $result = $this->find(
            Where::get()->in(
                'image_tableref_name',
                '\''.implode('\',\'', $names).'\''
            ),
            [],
            null,
            ['image_tableref_id', 'image_tableref_name']
        );        

        if (!empty($result)) {
            $data = [];
            foreach($result as $key => $value) {
                $data[strtolower($value['image_tableref_name'])] = $value['image_tableref_id'];
            }
            return $data;
        }
        return null;
    }

}
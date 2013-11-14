<?php
namespace NP\image;

use NP\core\AbstractGateway;
use NP\core\db\Where;

class ImageDoctypeGateway extends AbstractGateway {
    protected $table = 'image_doctype';

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
}
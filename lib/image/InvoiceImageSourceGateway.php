<?php
namespace NP\image;

use NP\core\AbstractGateway;
use NP\core\db\Where;

class InvoiceImageSourceGateway extends AbstractGateway {
    protected $table = 'invoiceimagesource';

    public function getById($id) {
        $result = $this->find(
            Where::get()->equals(
                'invoiceimage_source_id',
                '\''.$id.'\''
            ),
            [],
            null,
            ['invoiceimage_source_name']
        );

        if (!empty($result) && !empty($result[0])) {
            return $result[0]['invoiceimage_source_name'];
        }
        return null;
    }

    public function getByName($name) {
        $result = $this->find(
            Where::get()->equals(
                'invoiceimage_source_name',
                '\''.$name.'\''
            ),
            [],
            null,
            ['Invoiceimage_source_id', 'IMAGESOURCE_id_alt']
        );

        if (!empty($result) && !empty($result[0])) {
            return [
                'source_id'     => $result[0]['Invoiceimage_source_id'],
                'source_id_alt' => $result[0]['IMAGESOURCE_id_alt']
            ];
        }
        return null;
    }
}
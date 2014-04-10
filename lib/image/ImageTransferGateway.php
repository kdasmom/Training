<?php
namespace NP\image;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Delete;

/**
 * Gateway for the IMAGE_TRANSFER table
 *
 * @author Thomas Messier
 */
class ImageTransferGateway extends AbstractGateway {
    protected $table = 'image_transfer';

    public function getByInvoiceImageId($invoiceimage_id) {
        $query = '
            SELECT
                tr.transfer_type,
                tr.transfer_filename
            FROM
                IMAGE_INDEX idx
                LEFT JOIN IMAGE_TRANSFER tr
                    ON idx.image_index_id = tr.invoiceimage_id
            WHERE
                idx.image_index_id = ' . $invoiceimage_id . '
        ';
        $result = $this->adapter->query($query);

        if (!empty($result) && !empty($result[0])) {
            return [
                'type' => $result[0]['transfer_type'],
                'filename' => $result[0]['transfer_filename']
            ];
        }
        return null;
    }
    public function deletePermanently($identifiers) {
        if (!empty($identifiers)) {
            $where = Where::get()
                ->in('invoiceimage_id', implode(',', $identifiers))
            ;
            $delete = new Delete($this->table, $where);

            return $this->adapter->query($delete);
        }
    }

    public function getFilesById($identifiers) {
        $select = Select::get()
            ->from($this->table)
            ->columns(['transfer_filename', 'invoiceimage_id'])
            ->where(
                Where::get()
                    ->in('invoiceimage_id', implode(',', $identifiers))
            )
        ;
        $files = $this->adapter->query($select);

        $result = [];
        if (!empty($files)) {
            foreach ($files as $values) {
                $result[$values['invoiceimage_id']] = $values['transfer_filename'];
            }
        }
        return $result;
    }
}
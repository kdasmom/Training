<?php

namespace NP\image;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Where;

class ImageToCDGateway extends AbstractGateway {
    protected $table = 'ImageToCD';

    public function getVendorDocs($doctype, $vendor_id = null) {
        $select = new Select();
        $select
            ->columns([
                'image_scan_datetm',
                'ImageToCD_diskNum'
            ])
            ->from(['itcd' => $this->table])
                ->join(['ii' => 'IMAGE_INDEX'], 'ii.image_index_ID = itcd.image_index_ID', ['image_index_amount'], Select::JOIN_INNER)
                ->join(['idoc' => 'IMAGE_DOCTYPE'], 'idoc.image_doctype_id = ii.image_doctype_id', ['image_doctype_name'], Select::JOIN_INNER)

                ->join(['vs' => 'VENDORSITE'], 'ii.tablekey_id = vs.vendorsite_id', [], Select::JOIN_INNER)
                ->join(['v' => 'VENDOR'], 'vs.vendor_id = v.vendor_id', ['vendor_name'], Select::JOIN_INNER)
        ;

        $where = new Where();
        $where
            ->equals('ii.tableref_id', 2)
            ->equals('ii.image_doctype_id', $doctype)
            ->equals('ii.Image_Index_Status', 1)
        ;

        if (!empty($vendor_id)) {
            $where->equals('v.vendor_id', $vendor_id);
        }
        $select->where($where);
        return $this->adapter->query($select);
    }

    public function getInvoiceDocs($doctype = 1, $refnumber = null, $property_id = null, $vendor_id = null) {
        $select = new Select();
        $select
            ->columns([
                'image_scan_datetm',
                'ImageToCD_diskNum'
            ])
            ->from(['itcd' => $this->table])
                ->join(['ii' => 'IMAGE_INDEX'], 'ii.image_index_ID = itcd.image_index_ID', ['image_index_amount'], Select::JOIN_INNER)
                ->join(['idoc' => 'IMAGE_DOCTYPE'], 'idoc.image_doctype_id = ii.image_doctype_id', ['image_doctype_name'], Select::JOIN_INNER)

                ->join(['i' => 'invoice'], 'itcd.Tablekey_Id = i.invoice_ID', ['create_dt' => 'invoice_createddatetm', 'ref_number' => 'invoice_ref'], Select::JOIN_INNER)
                ->join(['p' => 'property'], 'p.property_id = i.property_id', [], Select::JOIN_INNER)
                ->join(['vs' => 'VENDORSITE'], 'i.paytablekey_id = vs.vendorsite_id', [], Select::JOIN_INNER)

                ->join(['v' => 'VENDOR'], 'vs.vendor_id = v.vendor_id', ['vendor_name'], Select::JOIN_INNER)
        ;

        if (empty($doctype)) {
            $doctype = 1;
        }
        
        $where = new Where();
        $where
            ->equals('itcd.table_name', '\'invoice\'')
            ->equals('ii.Image_Index_Status', 1)
            ->equals('ii.image_doctype_id', $doctype)
        ;

        if (!empty($refnumber)) {
            $where
                ->like('i.invoice_ref', '\''.$refnumber.'\'')
            ;
        }
        if (!empty($property_id)) {
            $where
                ->equals('p.property_id', $property_id);
        }
        if (!empty($vendor_id)) {
            $where
                ->equals('v.vendor_id', $vendor_id);
        }
        $select->where($where);
print_r($select->toString());
        return $this->adapter->query($select);
    }

    public function getPurchaseOrderDocs($doctype = 2, $refnumber = null, $property_id = null, $vendor_id = null) {
        $select = new Select();
        $select
            ->columns([
                'image_scan_datetm',
                'ImageToCD_diskNum'
            ])
            ->from(['itcd' => $this->table])
                ->join(['ii' => 'IMAGE_INDEX'], 'ii.image_index_ID = itcd.image_index_ID', ['image_index_amount'], Select::JOIN_INNER)
                ->join(['idoc' => 'IMAGE_DOCTYPE'], 'idoc.image_doctype_id = ii.image_doctype_id', ['image_doctype_name'], Select::JOIN_INNER)

                ->join(['po' => 'purchaseorder'], 'itcd.Tablekey_Id = po.purchaseorder_ID', ['create_dt' => 'purchaseorder_created', 'ref_number' => 'purchaseorder_ref'], Select::JOIN_INNER)
                ->join(['p' => 'property'], 'p.property_id = po.property_id', [], Select::JOIN_INNER)
                ->join(['vs' => 'VENDORSITE'], 'po.vendorsite_id = vs.vendorsite_id', [], Select::JOIN_INNER)

                ->join(['v' => 'VENDOR'], 'vs.vendor_id = v.vendor_id', ['vendor_name'], Select::JOIN_INNER)
        ;

        if (empty($doctype)) {
            $doctype = 2;
        }

        $where = new Where();
        $where
            ->equals('itcd.table_name', '\'purchaseorder\'')
            ->equals('ii.image_doctype_id', $doctype)
        ;

        if (!empty($refnumber)) {
            $where
                ->like('po.purchaseorder_ref', '\''.$refnumber.'\'')
            ;
        }
        if (!empty($property_id)) {
            $where
                ->equals('p.property_id', $property_id);
        }
        if (!empty($vendor_id)) {
            $where
                ->equals('v.vendor_id', $vendor_id);
        }
        $select->where($where);
        return $this->adapter->query($select);
    }

    public function getVendorEstimateDocs($doctype = 3, $refnumber = null, $property_id = null, $vendor_id = null) {
        $select = new Select();
        $select
            ->columns([
                'image_scan_datetm',
                'ImageToCD_diskNum'
            ])
            ->from(['itcd' => $this->table])
                ->join(['ii' => 'IMAGE_INDEX'], 'ii.image_index_ID = itcd.image_index_ID', ['image_index_amount'], Select::JOIN_INNER)
                ->join(['idoc' => 'IMAGE_DOCTYPE'], 'idoc.image_doctype_id = ii.image_doctype_id', ['image_doctype_name'], Select::JOIN_INNER)

                ->join(['vef' => 'vendorest'], 'itcd.Tablekey_Id = vef.vendorest_ID', ['create_dt' => 'vendorest_date_created', 'ref_number' => 'vendorest_ref'], Select::JOIN_INNER)
                ->join(['p' => 'property'], 'p.property_id = vef.property_id', [], Select::JOIN_INNER)
                ->join(['vs' => 'VENDORSITE'], 'vef.vendorsite_id = vs.vendorsite_id', [], Select::JOIN_INNER)

                ->join(['v' => 'VENDOR'], 'vs.vendor_id = v.vendor_id', ['vendor_name'], Select::JOIN_INNER)
        ;

        if (empty($doctype)) {
            $doctype = 3;
        }

        $where = new Where();
        $where
            ->equals('itcd.table_name', '\'vendorest\'')
            ->equals('ii.image_doctype_id', $doctype)
        ;

        if (!empty($refnumber)) {
            $where
                ->like('vef.vendorest_ref', '\''.$refnumber.'\'')
            ;
        }
        if (!empty($property_id)) {
            $where
                ->equals('p.property_id', $property_id);
        }
        if (!empty($vendor_id)) {
            $where
                ->equals('v.vendor_id', $vendor_id);
        }
        $select->where($where);
        return $this->adapter->query($select);
    }
}

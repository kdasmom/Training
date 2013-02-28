<?php
namespace NP\tests\core\db;

class SelectTest extends \PHPUnit_Framework_TestCase {
    public function testToString() {
    	// Test with columns, join, and where
    	$whereStub = $this->getMock('\NP\core\db\Where');
        $whereStub->expects($this->any())
                        ->method('toString')
                        ->will($this->returnValue('(i.invoice_id = :invoice_id)'));

		$tableStub = $this->getMock('\NP\core\db\Table', array(), array(), '', FALSE);
        $tableStub->expects($this->any())
                        ->method('toString')
                        ->will($this->returnValue('invoice i'));
        
        $tableStub->expects($this->any())
                        ->method('getColumnPrefix')
                        ->will($this->returnValue('i'));

		$joinTableStub = $this->getMock('\NP\core\db\Table', array(), array(), '', FALSE);
        $joinTableStub->expects($this->any())
                        ->method('toString')
                        ->will($this->returnValue('invoiceitem ii'));
        
        $joinTableStub->expects($this->any())
                        ->method('getColumnPrefix')
                        ->will($this->returnValue('ii'));

        $select = new \NP\core\db\Select();
        $select->from($tableStub)
        		->columns(array('invoice_id','invoice_ref','invoice_status'))
        		->join($joinTableStub, 'i.invoice_id = ii.invoice_id', array('invoiceitem_amount','glaccount_id'), 'LEFT')
        		->where($whereStub);

        $this->assertEquals("SELECT i.invoice_id,i.invoice_ref,i.invoice_status,ii.invoiceitem_amount,ii.glaccount_id FROM invoice i LEFT JOIN invoiceitem ii ON i.invoice_id = ii.invoice_id WHERE (i.invoice_id = :invoice_id)", $select->toString());

        // Test group
        $groupStub = $this->getMock('\NP\core\db\Group', array(), array(), '', FALSE);
        $groupStub->expects($this->any())
                        ->method('toString')
                        ->will($this->returnValue('i.invoice_ref'));

        $expressionStub = $this->getMock('\NP\core\db\Expression', array(), array(), '', FALSE);
        $expressionStub->expects($this->any())
                        ->method('toString')
                        ->will($this->returnValue('SUM(ii.invoiceitem_amount+ii.invoiceitem_shipping+ii.invoiceitem_salestax) AS invoice_amount'));

        $select = new \NP\core\db\Select();
        $select->from($tableStub)
        		->columns(array('invoice_ref', $expressionStub))
        		->join($joinTableStub, 'i.invoice_id = ii.invoice_id', array())
        		->group($groupStub);

        $this->assertEquals("SELECT i.invoice_ref,SUM(ii.invoiceitem_amount+ii.invoiceitem_shipping+ii.invoiceitem_salestax) AS invoice_amount FROM invoice i INNER JOIN invoiceitem ii ON i.invoice_id = ii.invoice_id GROUP BY i.invoice_ref", $select->toString());
        
        // Test order
        $orderStub = $this->getMock('\NP\core\db\Order', array(), array(), '', FALSE);
        $orderStub->expects($this->any())
                        ->method('toString')
                        ->will($this->returnValue('i.invoice_ref'));

        $select = new \NP\core\db\Select();
        $select->from($tableStub)
        		->order($orderStub);

        $this->assertEquals("SELECT i.* FROM invoice i ORDER BY i.invoice_ref", $select->toString());
    }
}
?>
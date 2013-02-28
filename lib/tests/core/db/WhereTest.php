<?php
namespace NP\tests\core\db;

class WhereTest extends \PHPUnit_Framework_TestCase {
    public function testToString() {
        // String constructor
        $where = new \NP\core\db\Where("invoice_id = 3");
        $this->assertEquals("(invoice_id = 3)", $where->toString());

        // Array constructor
        $where = new \NP\core\db\Where(array('invoice_status'=>':invoice_status', 'invoice_amount'=>50));
        $this->assertEquals("(invoice_status = :invoice_status AND invoice_amount = 50)", $where->toString());

        // Test OR
        $where = new \NP\core\db\Where(array('invoice_status'=>':invoice_status', 'invoice_amount'=>50), 'OR');
        $this->assertEquals("(invoice_status = :invoice_status OR invoice_amount = 50)", $where->toString());

        // Test equals
        $where = new \NP\core\db\Where();
        $where->equals('invoice_status', ':invoice_status');
        $this->assertEquals("(invoice_status = :invoice_status)", $where->toString());

        // Test notEquals
        $where = new \NP\core\db\Where();
        $where->notEquals('invoice_status', ':invoice_status');
        $this->assertEquals("(invoice_status <> :invoice_status)", $where->toString());

        // Test in
        $where = new \NP\core\db\Where();
        $where->in('invoice_status', ':invoice_status');
        $this->assertEquals("(invoice_status IN (:invoice_status))", $where->toString());

        // Test notIn
        $where = new \NP\core\db\Where();
        $where->notIn('invoice_status', ':invoice_status');
        $this->assertEquals("(invoice_status NOT IN (:invoice_status))", $where->toString());

        // Test like
        $where = new \NP\core\db\Where();
        $where->like('invoice_status', ':invoice_status');
        $this->assertEquals("(invoice_status LIKE :invoice_status)", $where->toString());

        // Test between
        $where = new \NP\core\db\Where();
        $where->between('invoice_status', ':invoice_status', ':invoice_status2');
        $this->assertEquals("(invoice_status BETWEEN :invoice_status AND :invoice_status2)", $where->toString());

        // Test greaterThan
        $where = new \NP\core\db\Where();
        $where->greaterThan('invoice_amount', ':invoice_amount');
        $this->assertEquals("(invoice_amount > :invoice_amount)", $where->toString());

        // Test greaterThanOrEqual
        $where = new \NP\core\db\Where();
        $where->greaterThanOrEqual('invoice_amount', ':invoice_amount');
        $this->assertEquals("(invoice_amount >= :invoice_amount)", $where->toString());

        // Test lessThan
        $where = new \NP\core\db\Where();
        $where->lessThan('invoice_amount', ':invoice_amount');
        $this->assertEquals("(invoice_amount < :invoice_amount)", $where->toString());

        // Test lessThanOrEqual
        $where = new \NP\core\db\Where();
        $where->lessThanOrEqual('invoice_amount', ':invoice_amount');
        $this->assertEquals("(invoice_amount <= :invoice_amount)", $where->toString());

        // Complex where clause with multiple operators and subqueries
        $amountSelectStub = $this->getMock('\NP\core\db\Select');
        $amountSelectStub->expects($this->any())
                        ->method('toString')
                        ->will($this->returnValue('SELECT SUM(ii.invoiceitem_amount+ii.invoiceitem_salestax+ii.invoiceitem_shipping) FROM invoiceitem ii WHERE (ii.invoice_id = i.invoice_id)'));
        
        $where = new \NP\core\db\Where();
        
        $where->equals('invoice_status', "'open'")
            ->nest('OR')
            ->like('invoice_ref', ":invoice_ref")
            ->greaterThan('control_amount', 50)
            ->unnest()
            ->lessThanOrEqual($amountSelectStub, 200);
        $this->assertEquals("(invoice_status = 'open' AND (invoice_ref LIKE :invoice_ref OR control_amount > 50) AND (SELECT SUM(ii.invoiceitem_amount+ii.invoiceitem_salestax+ii.invoiceitem_shipping) FROM invoiceitem ii WHERE (ii.invoice_id = i.invoice_id)) <= 200)", $where->toString());
    }
}
?>
<?php
namespace NP\tests\core\db;

class ExpressionTest extends \PHPUnit_Framework_TestCase {
    public function testToString() {
        $expression = new \NP\core\db\Expression("SUM(invoiceitem_amount+invoiceitem_shipping+invoiceitem_salestax)");
        $this->assertEquals("SUM(invoiceitem_amount+invoiceitem_shipping+invoiceitem_salestax)", $expression->toString());

        $expression = new \NP\core\db\Expression(5);
        $this->assertEquals("5", $expression->toString());

        $expression = new \NP\core\db\Expression(10.12);
        $this->assertEquals("10.12", $expression->toString());
    }
}
?>
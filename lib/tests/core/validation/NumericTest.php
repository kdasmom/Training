<?php
namespace NP\tests\core\validation;

class NumericTest extends \PHPUnit_Framework_TestCase {
    public function testIsValid() {
        $validator = new \NP\core\validation\Numeric();
        $this->assertEquals(true, $validator->isValid(4));
        $this->assertEquals(true, $validator->isValid(4.3));
        $this->assertEquals(true, $validator->isValid(-4.3));
        $this->assertEquals(true, $validator->isValid("4,000.3"));
        $this->assertEquals(true, $validator->isValid("-4,000.3"));
        $this->assertEquals(false, $validator->isValid("invalid"));
        $this->assertEquals(false, $validator->isValid("20,00"));
        $this->assertEquals(false, $validator->isValid("2000.34.12"));
    }
}
?>
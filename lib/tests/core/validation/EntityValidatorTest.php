<?php
namespace NP\tests\core\validation;

class EntityValidatorTest extends \PHPUnit_Framework_TestCase {
    protected function getEntityStub() {
        $stub = $this->getMock('\NP\core\AbstractEntity', array('getFields','toArray'), array(), '', false);
        
        $stub->expects($this->any())
             ->method('getFields')
             ->will($this->returnValue(array(
                'entity_id'     => array(),
                'fk_id'    => array(
                    'required'   => true,
                    'validation' => array('digits' => array())
                ),
                'options' => array(
                    'validation' => array(
                        'inArray' => array(
                            'haystack' => array('option1','option2','option3')
                        )
                    ),
                )
             )));

        return $stub;
    }

    public function testValidate() {
        $stub = $this->getEntityStub();
        $stub->expects($this->any())
             ->method('toArray')
             ->will($this->returnValue(array(
                'entity_id' => 1,
                'fk_id'     => 1,
                'options'   => 'option1'
             )));

        $entityValidator = new \NP\core\validation\EntityValidator();

        $this->assertTrue($entityValidator->validate($stub));
    }
    
    public function testValidate2() {
        $stub = $this->getEntityStub();
        $stub->expects($this->any())
             ->method('toArray')
             ->will($this->returnValue(array(
                'entity_id' => 1,
                'fk_id'     => 1,
                'options'   => 'option4'
             )));

        $entityValidator = new \NP\core\validation\EntityValidator();

        $this->assertFalse($entityValidator->validate($stub));
    }
}
?>
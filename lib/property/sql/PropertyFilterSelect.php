<?php

namespace NP\property\sql;

use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

use NP\property\PropertyContext;

use NP\util\Util;

/**
 * A custom Select object for filtering by property based on a certain context
 *
 * @author Thomas Messier
 */
class PropertyFilterSelect extends Select {
	
	/**
	 * @param \NP\core\property\PropertyContext $propertyContext
	 */
	public function __construct(PropertyContext $propertyContext) {
		// If Current Property is selected, all we need is a simple SELECT {property_id} AS property_id statement
		if ($propertyContext->getType() == 'property') {
			$this->column(new Expression($propertyContext->getSelection()), 'property_id');
		// For Region and All Properties, we need a more complex statement
		} else {
			// Initialize some commonly needed objects
			$subSelect = new Select();
			$where = new Where();

			// If the user ID and delegationToUserId are the same, it means there's no delegation happening
			if ($propertyContext->getUserId() == $propertyContext->getDelegationToUserId()) {
				// Build the subselect, which is the same for Region and All
				$subSelect->from(array('__propuser'=>'propertyuserprofile'))
						->column('property_id')
						->where(array(
							'__propuser.property_id'    => '__prop.property_id',
							'__propuser.userprofile_id' => $propertyContext->getUserId()
						));
				// Add the subselect to the WHERE clause
				$where->exists($subSelect);

				// Create the basic SELECT statement, omitting the WHERE because it will be modified if dealing with region
				$this->from(array('__prop'=>'property'))
					->column('property_id');
			// If the user ID and delegationToUserId are different, delegation is being used
			} else {
				// Build the subselect, which is the same for Region and All
				$subSelect->from(array('__propuser'=>'propertyuserprofile'))
						->column('property_id')
						->where(array(
							'__propuser.property_id'    => '__delegProp.property_id',
							'__propuser.userprofile_id' => '__deleg.userprofile_id'
						));

				// Build the WHERE clause
				$where->equals('__deleg.userprofile_id', $propertyContext->getUserId())
					->equals('__deleg.delegation_to_userprofile_id', $propertyContext->getDelegationToUserId())
					->equals('__deleg.delegation_status', 1)
					->equals('__deleg.delegation_startdate', Util::formatDateForDB(time()))
					->equals('__deleg.delegation_stopdate', Util::formatDateForDB(time()))
					->exists($subSelect);

				// Create the basic SELECT statement, omitting the WHERE because it will be modified if dealing with region
				$this->from(array('__deleg'=>'delegation'))
						->column('property_id')
						->join(array('__delegProp'=>'delegationprop'),
							'__deleg.delegation_id = __delegProp.delegation_id',
							array())
						->join(array('__prop'=>'property'),
							'__delegProp.property_id = __prop.property_id',
							array());
			}

			// If dealing with regions, we always need to filter by region_id in the WHERE clause
			if ($propertyContext->getType() == 'region') {
				$where->equals('__prop.region_id', $propertyContext->getSelection());
			}

			// Now we can add the completed WHERE clause to the SELECT statement
			$this->where($where);
		}
	}
}

?>
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
		$selection = $propertyContext->getSelection();

		// If Current Property is selected, all we need is a simple SELECT {property_id} AS property_id statement
		if ($propertyContext->getType() == 'property') {
			$property_id_list = $selection;
			if (is_array($selection)) {
				$property_id_list = implode(' UNION ALL SELECT ', $selection);
			}
			$this->column(new Expression($property_id_list));
		// For Region and All Properties, we need a more complex statement
		} else {
			// Initialize some commonly needed objects
			$subSelect = new Select();
			$where = new Where();

			// If the user ID and delegationToUserId are the same, it means there's no delegation happening
			if ($propertyContext->getUserId() == $propertyContext->getDelegationToUserId()) {
				// Build the subselect, which is the same for Region and All
				$subSelect->from(['__propuser'=>'propertyuserprofile'])
						->column('property_id')
						->where(['__propuser.userprofile_id' => $propertyContext->getUserId()]);

				if ($propertyContext->includeCoding()) {
					$where->nest('OR')
							->in('__prop.property_id', $subSelect)
							->in(
								'__prop.property_id',
								Select::get()->from(['__propusercoding'=>'propertyusercoding'])
											->column('property_id')
											->where(['__propusercoding.userprofile_id' => $propertyContext->getUserId()])
							)
						->unnest();
				} else {
					// Add the subselect to the WHERE clause
					$where->in('__prop.property_id', $subSelect);
				}

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
					->equals('__deleg.delegation_startdate', "'" . Util::formatDateForDB() . "'")
					->equals('__deleg.delegation_stopdate', "'" . Util::formatDateForDB() . "'")
					->exists($subSelect);

				// Create the basic SELECT statement, omitting the WHERE because it will be modified if dealing with region
				$this->from(array('__deleg'=>'delegation'))
//						->column('property_id')
						->columns([])
						->join(array('__delegProp'=>'delegationprop'),
							'__deleg.delegation_id = __delegProp.delegation_id',
							array('property_id'))
						->join(array('__prop'=>'property'),
							'__delegProp.property_id = __prop.property_id',
							array());
			}

			// If dealing with regions, we always need to filter by region_id in the WHERE clause
			if ($propertyContext->getType() == 'region') {
				if (is_array($selection)) {
					$where->in('__prop.region_id', implode(',', $selection));
				} else {
					$where->equals('__prop.region_id', $selection);
				}
			}
			// Else if dealing with 'all', we also need to check if filtering by property_status
			else {
				$property_status = $propertyContext->getPropertyStatus();
				if ($property_status !== null) {
					if (count($property_status) > 1) {
						// We only want to filter if not all statuses are included
						if (!in_array(1, $property_status) || !in_array(-1, $property_status) || !in_array(0, $property_status)) {
							$where->in('__prop.property_status', implode(',', $property_status));
						}
					} else {
						$where->equals('__prop.property_status', $property_status[0]);
					}
				}
			}

			// Now we can add the completed WHERE clause to the SELECT statement
			$this->where($where);
		}
	}
}

?>
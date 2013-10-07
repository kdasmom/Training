<?php

namespace NP\system;

use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\core\db\Update;
use NP\invoice\InvoicePaymentTypeGateway;
use NP\property\RegionGateway;
use NP\property\RegionEntity;

/**
 * Service class for operations related to pick lists
 *
 * @author Thomas Messier
 */
class PicklistService extends AbstractService {
	protected $configService, $integrationPackageGateway, $regionGateway, $invoicePaymentTypeGateway;

	public function __construct(IntegrationPackageGateway $integrationPackageGateway, RegionGateway $regionGateway,
								InvoicePaymentTypeGateway $invoicePaymentTypeGateway) {
		$this->integrationPackageGateway = $integrationPackageGateway;
		$this->regionGateway             = $regionGateway;
		$this->invoicePaymentTypeGateway = $invoicePaymentTypeGateway;
	}

	public function setConfigService(ConfigService $configService) {
		$this->configService = $configService;
	}
	
	/**
	 * Generic function to load a picklist
	 *
	 * @param  string $entityType The name of the class for the entity
	 * @return array
	 */
	public function getList($entityType) {
		$gatewayName = $this->getGatewayName($entityType);

		return $this->$gatewayName->find();
	}

	/**
	 * Generic function to save a picklist; bear in mind this function requires that the proper gateway
	 * and entity classes be setup
	 *
	 * @param  string $entityType The name of the class for the entity
	 * @param  array  $data       The entity data to be saved
	 * @return array              Success status of the operation and any errors
	 */
	public function save($data) {
		$namespace = explode('.', $data['entityType']);
		$entityType = array_pop($namespace);
		$namespace = implode('\\', $namespace);
		$entityClass = "\\NP\\{$namespace}\\" . $entityType . 'Entity';

		// Generate an entity object
		$entity = new $entityClass($data[strtolower($entityType)]);

		// Set the asp_client_id if one exists
		if (array_key_exists('asp_client_id', $entity->getFields())) {
			$entity->asp_client_id = $this->configService->getClientId();
		}

		// Use a generic validator to validate the entity
		$errors    = $this->entityValidator->validate($entity);

		// If there are no errors, proceed with attempting to save
		if (!count($errors)) {
			// Get a gateway based on the entity name
			$gatewayName = $this->getGatewayName($entityType);

			// Begin the transaction
			$this->$gatewayName->beginTransaction();
			try {
				// If we have a universal_field_status and the entity being saved is being set as the default, we need
				// to make sure the other records in the table are reset to active status (we can only have one default)
				if (array_key_exists('universal_field_status', $entity->getFields()) && $entity->universal_field_status == 2) {
					$this->$gatewayName->update(array('universal_field_status'=>1), 'universal_field_status = ?', array(2));
				}

				// Save the picklist item
				$this->$gatewayName->save($entity);

				// Commit the transaction
				$this->$gatewayName->commit();
			} catch(\Exception $e) {
				$this->$gatewayName->rollback();
				$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
			}
		}

		$pk = $this->$gatewayName->getPk();
		return array(
			'success' => (count($errors)) ? false : true,
			'errors'  => $errors,
			'id'      => $entity->$pk
		);
	}

	/**
	 * Generic function to activate picklist items
	 */
	public function activate($entityType, $itemIds) {
		return $this->changeStatus($entityType, $itemIds, 1);
	}

	/**
	 * Generic function to inactivate picklist items
	 */
	public function inactivate($entityType, $itemIds) {
		return $this->changeStatus($entityType, $itemIds, 0);
	}

	/**
	 * Generic function to change status of picklist items
	 */
	public function changeStatus($entityType, $itemIds, $universal_field_status) {
		$gatewayName = $this->getGatewayName($entityType);
		$update = new Update();
		$update->table($this->$gatewayName->getTable())
				->value('universal_field_status', $universal_field_status)
				->whereIn($this->$gatewayName->getPk(), $this->$gatewayName->createPlaceholders($itemIds));

		$this->$gatewayName->getAdapter()->query($update, $itemIds);

		return array(
			'success' => true,
			'error'   => ''
		);
	}

	/**
	 * Get a gateway name based on an entity type
	 */
	public function getGatewayName($entityType) {
		$gatewayName = lcfirst($this->getEntityName($entityType)) . 'Gateway';

		return $gatewayName;
	}

	/**
	 * Get a gateway name based on an entity type
	 */
	public function getEntityName($entityType) {
		$entityType = explode('.', $entityType);
		$entityType = array_pop($entityType);

		return $entityType;
	}
}

?>
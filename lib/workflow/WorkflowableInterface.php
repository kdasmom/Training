<?php
namespace NP\workflow;

/**
 * Interface for a workflowable object
 *
 * @author Thomas Messier
 */
interface WorkflowableInterface {
	public function getAmount();
	public function getPropertyId();
}
<?php

namespace NP\system;

use NP\core\AbstractService;
use NP\core\validation\EntityValidator;

/**
 * Service class for operations related to messages to be sent by Message Center
 *
 * @author Thomas Messier
 */
class MessageService extends AbstractService {
	
	protected $userMessageGateway, $userMessageRecipientGateway;
	
	public function __construct(UserMessageGateway $userMessageGateway, UserMessageRecipientGateway $userMessageRecipientGateway) {
		$this->userMessageGateway          = $userMessageGateway;
		$this->userMessageRecipientGateway = $userMessageRecipientGateway;
	}

	/**
	 * Returns all user messages in the system
	 */
	public function getAllMessages($pageSize=null, $page=null, $sort="createdAt") {
		return $this->userMessageGateway->find(null, array(), $sort,  null, $pageSize, $page);
	}

	/**
	 * Get a message
	 *
	 * @param  int   $id
	 * @return array 
	 */
	public function getMessage($id) {
		$res = $this->userMessageGateway->findById($id);
		
		// Remove the minutes/seconds from the sentAt, since some old records were saved with wrong times
		$sentAt = \DateTime::createFromFormat('Y-m-d H:i:s.u', $res['sentAt']);
		$sentAt = $sentAt->format('Y-m-d H:00:00.000');
		$res['sentAt'] = $sentAt;

		// Get message recipients
		$recipients = $this->getMessageRecipients($id);

		// Determine the recipient type and which key to store the recipients in
		$recipientType = 'all';
		$users = array();
		$roles = array();
		if (count($recipients)) {
			if (is_numeric($recipients[0]['role_id'])) {
				$recipientType = 'roles';
				$users = array();
				$roles = \NP\util\Util::valueList($recipients, 'role_id');
			} else if (is_numeric($recipients[0]['userprofile_id'])) {
				$recipientType = 'users';
				$users = \NP\util\Util::valueList($recipients, 'userprofile_id');
				$roles = array();
			}
		}

		$res['recipientType'] = $recipientType;
		$res['users'] = $users;
		$res['roles'] = $roles;

		return $res;
	}

	/**
	 * Gets message recipients
	 *
	 * @param  int   $usermessage_id
	 * @return array
	 */
	public function getMessageRecipients($usermessage_id) {
		return $this->userMessageRecipientGateway->find('usermessage_id = ?', array($usermessage_id), 'role_name,person_lastname');
	}

	/**
	 * Saves a user message
	 */
	public function saveMessage($data) {
		// Create the entity
		$userMessage = new UserMessageEntity($data['usermessage']);

		// If dealing with a new record, set the created Date and user
		$now = \NP\util\Util::formatDateForDB();
		if ($userMessage->id === null) {
			$userMessage->createdBy = $data['userprofile_id'];
			$userMessage->createdAt = $now;
		}

		$validator   = new EntityValidator();
		$validator->validate($userMessage);
		$errors      = $validator->getErrors();

		if (!count($errors)) {
			$this->userMessageGateway->beginTransaction();

			try {
				$this->userMessageGateway->save($userMessage);

				// Delete all recipients
				$this->userMessageRecipientGateway->delete('UserMessage_id = ?', array($userMessage->id));

				// Insert all new recipients
				$recipientType = $data['recipientType'];
				if ($recipientType != 'all') {
					$col = ($recipientType == 'roles') ? 'role_id' : 'userprofile_id';
					foreach ($data[$recipientType] as $val) {
						$userMessageRecipient = new UserMessageRecipientEntity(array(
							'UserMessage_id' =>$userMessage->id,
							$col             =>$val
						));
						$this->userMessageRecipientGateway->save($userMessageRecipient);
					}
				}

				$this->userMessageGateway->commit();
			} catch(\Exception $e) {
				// If there was an error, rollback the transaction
				$this->userMessageGateway->rollback();
				// Add a global error to the error array
				$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
			}
		}

		return array(
			'success'    => (count($errors)) ? false : true,
			'errors'     => $errors,
		);
	}

	/**
	 * Deletes a user message
	 */
	public function deleteMessage($id) {
		$this->userMessageGateway->beginTransaction();

		$success = true;
		try {
			// Delete all recipients
			$this->userMessageRecipientGateway->delete('UserMessage_id = ?', array($id));

			// Delete the message
			$this->userMessageGateway->delete('id = ?', array($id));

			$this->userMessageGateway->commit();
		} catch(\Exception $e) {
			// If there was an error, rollback the transaction
			$this->userMessageGateway->rollback();
			// Add a global error to the error array
			$success = false;
		}

		return $success;
	}
}

?>
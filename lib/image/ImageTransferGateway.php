<?php

namespace NP\image;

use NP\core\AbstractGateway;

/**
 * Gateway for the IMAGE_TRANSFER table
 *
 * @author Thomas Messier
 */
class ImageTransferGateway extends AbstractGateway {
	protected $table = 'image_transfer';
}

?>
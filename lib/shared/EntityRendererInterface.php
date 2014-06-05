<?php

namespace NP\shared;

/**
 * Renderer interface for entities (invoices, POs)
 *
 * @author Thomas Messier
 */
interface EntityRendererInterface {
	public function render();
}
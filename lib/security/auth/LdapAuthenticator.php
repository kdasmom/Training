<?php

namespace NP\security\auth;

/**
 * Class to performan LDAP authentication.
 *
 * @author Thomas Messier
 */
class LdapAuthenticator extends AbstractAuthenticator implements AuthenticatorInterface {

	protected $host, $port, $protocol = 3, $domain;

	public function authenticate() {
		// Connect to LDAP to authenticate the user
		$conn = ldap_connect($this->host, $this->port);
		ldap_set_option($conn, LDAP_OPT_PROTOCOL_VERSION, $this->protocol);

		// Bind to the ldap server to test credentials (suppress warnings here)
		$bind = @ldap_bind($conn, "{$this->domain}\\{$this->getUsername()}", $this->getPassword());

		// If binding fails, add to errors
		if (!$bind) {
			$this->errors[] = ldap_error($conn);
		}

		// Return success/failure
		return count($this->errors) ? false : true;
	}

	public function setHost($host) {
		$this->host = $host;
	}

	public function setPort($port) {
		$this->port = $port;
	}

	public function setProtocol($protocol) {
		$this->protocol = $protocol;
	}

	public function setDomain($domain) {
		$this->domain = $domain;
	}
}

?>
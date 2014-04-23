<?php

namespace NP\locale;

use NP\system\LoggingService;

/**
 * Service class for translating text
 *
 * @author Thomas Messier
 */
class LocalizationService {
	protected $defaultLocale, $locale, $loggingService, $dictionaries;

	public function __construct($locale, LoggingService $loggingService) {
		$this->loggingService = $loggingService;

		// Set english as the default locale
		$this->defaultLocale = 'En';
		$this->locale = $locale;
		$this->dictionaries = array();
	}


	/**
	 * DEPRECATED, use translate() instead
	 */
	public function getMessage($messageName, $locale=null) {
		return $this->translate($messageName, $locale);
	}

	/**
	 * Get an error message in the locale specified or the default locale
	 *
	 * @param  string $phrase Phrase to translate
	 * @param  string $locale Specific locale to retrieve message for, if not specified will use the one setup with the service
	 * @return string
	 */
	public function translate($phrase, $locale=null) {
		// If no locale is passed, use the one setup with the service
		if ($locale === null) {
			$locale = $this->locale;
		}
		
		// Try to get the message for the locale requested
		try {
			$msg = $this->getDictionary($locale)->getMessage($phrase);
		// If the message doesn't exist for the locale requested, get it from the default locale
		} catch(\Exception $e) {
			try {
				$msg = $this->getDictionary($this->defaultLocale)->getMessage($phrase);
			// If the mesage is not found in the default dictionary, just return the message name
			} catch(\Exception $e2) {
				$msg = $phrase;
			}
		}
		
		return $msg;
	}

	/**
	 * Returns a dictionary for a specified locale
	 *
	 * @param  string $locale Name of the locale
	 * @return \NP\locale\Dictionary
	 */
	public function getDictionary($locale) {
		$localeAlias = strtolower($locale);

		// Check if the dictionary has already been created, if not create it
		if (!array_key_exists($localeAlias, $this->dictionaries)) {
			$dictionaryClass = '\NP\locale\lang\\' . ucfirst($locale);
			// If dictionary class exists, create it
			if (class_exists($dictionaryClass)) {
				$this->dictionaries[$localeAlias] = new $dictionaryClass;
			// ...otherwise trow an error
			} else {
				throw new \NP\core\Exception("Dictionary {$locale} doesn't exist");
			}
		}

		return $this->dictionaries[$localeAlias];
	}
}

?>
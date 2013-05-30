<?php
namespace NP\util;

/**
 * This class provides utility functions that might be needed all over the application
 * 
 * This class is not meant to be instantiated and should have only static functions. 
 */
class Util {
	
	/**
	 * Formats a date in a format that can be used to save to the database and returns it
	 * 
	 * @param  DateTime  $date An integer representing time measured in the number of seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
	 * @return string          A formatted date
	 */
	public static function formatDateForDB($date=null) {
		if ($date === null) {
			$date = new \DateTime();
		}
		
		// Trim out extra characters at the end that can be created if using time() function which
		// generates 00000 for microseconds instead of a 3 digit number
		return substr($date->format("Y-m-d H:i:s.u"), 0, 23);
	}
	
	/**
	 * Takes an array of objects and returns a simple array using the value of the specified field for each record
	 *
	 * @param  array  $arr   An array of objects 
	 * @param  string $field The field you want values for in the array
	 * @return array
	 */
	public static function valueList($arr, $field) {
		$res = array_map(function($val) use ($field) { return $val[$field]; }, $arr);
		return $res;
	}
	
	/**
	 * Checks if an array is an associative or positional array
	 * 
	 * @param  array $arr An array
	 * @return boolean    Whether or not the array is associative
	 */
	public static function isAssocArray($arr) {
		return array_keys($arr) !== range(0, count($arr) - 1);
	}

	/**
	 * This function is used to do an HTTP request using curl
	 *
	 * @param  string $url The URL to do the request to
	 */
	public static function httpRequest($url, $type='GET', $data=null, $headers=null, $curl_options=null) {
		$validTypes = array('GET'=>0,'POST'=>1);
		if (!array_key_exists($type, $validTypes)) {
			throw new \NP\core\Exception('Value passed for argument "$types" is invalid. Valid values are ' . implode(' and ', $validTypes) . '.');
		}

		// Init the curl request
		$ch = curl_init();

		// Set some default options that can be overriden by options in $curl_options
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

		// Apply additional options if any are specified in $curl_options
		if ($curl_options !== null) {
			curl_setopt_array($ch, $curl_options);
		}

		// Set default options that cannot be overriden
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);			// Ensures the result of curl_exec returns a string instead of echo the string
		curl_setopt($ch, CURLOPT_URL, $url);				// Sets URL to post to
		curl_setopt($ch, CURLOPT_POST, $validTypes[$type]); // Sets if this is a POST or GET request
		if ($type == 'POST' && $data !== null) {
			curl_setopt($ch, CURLOPT_POSTFIELDS, $data);    // Sets the content body when doing a post
		}
		if ($headers !== null) {
			curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); // Sets HTTP request headers
		}
		
		// Run the request
		$content = curl_exec($ch);

		// Capture errors
		$error = curl_error($ch);

		return array(
			'content' => $content,
			'error'   => $error
		);
	}

	/**
	 * Utility function to easily resize an image if necessary using certain size constraints
	 * 
	 * @param  string  $imagePath File system path of the image to resize
	 * @param  int     $maxWidth  Maximum width allowed
	 * @param  int     $maxHeight Maximum height allowed
	 * @return boolean            Whether or not the image was resized
	 */
	public static function resizeImage($imagePath, $maxWidth, $maxHeight) {
		$wasResized = false;
		$validImageTypes = array('jpeg','gif','png');
		$size = getimagesize($imagePath);

		$imageExt = explode('/', $imagePath);
		$imageExt = array_pop($imageExt);
		$imageExt = explode('.', $imageExt);
		$imageExt = array_pop($imageExt);

		if ($imageExt === 'jpg') {
			$imageExt = 'jpeg';
		}

		if (!in_array($imageExt, $validImageTypes)) {
			throw new \NP\core\Exception('Invalid image type for resizing. The following are valid image types: ' . implode(',', $validImageTypes));
		}

		$widthOrig = $size[0];
		$heightOrig = $size[1];
		if ($widthOrig > $maxWidth || $heightOrig > $maxHeight) {
			$ratio = $widthOrig / $heightOrig;
			if ( ($maxWidth / $maxHeight) > $ratio ) {
			   $width = $maxHeight * $ratio;
			   $height = $maxHeight;
			} else {
			   $height = $maxWidth / $ratio;
			   $width = $maxWidth;
			}
			
			// Create two images
			$readFn = "imagecreatefrom{$imageExt}";
			$writeFn = "image{$imageExt}";
			$origImg = $readFn($imagePath);
			$resizedImg = imagecreatetruecolor($width, $height);

			imagecopyresized($resizedImg, $origImg, 0, 0, 0, 0, $width, $height, $widthOrig, $heightOrig);
			$writeFn($resizedImg, $imagePath);
			$wasResized = true;
		}

		return $wasResized;
	}
	
}

?>
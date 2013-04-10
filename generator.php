<?php

// Bootstrap
require_once("bootstrap.php");

if (array_key_exists("generationType", $_POST)) {
	$cols = $di['Adapter']->query("
		SELECT
            *,
            columnproperty(object_id(table_name), column_name,'IsIdentity') AS IsIdentity
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = '{$_POST['tableName']}'
        ORDER BY ORDINAL_POSITION
	");

	$nameSpace = explode('\\', $_POST['classPath']);
	$className = array_pop($nameSpace);
	$docTable = str_replace('Entity', '', $className);
	$nameSpace = implode('\\', $nameSpace);

	$extNameSpace = explode('.', $_POST['modelPath']);
	$extClassName = array_pop($extNameSpace);
	$extNameSpace = implode('.', $extNameSpace);

	$php = "<?php
namespace {$nameSpace};

/**
 * Entity class for {$docTable}
 *
 * @author 
 */
class {$className} extends \NP\core\AbstractEntity {
	
	protected \$fields = array(";

	$ext = "/**
 * Model for a {$extClassName}
 *
 * @author 
 */
Ext.define('{$extNameSpace}.{$extClassName}', {
	extend: 'NP.lib.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: '{$cols[0]['COLUMN_NAME']}',
	fields: [";

	$totalCols = count($cols);
	$extValidation = array();
	for ($i=0; $i<$totalCols; $i++) {
		$col = $cols[$i];

		$php .= "
		'{$col['COLUMN_NAME']}'	 => array(";

		$ext .= "
		{ name: '{$col['COLUMN_NAME']}'";

		if ($col['IS_NULLABLE'] == 'NO') {
			$php .= "
			'required' => true";
			$extValidation[] = "{ field: '{$col['COLUMN_NAME']}', type: 'presence' }";
		}

		$hasValidation = false;
		$validation = "";
		$dataType = $col['DATA_TYPE'];
		if ($dataType == 'int') {
			$validation .= "
				'digits' => array()";
			$ext .= ", type: 'int'";
			$hasValidation = true;
		} else if ($dataType == 'float' || $dataType == 'money') {
			$validation .= "
				'numeric' => array()";
			$hasValidation = true;
		} else if ($dataType == 'datetime') {
			$validation .= "
				'date' => array('format'=>'Y-m-d H:i:s')";
				$ext .= ", type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat()";
			$hasValidation = true;
		}

		if ($col['CHARACTER_MAXIMUM_LENGTH'] !== null) {
			$validation .= "
				'stringLength' => array('max'=>{$col['CHARACTER_MAXIMUM_LENGTH']})";
			$extValidation[] = "{ field: '{$col['COLUMN_NAME']}', type: 'length', max: {$col['CHARACTER_MAXIMUM_LENGTH']} }";
			$hasValidation = true;
		}

		if ($hasValidation) {
			if ($col['IS_NULLABLE'] == 'NO') {
				$php .= ",";
			}
			$php .= "
			'validation' => array({$validation}
			)
		";
		}
		$php .= ")";
		$ext .= " }";
		
		if ($i < ($totalCols-1)) {
			$php .= ",";
			$ext .= ",";
		}
	}

	$ext .= "
	]";

	$totalValidations = count($extValidation);
	if ($totalValidations) {
		$ext .= ",

	validations: [";
		for ($i=0; $i<$totalValidations; $i++) {
			$ext .= "
		{$extValidation[$i]}";
			if ($i < ($totalValidations - 1)) {
				$ext .= ",";
			}
		}
		$ext .= "
	]";
	}

	$php .= "
	);

}
?>";
	$ext .= "
});";
} else {
	$_POST['tableName'] = '';
	$_POST['classPath'] = '';
	$_POST['modelPath'] = '';
}

$tables = $di['Adapter']->query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME");
?>

<script type="text/javascript" src="vendor/extjs/ext-all.js"></script>
<script>
Ext.onReady(function() {
	var classPath = Ext.DomQuery.selectNode('input[name=classPath]');
	var modelPath = Ext.DomQuery.selectNode('input[name=modelPath]');
	classPath.onblur = function() {
		if (modelPath.value == '') {
			modelPath.value = classPath.value.replace(/[\\]/g, '.').replace('NP.', 'NP.model.').replace('Entity', '');
		}
	}
});
</script>
<h1>NexusPayables Class Generator</h1>

<h2>Entities/Models</h2>
<form action="generator.php" method="post">
	Table:<br />
	<select name="tableName">
		<option value=""></option>
		<?php foreach ($tables as $table) {
			$selected = ($_POST['tableName'] == $table['TABLE_NAME']) ? ' selected="true"' : '';
			echo "<option value=\"{$table['TABLE_NAME']}\"{$selected}>{$table['TABLE_NAME']}</option>";
		} ?>
	</select>
	<br /><br />
	PHP Class Path:
	<input type="text" name="classPath" size="40" value="<?= $_POST['classPath'] ?>" />
	<br /><br />
	Ext JS Model Path:
	<input type="text" name="modelPath" size="40" value="<?= $_POST['modelPath'] ?>" />
	<input type="hidden" name="generationType" value="Model" />
	<br /><br />
	<input type="submit" value="Generate" />
	<?php if (array_key_exists("generationType", $_POST)) { ?>
		<br /><br />
		<table width="100%">
		<tr>
			<td width="50%">
				PHP Entity<br>
				<textarea style="height:300px;width: 90%;"><?= $php ?></textarea>
			</td>
			<td width="50%">
				Ext JS Model<br>
				<textarea style="height:300px;width: 90%;"><?= $ext ?></textarea>
			</td>
		</tr>
		</table>
	<?php } ?>
</form>
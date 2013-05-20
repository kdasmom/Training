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

	$tableName = strtoupper($docTable);

	$extNameSpace = explode('.', $_POST['modelPath']);
	$extClassName = array_pop($extNameSpace);
	$extNameSpace = implode('.', $extNameSpace);
	$extStoreNameSpace = str_replace('model', 'store', $extNameSpace);

	$phpGateway = "<?php

namespace {$nameSpace};

use NP\core\AbstractGateway;

/**
 * Gateway for the {$tableName} table
 *
 * @author 
 */
class {$docTable}Gateway extends AbstractGateway {}

?>";
	
	$extStore = "/**
 * Store for {$docTable}s. This store uses the {$docTable} fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to {$docTable}.
 *
 * @author 
 */
Ext.define('{$extStoreNameSpace}.{$extClassName}s', {
    extend: 'NP.lib.data.Store',
	
    requires: ['{$extNameSpace}.{$extClassName}'],

    constructor: function(cfg) {
    	Ext.apply(this, cfg);

    	this.fields = [];
    	Ext.Array.each({$extNameSpace}.{$extClassName}.getFields(), function(field) {
            that.fields.push({
                name: field.name,
                type: field.type.type,
                dateFormat: field.dateFormat
            });
        });

    	this.callParent(arguments);
    }    
});";

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

		// Make field required if it's not nullable and is not the primary key
		$isRequired = false;
		if ($col['IS_NULLABLE'] == 'NO' && $i > 0) {
			$php .= "
			'required' => true";
			$extValidation[] = "{ field: '{$col['COLUMN_NAME']}', type: 'presence' }";
			$isRequired = true;
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
				'date' => array('format'=>'Y-m-d H:i:s.u')";
				$ext .= ", type: 'date', dateFormat: NP.Config.getServerDateFormat()";
			$hasValidation = true;
		} else if ($dataType == 'smalldatetime') {
			$validation .= "
				'date' => array('format'=>'Y-m-d H:i:s')";
				$ext .= ", type: 'date', dateFormat: NP.Config.getServerSmallDateFormat()";
			$hasValidation = true;
		}

		if ($col['CHARACTER_MAXIMUM_LENGTH'] !== null) {
			$validation .= "
				'stringLength' => array('max'=>{$col['CHARACTER_MAXIMUM_LENGTH']})";
			$extValidation[] = "{ field: '{$col['COLUMN_NAME']}', type: 'length', max: {$col['CHARACTER_MAXIMUM_LENGTH']} }";
			$hasValidation = true;
		}

		if ($hasValidation) {
			if ($isRequired) {
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
				<textarea style="height:200px;width: 90%;"><?= $php ?></textarea>
			</td>
			<td width="50%">
				Ext JS Model<br>
				<textarea style="height:200px;width: 90%;"><?= $ext ?></textarea>
			</td>
		</tr>
		<tr>
			<td width="50%">
				PHP Gateway<br>
				<textarea style="height:200px;width: 90%;"><?= $phpGateway ?></textarea>
			</td>
			<td width="50%">
				Ext JS Store<br>
				<textarea style="height:200px;width: 90%;"><?= $extStore ?></textarea>
			</td>
		</tr>
		</table>
	<?php } ?>
</form>
<?php

// Bootstrap
require_once("bootstrap.php");

if (array_key_exists("classGen", $_POST) || array_key_exists("formGen", $_POST)) {
	$cols = $di['Adapter']->query("
		SELECT
            *,
            columnproperty(object_id(table_name), column_name,'IsIdentity') AS IsIdentity
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = '{$_POST['tableName']}'
        ORDER BY ORDINAL_POSITION
	");
}

if (array_key_exists("classGen", $_POST)) {
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
 * Store for {$docTable}s.
 *
 * @author 
 */
Ext.define('{$extStoreNameSpace}.{$extClassName}s', {
    extend: 'NP.lib.data.Store',
	
	model: '{$extNameSpace}.{$extClassName}'    
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
	extend: 'Ext.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: '{$cols[0]['COLUMN_NAME']}',
	fields: [";

	$totalCols = count($cols);
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
			$isRequired = true;
		}

		$hasValidation = false;
		$validation = "";
		$dataType = $col['DATA_TYPE'];
		if ($dataType == 'int' || $dataType == 'smallint' || $dataType == 'tinyint') {
			$validation .= "
				'digits' => array()";
			$ext .= ", type: 'int'";
			$hasValidation = true;
		} else if ($dataType == 'float' || $dataType == 'money' || $dataType == 'decimal') {
			$validation .= "
				'numeric' => array()";
			$ext .= ", type: 'float'";
			$hasValidation = true;
		} else if ($dataType == 'datetime') {
			$validation .= "
				'date' => array('format'=>'Y-m-d H:i:s.u')";
				$ext .= ", type: 'date'";
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

	$php .= "
	);

}
?>";
	$ext .= "
});";
}

if (!array_key_exists("classGen", $_POST) && !array_key_exists("formGen", $_POST)) {
	$_POST['tableName'] = '';
	$_POST['classPath'] = '';
	$_POST['modelPath'] = '';
}

$tables = $di['Adapter']->query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME");
?>

<script type="text/javascript" src="ext/ext-all.js"></script>
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
<h1>NexusPayables Generator</h1>

<form action="generator.php" method="post">
	<?php if (!array_key_exists("formGen", $_POST)) { ?>
		<h2>Entities/Models</h2>

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
		<br /><br />
		<input type="submit" name="classGen" value="Generate" />
		<input type="submit" name="formGen" value="Form Generator" />
		<?php if (array_key_exists("classGen", $_POST)) { ?>
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
	<?php } else { ?>
		<h2>Select Fields</h2>
		<table width="100%">
		<tr>
			<td width="50%" valign="top">
				<table>
				<tr>
					<th>Column</th>
					<th>UI type</th>
				</tr>
				<?php
					foreach ($cols as $idx=>$col) {
						if (!array_key_exists('uiType', $_POST)) {
							$dataType = $col['DATA_TYPE'];
							
							$textSelected = ($dataType == 'varchar' || $dataType == 'nvarchar' || $dataType == 'text') ? ' selected=true' : '';
							$dateSelected = ($dataType == 'datetime' || $dataType == 'smalldatetime') ? ' selected=true' : '';

							$numSelected = '';
							$comboSelected = '';
							if (!$col['IsIdentity'] && ($dataType == 'int' || $dataType == 'smallint')) {
								if (strpos($col['COLUMN_NAME'], '_id') === false) {
									$numSelected = ' selected=true';
								} else {
									$comboSelected = ' selected=true';
								}
							}
							$yesnoSelected = ($dataType == 'tinyint') ? ' selected=true' : '';
						} else {
							$uiType = $_POST['uiType'];
							$textSelected = ($uiType[$idx] == 'text') ? ' selected=true' : '';
							$dateSelected = ($uiType[$idx] == 'date') ? ' selected=true' : '';
							$numSelected = ($uiType[$idx] == 'number') ? ' selected=true' : '';
							$comboSelected = ($uiType[$idx] == 'combo') ? ' selected=true' : '';
							$yesnoSelected = ($uiType[$idx] == 'yesno') ? ' selected=true' : '';
						}

						echo "<tr>" .
								"<td>{$col['COLUMN_NAME']}</td>" .
								"<td>" .
									"<select name='uiType[]'>" .
										"<option value='none'>Don't show</option>" .
										"<option value='text'{$textSelected}>Text</option>" .
										"<option value='number'{$numSelected}>Number</option>" .
										"<option value='date'{$dateSelected}>Date</option>" .
										"<option value='combo'{$comboSelected}>Combo</option>" .
										"<option value='yesno'{$yesnoSelected}>Yes/No</option>" .
									"</select>" .
								"</td>" .
							"</tr>";
					}
				?>
				</table>
				<input type="hidden" name="tableName" value="<?php echo $_POST['tableName']; ?>" />
				<input type="submit" name="formGen" value="Generate" />
			</td>
			<?php
				if (array_key_exists('uiType', $_POST)) {
					$uiType = $_POST['uiType'];
					$fields = array();
					$allowBlank = ($col['IS_NULLABLE'] == 'NO') ? ",
allowBlank: false" : '';
				foreach ($cols as $idx=>$col) {
					if ($uiType[$idx] == 'text') {
						$fields[] = "{
	xtype     : 'textfield',
	fieldLabel: 'MyLabel',
	name      : '{$col['COLUMN_NAME']}',
	maxLength : {$col['CHARACTER_MAXIMUM_LENGTH']}{$allowBlank}
}";
					} elseif ($uiType[$idx] == 'number') {
						$fields[] = "{
	xtype     : 'numberfield',
	fieldLabel: 'MyLabel',
	name      : '{$col['COLUMN_NAME']}'{$allowBlank}
}";
					} elseif ($uiType[$idx] == 'date') {
						$fields[] = "{
	xtype     : 'datefield',
	fieldLabel: 'MyLabel',
	name      : '{$col['COLUMN_NAME']}'{$allowBlank}
}";
					} elseif ($uiType[$idx] == 'combo') {
						$fields[] = "{
	xtype       : 'customcombo',
	fieldLabel  : 'MyLabel',
	name        : '{$col['COLUMN_NAME']}',
	store       : 'MyStore',
	displayField: '',
	valueField  : ''{$allowBlank}
}";
					} elseif ($uiType[$idx] == 'yesno') {
						$fields[] = "{
	xtype       : 'shared.yesnofield',
	fieldLabel  : 'MyLabel',
	name        : '{$col['COLUMN_NAME']}',
	value       : 1{$allowBlank}
}";
						}
					}
			 ?>
			 	<td width="50%" valign="top">
			 		<b>Form Code</b><br />
					<textarea style="height:500px;width: 95%;"><?php echo implode(',', $fields); ?></textarea>
				</td>
			<?php } ?>
		</tr>
		</table>
	<?php } ?>
</form>
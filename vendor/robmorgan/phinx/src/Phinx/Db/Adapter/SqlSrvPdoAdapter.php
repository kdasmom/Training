<?php
/**
 * Phinx
 *
 * (The MIT license)
 * Copyright (c) 2012 Rob Morgan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated * documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 * 
 * @package    Phinx
 * @subpackage Phinx\Db\Adapter
 */
namespace Phinx\Db\Adapter;

use Phinx\Db\Table,
    Phinx\Db\Table\Column,
    Phinx\Db\Table\Index,
    Phinx\Db\Table\ForeignKey;

/**
 * Phinx MySQL Adapter.
 *
 * @author Rob Morgan <robbym@gmail.com>
 */
class SqlSrvPdoAdapter extends PdoAdapter implements AdapterInterface
{
    /**
     * {@inheritdoc}
     */
    public function connect()
    {
        if (null === $this->connection) {
            if (!class_exists('PDO') || !in_array('sqlsrv', \PDO::getAvailableDrivers(), true)) {
                // @codeCoverageIgnoreStart
                throw new \RuntimeException('You need to enable the PDO_sqlsrv extension for Phinx to run properly.');
                // @codeCoverageIgnoreEnd
            }
            
            $dsn = '';
            $db = null;
            $options = $this->getOptions();
            
            // if port is specified use it, otherwise use the MySQL default
            if (isset($options['port'])) {
                $dsn = 'sqlsrv:Server=' . $options['host'] . ';port=' . $options['port'] . ';Database=' . $options['name'];
            } else {
                $dsn = 'sqlsrv:Server=' . $options['host'] . ';Database=' . $options['name'];
            }

            try {
                $db = new \PDO($dsn, $options['user'], $options['pass'], array(\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION));
            } catch(\PDOException $exception) {
                throw new \InvalidArgumentException(sprintf(
                    'There was a problem connecting to the database: '
                    . $exception->getMessage()
                ));
            }

            $this->setConnection($db);
            
            // Create the schema table if it doesn't already exist
            if (!$this->hasSchemaTable()) {
                $this->createSchemaTable();
            }
        }
    }
    
    /**
     * {@inheritdoc}
     */
    public function disconnect()
    {
        $this->connection = null;
    }
    
    /**
     * {@inheritdoc}
     */
    public function hasTransactions()
    {
        return true;
    }
    
    /**
     * {@inheritdoc}
     */
    public function beginTransaction()
    {
        if ($this->connection->inTransaction()) {
            throw new \Exception('There is already an active transaction');
        }
        $this->connection->beginTransaction();
    }
    
    /**
     * {@inheritdoc}
     */
    public function commitTransaction()
    {
        if (!$this->connection->inTransaction()) {
            throw new \Exception('You have not begun a transaction');
        }
        $this->connection->commit();
    }
    
    /**
     * {@inheritdoc}
     */
    public function rollbackTransaction()
    {
        if (!$this->connection->inTransaction()) {
            throw new \Exception('You have not begun a transaction');
        }
        $this->connection->rollback();
    }
    
    /**
     * {@inheritdoc}
     */
    public function quoteTableName($tableName)
    {
        return '[' . $tableName . ']';
    }
    
    /**
     * {@inheritdoc}
     */
    public function quoteColumnName($columnName)
    {
        return '[' . $columnName . ']';
    }
    
    /**
     * {@inheritdoc}
     */
    public function hasTable($tableName)
    {
        $options = $this->getOptions();
        
        $tables = array();
        $rows = $this->fetchAll("
            SELECT count(*) AS totalRows
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE' 
            AND TABLE_NAME = '{$tableName}'
        ");
        if ($rows[0]['totalRows'] == 0) {
            return false;
        } else {
            return true;
        }
    }
    
    /**
     * {@inheritdoc}
     */
    public function createTable(Table $table)
    {
        $options = $table->getOptions();
        
        // Add the default primary key
        $columns = $table->getPendingColumns();
        if (!isset($options['id']) || (isset($options['id']) && $options['id'] === true)) {
            $column = new Column();
            $column->setName('id')
                   ->setType('integer')
                   ->setIdentity(true);
            
            array_unshift($columns, $column);
            $options['primary_key'] = 'id';

        } elseif (isset($options['id']) && is_string($options['id'])) {
            // Handle id => "field_name" to support AUTO_INCREMENT
            $column = new Column();
            $column->setName($options['id'])
                   ->setType('integer')
                   ->setIdentity(true);

            array_unshift($columns, $column);
            $options['primary_key'] = $options['id'];
        }
        
        $sql = 'CREATE TABLE ';
        $sql .= $table->getName() . ' (';
        foreach ($columns as $column) {
            $sql .= $column->getName() . ' ' . $this->getColumnSqlDefinition($column) . ', ';
        }
        
        // set the primary key(s)
        if (isset($options['primary_key'])) {
            $sql = rtrim($sql);
            $sql .= " CONSTRAINT [PK_{$table->getName()}] PRIMARY KEY CLUSTERED (";
            if (is_string($options['primary_key'])) {       // handle primary_key => 'id'
                $sql .= "[{$options['primary_key']}]";
            } else if (is_array($options['primary_key'])) { // handle primary_key => array('tag_id', 'resource_id')
                // PHP 5.4 will allow access of $this, so we can call quoteColumnName() directly in the anonymous function,
                // but for now just hard-code the adapter quotes
                $sql .= implode(',', array_map(function($v) { return '[' . $v . ']'; }, $options['primary_key']));
            }
            $sql .= ')';
        } else {
            $sql = substr(rtrim($sql), 0, -1);              // no primary keys
        }
        
        // set the indexes
        $indexes = $table->getIndexes();
        if (!empty($indexes)) {
            foreach ($indexes as $index) {
                $sql .= ', ' . $this->getIndexSqlDefinition($index);
            }
        }

        // set the foreign keys
        $foreignKeys = $table->getForeignKeys();
        if (!empty($foreignKeys)) {
            foreach ($foreignKeys as $foreignKey) {
                $sql .= ', ' . $this->getForeignKeySqlDefinition($foreignKey);
            }
        }

        $sql .= ') ';
        $sql = rtrim($sql) . ';';

        // execute the sql
        $this->execute($sql);
    }
    
    /**
     * {@inheritdoc}
     */
    public function renameTable($tableName, $newTableName)
    {
        $this->execute(sprintf('EXEC SP_RENAME %s, %s, \'OBJECT\'', $this->quoteTableName($tableName), $this->quoteTableName($newTableName)));
    }
    
    /**
     * {@inheritdoc}
     */
    public function dropTable($tableName)
    {
        $this->execute(sprintf('DROP TABLE %s', $this->quoteTableName($tableName)));
    }

    /**
     * {@inheritdoc}
     */
    public function getColumns($tableName)
    {
        $columns = array();
        $rows = $this->fetchAll(sprintf('
            SELECT
                *,
                columnproperty(object_id(table_name), column_name,\'IsIdentity\') AS IsIdentity
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME=\'%s\'
        ', $tableName));
        foreach ($rows as $columnInfo) {
            $column = new Column();
            $column->setName($columnInfo['COLUMN_NAME'])
                   ->setType($columnInfo['DATA_TYPE'])
                   ->setNull($columnInfo['IS_NULLABLE'] != 'NO')
                   ->setDefault($columnInfo['COLUMN_DEFAULT']);

            $phinxType = $this->getPhinxType($columnInfo['DATA_TYPE']);
            $column->setType($phinxType['name'])
                   ->setLimit($phinxType['limit']);

            if ($columnInfo['IsIdentity'] == 1) {
                $column->setIdentity(true);
            }

            $columns[] = $column;
        }

        return $columns;
    }
    
    /**
     * {@inheritdoc}
     */
    public function hasColumn($tableName, $columnName)
    {
        // TODO - do we need $options? I think we borrowed the signature from
        // Rails and it's meant to test indexes or something??
        $rows = $this->fetchAll(sprintf('
            SELECT
                count(*) AS totalRows
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = \'%s\'
                AND COLUMN_NAME = \'%s\'
        ', $tableName, $columnName));

        if ($rows[0]['totalRows'] == 0) {
            return false;
        } else {
            return true;
        }
    }
    
    /**
     * {@inheritdoc}
     */
    public function addColumn(Table $table, Column $column)
    {
        $sql = sprintf('ALTER TABLE %s ADD %s %s',
            $this->quoteTableName($table->getName()),
            $this->quoteColumnName($column->getName()),
            $this->getColumnSqlDefinition($column)
        );
        
        return $this->execute($sql);
    }
    
    /**
     * {@inheritdoc}
     */
    public function renameColumn($tableName, $columnName, $newColumnName)
    {
        $this->execute(sprintf('EXEC SP_RENAME \'%s.%s\', %s, \'COLUMN\'', $tableName, $columnName, $this->quoteTableName($newColumnName)));
    }
    
    /**
     * {@inheritdoc}
     */
    public function changeColumn($tableName, $columnName, Column $newColumn)
    {
        $this->renameColumn($tableName, $columnName, $newColumn->getName());
        
        return $this->execute(
            sprintf('ALTER TABLE %s ALTER COLUMN %s %s',
                $this->quoteTableName($tableName),
                $this->quoteColumnName($newColumn->getName()),
                $this->getColumnSqlDefinition($newColumn)
            )
        );
    }
    
    /**
     * {@inheritdoc}
     */
    public function dropColumn($tableName, $columnName)
    {
        $this->execute(
            sprintf(
                'ALTER TABLE %s DROP COLUMN %s',
                $this->quoteTableName($tableName),
                $this->quoteColumnName($columnName)
            )
        );
    }
    
    /**
     * Get an array of indexes from a particular table.
     *
     * @param string $tableName Table Name
     * @return array
     */
    protected function getIndexes($tableName)
    {
        $indexes = array();
        $rows = $this->fetchAll(sprintf('EXEC sp_helpindex %s', $this->quoteTableName($tableName)));
        foreach ($rows as $row) {
            if (!isset($indexes[$row['index_name']])) {
                $indexes[$row['index_name']] = array('columns' => array());
            }
            $indexes[$row['index_name']]['columns'][] = strtolower($row['index_keys']);
        }
        return $indexes;
    }
    
    /**
     * {@inheritdoc}
     */
    public function hasIndex($tableName, $columns)
    {
        if (is_string($columns)) {
            $columns = array($columns); // str to array
        }
        
        $columns = array_map('strtolower', $columns);
        $indexes = $this->getIndexes($tableName);
        
        foreach ($indexes as $index) {
            $a = array_diff($columns, $index['columns']);
            if (empty($a)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * {@inheritdoc}
     */
    public function addIndex(Table $table, Index $index)
    {
        return $this->execute(
            sprintf('CREATE INDEX [%s] ON [%s] (%s)',
                // NEED TO ADD NAME OF INDEX HERE
                $this->quoteTableName($table->getName()),
                $this->getIndexSqlDefinition($index)
            )
        );
    }
    
    /**
     * {@inheritdoc}
     */
    public function dropIndex($tableName, $columns)
    {
        if (is_string($columns)) {
            $columns = array($columns); // str to array
        }
        
        $indexes = $this->getIndexes($tableName);
        $columns = array_map('strtolower', $columns);
        
        foreach ($indexes as $indexName => $index) {
            $a = array_diff($columns, $index['columns']);
            if (empty($a)) {
                return $this->execute(
                    sprintf('DROP INDEX %s',
                        $this->quoteColumnName($indexName)
                    )
                );   
            }
        }
    }

    /**
     * {@inheritdoc}
     */
    public function hasForeignKey($tableName, $columns, $constraint = null)
    {
        if (is_string($columns)) {
            $columns = array($columns); // str to array
        }
        $foreignKeys = $this->getForeignKeys($tableName);
        if ($constraint) {
            if (isset($foreignKeys[$constraint])) {
                return !empty($foreignKeys[$constraint]);
            }
            return false;
        } else {
            foreach ($foreignKeys as $key) {
                $a = array_diff($columns, $key['columns']);
                if (empty($a)) {
                    return true;
                }
            }
            return false;
        }
    }

    /**
     * Get an array of foreign keys from a particular table.
     *
     * @param string $tableName Table Name
     * @return array
     */
    protected function getForeignKeys($tableName)
    {
        $foreignKeys = array();
        $rows = $this->fetchAll(sprintf('
            SELECT 
                f.name AS ForeignKey,
                SCHEMA_NAME(f.SCHEMA_ID) SchemaName,
                OBJECT_NAME(f.parent_object_id) AS TableName,
                COL_NAME(fc.parent_object_id,fc.parent_column_id) AS ColumnName,
                SCHEMA_NAME(o.SCHEMA_ID) ReferenceSchemaName,
                OBJECT_NAME (f.referenced_object_id) AS ReferenceTableName,
                COL_NAME(fc.referenced_object_id,fc.referenced_column_id) AS ReferenceColumnName
            FROM sys.foreign_keys AS f
                INNER JOIN sys.foreign_key_columns AS fc ON f.OBJECT_ID = fc.constraint_object_id
                INNER JOIN sys.objects AS o ON o.OBJECT_ID = fc.referenced_object_id
            WHERE OBJECT_NAME(f.parent_object_id) = \'%s\'
            ',
            $tableName
        ));
        foreach ($rows as $row) {
            $foreignKeys[$row['CONSTRAINT_NAME']]['table'] = $row['TableName'];
            $foreignKeys[$row['CONSTRAINT_NAME']]['columns'][] = $row['ColumnName'];
            $foreignKeys[$row['CONSTRAINT_NAME']]['referenced_table'] = $row['ReferenceTableName'];
            $foreignKeys[$row['CONSTRAINT_NAME']]['referenced_columns'][] = $row['ReferenceColumnName'];
        }
        return $foreignKeys;
    }

    /**
     * {@inheritdoc}
     */
    public function addForeignKey(Table $table, ForeignKey $foreignKey)
    {
        return $this->execute(
            sprintf('ALTER TABLE %s ADD %s',
                $this->quoteTableName($table->getName()),
                $this->getForeignKeySqlDefinition($foreignKey)
            )
        );
    }

    /**
     * {@inheritdoc}
     */
    public function dropForeignKey($tableName, $columns, $constraint = null)
    {
        if (is_string($columns)) {
            $columns = array($columns); // str to array
        }
        if ($constraint) {
            return $this->execute(
                sprintf('ALTER TABLE %s DROP CONSTRAINT %s',
                    $this->quoteTableName($tableName),
                    $constraint
                )
            );
        } else {
            foreach ($columns as $column) {
                $rows = $this->getForeignKeys(sprintf('
                    SELECT 
                        f.name AS ForeignKey,
                        SCHEMA_NAME(f.SCHEMA_ID) SchemaName,
                        OBJECT_NAME(f.parent_object_id) AS TableName,
                        COL_NAME(fc.parent_object_id,fc.parent_column_id) AS ColumnName,
                        SCHEMA_NAME(o.SCHEMA_ID) ReferenceSchemaName,
                        OBJECT_NAME (f.referenced_object_id) AS ReferenceTableName,
                        COL_NAME(fc.referenced_object_id,fc.referenced_column_id) AS ReferenceColumnName
                    FROM sys.foreign_keys AS f
                        INNER JOIN sys.foreign_key_columns AS fc ON f.OBJECT_ID = fc.constraint_object_id
                        INNER JOIN sys.objects AS o ON o.OBJECT_ID = fc.referenced_object_id
                    WHERE COL_NAME(fc.parent_object_id,fc.parent_column_id) = \'%s\'
                        AND OBJECT_NAME(f.parent_object_id) = \'%s\'
                    ',
                    $column,
                    $tableName
                ));
                foreach ($rows as $row) {
                    $this->dropForeignKey($tableName, $columns, $row['ForeignKey']);
                }
            }
        }
    }
    
    /**
     * {@inheritdoc}
     */
    public function getSqlType($type)
    {
        switch ($type) {
            case 'primary_key':
                return self::DEFAULT_PRIMARY_KEY;
            case 'string':
                return array('name' => 'varchar', 'limit' => 255);
                break;
            case 'text':
                return array('name' => 'text');
                break;
            case 'integer':
                return array('name' => 'int', 'limit' => 11);
                break;
            case 'biginteger':
                return array('name' => 'bigint');
                break;
            case 'float':
                return array('name' => 'float');
                break;
            case 'decimal':
                return array('name' => 'decimal');
                break;
            case 'datetime':
                return array('name' => 'datetime');
                break;
            case 'timestamp':
                return array('name' => 'datetime');
                break;
            case 'time':
                return array('name' => 'time');
                break;
            case 'date':
                return array('name' => 'date');
                break;
            case 'binary':
                return array('name' => 'blob');
                break;
            case 'boolean':
                return array('name' => 'tinyint', 'limit' => 1);
                break;
            default:
                throw new \RuntimeException('The type: "' . $type . '" is not supported.');
        }
    }

    /**
     * Returns Phinx type by SQL type
     *
     * @param string $sqlType SQL type
     * @returns string Phinx type
     */
    public function getPhinxType($sqlTypeDef)
    {
        if (preg_match('/^([\w]+)(\(([\d]+)*(,([\d]+))*\))*$/', $sqlTypeDef, $matches) === false) {
            throw new \RuntimeException('Column type ' . $sqlTypeDef . ' is not supported');
        } else {
            $limit = null;
            $precision = null;
            $type = $matches[1];
            if (count($matches) > 2) {
                $limit = $matches[3] ? $matches[3] : null;
            }
            if (count($matches) > 4) {
                $precision = $matches[5];
            }
            switch ($matches[1]) {
                case 'varchar':
                    $type = 'string';
                    if ($limit == 255) {
                        $limit = null;
                    }
                    break;
                case 'int':
                    $type = 'integer';
                    if ($limit == 11) {
                        $limit = null;
                    }
                    break;
                case 'bigint':
                    if ($limit == 11) {
                        $limit = null;
                    }
                    $type = 'biginteger';
                    break;
                case 'blob':
                    $type = 'binary';
                    break;
            }
            if ($type == 'tinyint') {
                if ($matches[3] == 1) {
                    $type = 'boolean';
                    $limit = null;
                }
            }

            $this->getSqlType($type);

            return array(
                'name' => $type,
                'limit' => $limit,
                'precision' => $precision
            );
        }
    }

    /**
     * {@inheritdoc}
     */
    public function createDatabase($name, $options = array())
    {
        $charset = isset($options['charset']) ? $options['charset'] : 'utf8';
        
        if (isset($options['collation'])) {
            $this->execute(sprintf(
                'CREATE DATABASE \'%s\' DEFAULT CHARACTER SET \'%s\' COLLATE \'%s\'', $name, $charset, $options['collation']
            ));
        } else {
            $this->execute(sprintf('CREATE DATABASE \'%s\' DEFAULT CHARACTER SET \'%s\'', $name, $charset));
        }
    }
    
    /**
     * {@inheritdoc}
     */
    public function hasDatabase($name)
    {
        $rows = $this->fetchAll(
            sprintf(
                'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = \'%s\'',
                $name
            )
        );
        
        foreach ($rows as $row) {
            if (!empty($row)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * {@inheritdoc}
     */
    public function dropDatabase($name)
    {
        $this->execute(sprintf('DROP DATABASE IF EXISTS \'%s\'', $name));
    }
    
    /**
     * Gets the MySQL Column Definition for a Column object.
     *
     * @param Column $column Column
     * @return string
     */
    protected function getColumnSqlDefinition(Column $column)
    {
        $sqlType = $this->getSqlType($column->getType());
        $def = '';
        $def = '';
        $def .= strtoupper($sqlType['name']);
        if ($column->getType() == 'string' || $column->getType() == 'decimal') {
            $def .= ($column->getLimit() || isset($sqlType['limit']))
                         ? '(' . ($column->getLimit() ? $column->getLimit() : $sqlType['limit']) . ')' : '';
        }
        $def .= ($column->isIdentity()) ? ' IDENTITY (1,1)' : '';
        $def .= ($column->isNull() == false) ? ' NOT NULL' : ' NULL';
        $default = $column->getDefault();
        if (is_numeric($default)) {
            $def .= ' DEFAULT ' . $column->getDefault();
        } else {
            $def .= is_null($column->getDefault()) ? '' : ' DEFAULT \'' . $column->getDefault() . '\'';
        }
        // TODO - add precision & scale for decimals
        return $def;
    }
    
    /**
     * Gets the MySQL Index Definition for an Index object.
     *
     * @param Index $index Index
     * @return string
     */
    protected function getIndexSqlDefinition(Index $index)
    {
        $def = '';
        if ($index->getType() == Index::UNIQUE) {
            $def .= ' UNIQUE KEY (' . implode(',', $index->getColumns()) . ')';
        } else {
            $def .= ' KEY (' . implode(',', $index->getColumns()) . ')';
        }
        return $def;
    }

    /**
     * Gets the MySQL Foreign Key Definition for an ForeignKey object.
     *
     * @param ForeignKey $foreignKey
     * @return string
     */
    protected function getForeignKeySqlDefinition(ForeignKey $foreignKey)
    {
        $def = '';
        if ($foreignKey->getConstraint()) {
            $def .= ' CONSTRAINT ' . $this->quoteColumnName($foreignKey->getConstraint());
        } else {
            $columnNames = array();
            foreach ($foreignKey->getColumns() as $column) {
                $columnNames[] = $this->quoteColumnName($column);
            }
            $def .= ' FOREIGN KEY (' . implode(',', $columnNames) . ')';
            $refColumnNames = array();
            foreach ($foreignKey->getReferencedColumns() as $column) {
                $refColumnNames[] = $this->quoteColumnName($column);
            }
            $def .= ' REFERENCES ' . $this->quoteTableName($foreignKey->getReferencedTable()->getName()) . ' (' . implode(',', $refColumnNames) . ')';
            if ($foreignKey->getOnDelete()) {
                $def .= ' ON DELETE ' . $foreignKey->getOnDelete();
            }
            if ($foreignKey->getOnUpdate()) {
                $def .= ' ON UPDATE ' . $foreignKey->getOnUpdate();
            }
        }
        return $def;
    }
}
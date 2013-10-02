<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Update;
use NP\core\db\Insert;
use NP\core\db\Expression;

/**
 * Gateway for the TREE table
 *
 * @author Thomas Messier
 */
class TreeGateway extends AbstractGateway {

    public function getTreeOrder($parentTreeId)
    {
        $select = new Select();
        $select->from('tree')
            ->columns(array('tree_order' => new \NP\core\db\Expression('ISNULL(max(tree_order), 0)')))
            ->where("table_name = 'glaccount' AND tree_parent = ?");

        $result = $this->adapter->query($select, array($parentTreeId));
        if(count($result) > 0) {
            return (int)$result[0]['tree_order'] + 1;
        }
        return 1;
    }

    public function getTreeIdForCategory($glAccountCategoryId)
    {
        $select = new Select();
        $select->from('tree')
            ->columns(array('id' => 'tree_id'))
            ->where("table_name = 'glaccount' AND tablekey_id = ?");

        $result = $this->adapter->query($select, array($glAccountCategoryId));
        return $result[0]['id'];
    }

    /**
     * Creates a tree record for an entity if one doesn't already exist, otherwise updates only
     * if tree_order is specified
     */
    public function saveByTableNameAndId($table_name, $tablekey_id, $tree_parent, $tree_order=null) {
        $currentTree = $this->find(
            array('table_name'=>'?', 'tablekey_id'=>'?'),
            array($table_name, $tablekey_id)
        );

        if (!count($currentTree)) {
            if ($tree_order === null) {
                $tree_order = $this->getMaxOrder($table_name, $tree_parent);
            }

            $tree = new TreeEntity(array(
                'tree_parent' => $tree_parent,
                'table_name'  => $table_name,
                'tablekey_id' => $tablekey_id,
                'tree_order'  => $tree_order
            ));

            $this->save($tree);

            $tree_id = $tree->tree_id;
        } else {
            $tree_id = $currentTree[0]['tree_id'];
            if ($tree_order !== null) {
                $tree = new TreeEntity($currentTree[0]);
                $tree->tree_order = $tree_order;

                $this->save($tree);
            }
        }

        return $tree_id;
    }

    /**
     * Gets the next number in the sequence for the tree_order field within a certain tree
     *
     * @param  string $table_name
     * @param  int    $tree_parent
     * @return int
     */
    public function getMaxOrder($table_name, $tree_parent) {
        $select = new Select();
        $select->column(new Expression("ISNULL(MAX(tree_order), 1) + 1"), 'max_order')
                ->column(new Expression("COUNT(*) + 1 AS total"))
                ->from('tree')
                ->whereEquals('table_name', '?')
                ->whereEquals('tree_parent', '?');

        $res = $this->adapter->query($select, array($table_name, $tree_parent));

        // Return whichever is bigger, the glaccount_order or the number of records
        return ($res[0]['max_order'] > $res[0]['total']) ? $res[0]['max_order'] : $res[0]['total'];
    }
}

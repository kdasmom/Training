<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Update;
use NP\core\db\Insert;

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

    public function updateTree($glaccountId, $newGlAccountId, $parentTreeId, $treeOrder, $exists)
    {
        if(!$exists) {
            //Insert data to TREE
            // INSERT INTO TREE (tree_parent, table_name, tablekey_id, tree_order) VALUES (@parent_tree_id, 'glaccount', @new_glaccount_id, @tree_order)
            $treeValues = array(
                'tree_parent' => $parentTreeId,
                'table_name'  => "'glaccount'",
                'tablekey_id' => $newGlAccountId,
                'tree_order'  => $treeOrder
            );
            $query = new Insert('tree', $treeValues);
        } else {
            //UPDATE tree SET tree_parent = @parent_tree_id, tree_order = @tree_order WHERE table_name = 'glaccount' AND tablekey_id = @glaccount_id;
            $values = array(
                'tree_parent' => $parentTreeId,
                'tree_order'  => $treeOrder
            );
            $where = array(
                'table_name'  => "'glaccount'",
                'tablekey_id' => $glaccountId,
            );
            $query = new Update('tree', $values, $where);
        }
        $this->adapter->query($query);
    }
}

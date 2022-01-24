import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TreeItem, TreeView } from "@mui/lab";
import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";

export interface RenderTree {
    id: any;
    name: string;
    child?: RenderTree[] | null;
}

export default function RecursiveTreeView(data: RenderTree, selected: string[], setSelected: (value: string[]) => void) {

    const selectedSet = React.useMemo(() => new Set(selected), [selected]);
    const parentMap = React.useMemo(() => {
        return goThroughAllNodes(data);
    }, []);
    // console.log("parentMAp", parentMap);
    function goThroughAllNodes(nodes: RenderTree, map: Record<string, any> = {}) {
        if (!nodes.child) {
            return null;
        }
        map[nodes.id] = getAllChild(nodes).splice(1);
        for (let childNode of nodes.child) {
            goThroughAllNodes(childNode, map);
        }
        return map;
    }
    // Get all children from the current node.
    function getAllChild(
        childNode: RenderTree | null,
        collectedNodes: any[] = []
    ) {
        if (childNode === null) return collectedNodes;
        collectedNodes.push(childNode.id);
        if (Array.isArray(childNode.child)) {
            for (const node of childNode.child) {
                getAllChild(node, collectedNodes);
            }
        }
        return collectedNodes;
    }
    const getChildById = (nodes: RenderTree, id: string) => {
        let array: string[] = [];
        let path: string[] = [];
        // recursive DFS
        function getNodeById(node: RenderTree, id: string, parentsPath: string[]): RenderTree | null {
            let result = null;
            if (node.id === id) {
                return node;
            } else if (Array.isArray(node.child)) {
                for (let childNode of node.child) {
                    result = getNodeById(childNode, id, parentsPath);
                    if (!!result) {
                        parentsPath.push(node.id);
                        return result;
                    }
                }
                return result;
            }
            return result;
        }
        const nodeToToggle = getNodeById(nodes, id, path);
        // console.log(path);
        return { childNodesToToggle: getAllChild(nodeToToggle, array), path };
    };
    function getOnChange(checked: boolean, nodes: RenderTree) {
        const { childNodesToToggle, path } = getChildById(data, nodes.id);
        console.log("childNodesToChange", { childNodesToToggle, checked });
        let array = checked
            ? [...selected, ...childNodesToToggle]
            : selected
                .filter((value) => !childNodesToToggle.includes(value))
                .filter((value) => !path.includes(value));
        array = array.filter((v, i) => array.indexOf(v) === i);
        setSelected(array);
    }
    const renderTree = (nodes: RenderTree) => {
        const allSelectedChildren = parentMap && parentMap[nodes.id]?.every((childNodeId: string) => selectedSet.has(childNodeId));
        const checked = selectedSet.has(nodes.id) || allSelectedChildren || false;
        const indeterminate = parentMap && parentMap[nodes.id]?.some((childNodeId: string) =>
            selectedSet.has(childNodeId)
        ) || false;
        if (allSelectedChildren && !selectedSet.has(nodes.id)) {
            console.log("if allSelectedChildren");
            setSelected([...selected, nodes.id]);
        }
        return (
            <TreeItem
                key={nodes.id}
                nodeId={nodes.id}
                label={
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checked}
                                indeterminate={!checked && indeterminate}
                                onChange={(event) =>
                                    getOnChange(event.currentTarget.checked, nodes)
                                }
                                onClick={(e) => e.stopPropagation()}
                            />
                        }
                        label={<>{nodes.name}</>}
                        key={nodes.id}
                    />
                }
            >
                {Array.isArray(nodes.child)
                    ? nodes.child.map((node) => renderTree(node))
                    : null}
            </TreeItem>
        );
    };
    return (
        <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={[]}
            defaultExpandIcon={<ChevronRightIcon />}
        >
            {renderTree(data)}
        </TreeView>
    );
}
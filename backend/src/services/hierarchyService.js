const { isValidEntry } = require("../models/entryModel");
const {
  USER_ID,
  EMAIL_ID,
  COLLEGE_ROLL_NUMBER,
} = require("../config/identity");

function processData(data) {
  const invalidEntries = [];
  const duplicateEdges = [];
  const seenEdges = new Set();
  const validEdges = [];

  for (const raw of data) {
    const entry = typeof raw === "string" ? raw.trim() : String(raw).trim();

    if (!isValidEntry(entry)) {
      invalidEntries.push(raw);
      continue;
    }

    if (seenEdges.has(entry)) {
      if (!duplicateEdges.includes(entry)) {
        duplicateEdges.push(entry);
      }
      continue;
    }

    seenEdges.add(entry);

    const parent = entry[0];
    const child = entry[3];
    validEdges.push({ parent, child });
  }

  const childParentMap = new Map();
  const childrenMap = new Map();
  const allNodes = new Set();

  for (const { parent, child } of validEdges) {
    allNodes.add(parent);
    allNodes.add(child);

    if (childParentMap.has(child)) {
      continue;
    }
    childParentMap.set(child, parent);

    if (!childrenMap.has(parent)) childrenMap.set(parent, []);
    childrenMap.get(parent).push(child);
  }

  const parent = {};

  function find(x) {
    if (parent[x] === undefined) parent[x] = x;
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(a, b) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  }

  for (const { parent: p, child: c } of validEdges) {
    union(p, c);
  }

  const groups = new Map();
  for (const node of allNodes) {
    const r = find(node);
    if (!groups.has(r)) groups.set(r, new Set());
    groups.get(r).add(node);
  }

  function hasCycleInGroup(nodes) {
    const visited = new Set();
    const recStack = new Set();

    function dfs(node) {
      visited.add(node);
      recStack.add(node);
      const children = childrenMap.get(node) || [];

      for (const child of children) {
        if (!nodes.has(child)) continue;

        if (!visited.has(child)) {
          if (dfs(child)) return true;
        } else if (recStack.has(child)) {
          return true;
        }
      }

      recStack.delete(node);
      return false;
    }

    for (const node of nodes) {
      if (!visited.has(node)) {
        if (dfs(node)) return true;
      }
    }

    return false;
  }

  function findGroupRoot(nodes) {
    const roots = [];

    for (const node of nodes) {
      if (!childParentMap.has(node)) {
        roots.push(node);
      }
    }

    if (roots.length === 0) {
      return [...nodes].sort()[0];
    }

    return roots.sort()[0];
  }

  function buildTree(node) {
    const children = childrenMap.get(node) || [];
    const result = {};

    for (const child of children) {
      result[child] = buildTree(child);
    }

    return result;
  }

  function calcDepth(node) {
    const children = childrenMap.get(node) || [];
    if (children.length === 0) return 1;
    return 1 + Math.max(...children.map(calcDepth));
  }

  const hierarchies = [];

  for (const [, nodes] of groups) {
    const cyclic = hasCycleInGroup(nodes);
    const root = findGroupRoot(nodes);

    if (cyclic) {
      hierarchies.push({
        root,
        tree: {},
        has_cycle: true,
      });
    } else {
      const tree = { [root]: buildTree(root) };
      const depth = calcDepth(root);
      hierarchies.push({
        root,
        tree,
        depth,
      });
    }
  }

  hierarchies.sort((a, b) => a.root.localeCompare(b.root));

  const nonCyclicTrees = hierarchies.filter((h) => !h.has_cycle);
  const totalTrees = nonCyclicTrees.length;
  const totalCycles = hierarchies.filter((h) => h.has_cycle).length;

  let largestTreeRoot = "";
  let maxDepth = -1;

  for (const h of nonCyclicTrees) {
    if (
      h.depth > maxDepth ||
      (h.depth === maxDepth && h.root < largestTreeRoot)
    ) {
      maxDepth = h.depth;
      largestTreeRoot = h.root;
    }
  }

  const summary = {
    total_trees: totalTrees,
    total_cycles: totalCycles,
    largest_tree_root: largestTreeRoot,
  };

  return {
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: COLLEGE_ROLL_NUMBER,
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary,
  };
}

module.exports = { processData };

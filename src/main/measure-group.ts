let __globalGroupCache__ = null;

figma.on('currentpagechange', () => {
  initMeasureGroup();
});

export const initMeasureGroup = () => {
  __globalGroupCache__ = figma.currentPage.children.find((node) =>
    node.getPluginData('measurement-group')
  ) as GroupNode | FrameNode;

  if (!__globalGroupCache__) {
    const oldGroup = figma.currentPage.children.find(
      (node) => node.getPluginData('isGlobalGroup') === '1'
    ) as GroupNode | FrameNode;

    if (oldGroup) {
      __globalGroupCache__ = oldGroup;
      figma.root.setPluginData('measurement-group', __globalGroupCache__.id);
    }
  }
};

export const nodeGroup = (node) => {
  const globalGroup = getGlobalGroup();

  if (!globalGroup?.children) {
    return null;
  }

  return (
    (globalGroup.children.find(
      (currentNode) => currentNode.getPluginData('parent') === node.id
    ) as unknown as GroupNode | FrameNode) || null
  );
};

export const getGlobalGroup = () => {
  if (!__globalGroupCache__ || !figma.getNodeById(__globalGroupCache__.id)) {
    __globalGroupCache__ = null;
  }

  return __globalGroupCache__;
};

export const addToGlobalGroup = (node: SceneNode) => {
  let globalGroup: GroupNode = getGlobalGroup();

  if (!globalGroup) {
    globalGroup = figma.group([node], figma.currentPage);
  } else {
    globalGroup.appendChild(node);
  }

  globalGroup.expanded = false;
  globalGroup.locked = true;
  globalGroup.name = `📐 Measurements`;
  __globalGroupCache__ = globalGroup;
  figma.root.setPluginData('measurement-group', globalGroup.id);
};

export const isNodeInsideGlobalGroup = (node: SceneNode): boolean => {
  const globalGroup = getGlobalGroup();

  if (globalGroup === node) {
    return true;
  }

  const parent = node.parent;
  if (parent === globalGroup) {
    return true;
  } else if (parent.type === 'PAGE') {
    return false;
  } else {
    return isNodeInsideGlobalGroup(parent as SceneNode);
  }
};

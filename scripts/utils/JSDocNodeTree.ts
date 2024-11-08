export class JSDocNodeTree {
  _root: any;

  constructor(root: any) {
    this._root = root;
  }

  getChildrenByTag(node: any, tag: any) {
    if (!node || !Array.isArray(node.children)) {
      return [];
    }

    return node.children.filter((child: any) => child.type === tag);
  }

  getName() {
    if (!this._root) {
      return "";
    }
    return this._root.namespace;
  }

  getText() {
    if (!this.hasChildren()) {
      return "";
    }

    let text = "";
    for (const paragraph of this.getChildrenByTag(
      this._root.description,
      "paragraph",
    )) {
      for (const textNode of this.getChildrenByTag(paragraph, "text")) {
        text += textNode.value;
      }
    }

    return text;
  }

  getMethods() {
    if (!this._hasArray(this._root.members, "instance")) {
      return [];
    }

    const methods = [];
    for (const field of this._root.members.instance) {
      if (field.kind !== "function" || this._isPrivateMethod(field)) {
        continue;
      }

      const node = new JSDocNodeTree(field);
      methods.push({
        name: field.name,
        description: node.getText(),
        params: this.getMethodParams(field),
        examples: this.getExamples(field),
        returns: this.getReturnValue(field),
      });
    }

    return methods;
  }

  getMethodParams(field: any) {
    if (!this._hasArray(field, "params")) {
      return [];
    }

    const methodParams = [];
    for (const param of field.params) {
      if (param.title !== "param") {
        continue;
      }

      const node = new JSDocNodeTree(param);
      methodParams.push({
        name: param.name,
        description: node.getText(),
        type: { name: this.getType(param.type) },
        optional: param.type.type === "OptionalType",
      });
    }

    return methodParams;
  }

  getExamples(field: any) {
    if (!this._hasArray(field, "examples")) {
      return [];
    }
    return field.examples.map((example: any) => example.description);
  }

  getReturnValue(field: any) {
    if (!this._hasArray(field, "returns")) {
      return null;
    }

    const returnNode = field.returns[0];
    const descriptionNode = new JSDocNodeTree(returnNode);

    return {
      description: descriptionNode.getText(),
      type: { name: this.getType(returnNode.type) },
    };
  }

  getType(typeNode: any) {
    if (!typeNode) {
      return "";
    }

    if (typeNode.expression) {
      return typeNode.expression.name;
    }

    return typeNode.name || "";
  }

  hasChildren() {
    return this._hasArray(this._root.description, "children");
  }

  _hasArray(node: any, propName: string) {
    if (!this._root) {
      return false;
    }
    return Array.isArray(node[propName]) && node[propName].length;
  }

  _isPrivateMethod(field: any) {
    return field.name.charAt(0) === "_";
  }
}

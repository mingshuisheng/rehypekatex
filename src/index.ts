import { SKIP, visitParents } from "unist-util-visit-parents";
//@ts-ignore
import katex from "katex";
import "katex/dist/katex.css";

export default function rehypeKatex() {
  return function (tree: any) {
    visitParents(tree, "element", function (element: any, parents: any) {
      const classes = Array.isArray(element.properties.className)
        ? element.properties.className
        : [];
      // This class can be generated from markdown with ` ```math `.
      const languageMath = classes.includes("language-math");
      // This class is used by `remark-math` for flow math (block, `$$\nmath\n$$`).
      const mathDisplay = classes.includes("math-display");
      // This class is used by `remark-math` for text math (inline, `$math$`).
      const mathInline = classes.includes("math-inline");
      if (!languageMath && !mathDisplay && !mathInline) {
        return;
      }
      let parent = parents[parents.length - 1];
      let scope = element;
      // If this was generated with ` ```math `, replace the `<pre>` and use
      // display.
      if (
        element.tagName === "code" &&
        languageMath &&
        parent &&
        parent.type === "element" &&
        parent.tagName === "pre"
      ) {
        scope = parent;
        parent = parents[parents.length - 2];
        if (!parent) return;
      }
      const text = element.children[0].value;
      const index = parent.children.indexOf(scope);
      parent.children.splice(index, 1, {
        type: "element",
        properties: { innerHTML: katex.renderToString(text.trim()) },
        tagName: "div",
      });
      return SKIP;
    });
  };
}

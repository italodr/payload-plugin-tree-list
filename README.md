# Payload Tree List Plugin

A plugin for [Payload CMS](https://github.com/payloadcms/payload) that adds a collapsible Tree list view. This plugin depends on the [Payload Nested Docs Plugin](https://github.com/payloadcms/payload/tree/beta/packages/plugin-nested-docs) for its parent implementation.

This plugin is compatible only with Payload CMS version 3.x.

![Payload Tree List Plugin Example with some items open and other closed](./images/payload-plugin-tree-list.png)

## Installation / How to use

**Minimum required payload version: 3.x**

Install the plugin using `yarn add @payloadcms/plugin-nested-docs payload-plugin-tree-list`. Then, add the plugin to your Payload configuration file:

payload.config.ts:

```ts
import { buildConfig } from "payload";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { treeListPlugin } from "payload-plugin-tree-list";


export default buildConfig({
  ...
  plugins: [
    nestedDocsPlugin({ collections: ["posts"] }),
    treeListPlugin({ collections: ["posts"] }),
  ],
  ...
});

```

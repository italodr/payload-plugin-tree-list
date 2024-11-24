import { PaginatedDocs } from "payload";

export function generateTreeList(docs?: PaginatedDocs["docs"]) {
  if (!docs || !docs.length) return [];
  const docsById = docs.reduce((acc, doc, index) => {
    acc[doc.id] = { ...doc, originalIndex: index, children: [] };
    return acc;
  }, {});

  const childIds = new Set();
  const rootDocs = [];

  docs.forEach(doc => {
    if (typeof doc.parent === 'undefined' || doc.parent === null) {
      rootDocs.push(docsById[doc.id]);
    } else {
      docsById[doc.parent].children.push(docsById[doc.id]);
      childIds.add(doc.id);
    }
  });

  return rootDocs.filter(doc => !childIds.has(doc.id));
}

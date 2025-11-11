"use client";
import type { PaginatedDocs } from "payload";

import { ChevronIcon, SelectAll, SelectRow } from "@payloadcms/ui";
import * as Collapsible from "@radix-ui/react-collapsible";
import React, { Suspense, useMemo, useState } from "react";

import { generateTreeList } from "./generateTreeList.js";

const baseClass = "table";

export type Props = {
  readonly columns?: any;
  readonly data: PaginatedDocs["docs"];
  readonly enableRowSelections?: boolean;
  readonly isChildren?: number;
};

export const Table: React.FC<Props> = ({ columns, data, enableRowSelections, isChildren = 0 }) => {
  const [openIndexes, setOpenIndexes] = useState<boolean[]>(Array(data.length).fill(false));
  const activeColumns = columns?.filter((col) => col?.active);
  const docs = useMemo(() => (isChildren ? data : generateTreeList(data)), [data, isChildren]);

  if (!activeColumns || activeColumns.length === 0) {
    return <div>No columns selected</div>;
  }

  const gridRowClass = {
    gridTemplateColumns: `46px repeat(${activeColumns.length}, minmax(100px, 1fr)) 46px`,
  };

  const toggleCollapsible = (index) => {
    setOpenIndexes((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className={`${baseClass} ${baseClass}--tree-list`}>
      <div className="table-collapsible" role="table">
        <div
          className={`table-collapsible__header ${isChildren > 0 ? "sr-only" : ""}`}
          role="row"
          style={gridRowClass}
        >
          {enableRowSelections ? (
            <div id="heading-_select" role="columnheader">
              <SelectAll />
            </div>
          ) : (
            <div aria-hidden="true" role="columnheader" />
          )}
          {activeColumns.map((col, i) => (
            <div id={`heading-${col.accessor}`} key={`table-header-${i}`} role="columnheader">
              {col.Heading}
            </div>
          ))}
          <div aria-hidden="true" role="columnheader" />
        </div>
        {docs &&
          docs.map((row, rowIndex) => {
            const hasChildren = !!(row.children as Record<string, unknown>[])?.length;
            const lastChild = rowIndex === docs.length - 1;
            return (
              <Collapsible.Root
                key={`table-cell-${row.originalIndex}`}
                onOpenChange={() => toggleCollapsible(row.originalIndex)}
                open={openIndexes[row.originalIndex]}
              >
                <div
                  className={`row-${row.originalIndex + 1}${(row.originalIndex + 1) % 2 !== 0 ? " odd" : ""}${isChildren ? " table-collapsible__row-child" : ""}${lastChild ? " table-collapsible__row-last" : ""}`}
                  role="row"
                  style={gridRowClass}
                >
                  {enableRowSelections ? (
                    <div className="cell-_select" role="cell">
                      <SelectRow rowData={row} />
                    </div>
                  ) : (
                    <div aria-hidden="true" role="cell" />
                  )}
                  {activeColumns.map((col, colIndex) => (
                    <Suspense key={colIndex} fallback={<span />}>
                      <div className={`cell-${col.accessor}`} role="cell">
                        {col.renderedCells[row.originalIndex]}
                      </div>
                    </Suspense>
                  ))}
                  <div className="cell-trigger" role="cell">
                    <Collapsible.Trigger asChild>
                      {hasChildren && (
                        <button
                          aria-label="toggle children elements"
                          className="table-collapsible__trigger"
                          type="button"
                        >
                          <ChevronIcon direction={openIndexes[row.originalIndex] ? "up" : "down"} />
                        </button>
                      )}
                    </Collapsible.Trigger>
                  </div>
                </div>
                <Collapsible.Content>
                  <Table
                    columns={columns}
                    data={row.children as Record<string, unknown>[]}
                    enableRowSelections={enableRowSelections}
                    isChildren={isChildren + 1}
                  />
                </Collapsible.Content>
              </Collapsible.Root>
            );
          })}
      </div>
    </div>
  );
};

import React from "react";
import { useEditorKit } from "../../editor/EditorKit";
import { Action } from "../actions/Action";
import { isNodeActive } from "../blocks/Blocks";
import { usePlugin } from "../../plugins/usePlugin";
import { useLastFocused } from "../../editor/LastFocusedNode";
import { Trigger } from "../../plugins/Plugin";

export interface TableActionProps {
  children: React.ReactNode;
}

export const TableAction = (props: TableActionProps) => {
  const { children } = props;
  const { editor } = useEditorKit();
  const plugin = usePlugin("table");
  const onMouseDown = () => {
    if (plugin && plugin.onTrigger) {
      plugin.onTrigger(editor, [], (undefined as unknown) as Trigger);
    }
  };
  const { node } = useLastFocused(editor);
  const isActive = () => isNodeActive(editor, "table");
  const enabled = editor.isNodeSupported("table", node);
  return (
    <Action isActive={isActive} onMouseDown={onMouseDown} disabled={!enabled}>
      {children}
    </Action>
  );
};

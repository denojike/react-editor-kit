import React, { ReactNode } from "react";
import { Menu } from "../menu/Menu";
import { Overlay } from "../../ui/Popup";
import { EditorState } from "../../editor/EditorState";

export interface ContextMenuContribution {
  trigger?: ContextMenuTrigger;
  items: ReactNode[];
}

export interface ContextMenuTrigger {
  node?: string;
  mark?: string;
  selectionExpanded?: boolean;
  matched?(editor: EditorState): boolean;
}

export interface ContextMenuProps {
  items: ReactNode[];
  x: number;
  y: number;
  onClose(): void;
}

export const ContextMenu = (props: ContextMenuProps) => {
  const { x, y, items, onClose } = props;

  return (
    <Overlay onMouseDown={onClose}>
      <Menu style={{ left: x, top: y, position: "fixed" }}>{items}</Menu>
    </Overlay>
  );
};

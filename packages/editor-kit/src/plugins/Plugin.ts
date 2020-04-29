import { Editor, NodeEntry, Range, Element } from "slate";
import { RenderElementProps, RenderLeafProps, ReactEditor } from "slate-react";
import { EditorRange } from "../editor/Ranges";
import { MatchExpression, MatchResult } from "../editor/Matching";
import { CSSProperties } from "react";
import { ContextMenuContribution } from "../features/context-menu/ContextMenu";

export type Trigger = { pattern: MatchExpression; range?: EditorRange };

export type HotKey = {
  pattern: string;
  handle: (
    editor: ReactEditor,
    event: KeyboardEvent,
    pattern: string
  ) => boolean;
};

export interface Plugin {
  triggers?: Trigger[];
  onTrigger?(
    editor: ReactEditor,
    match?: MatchResult[],
    trigger?: Trigger
  ): void;
  styleElement?: (props: RenderElementProps) => CSSProperties | undefined;
  getClasses?: (element: Element) => string | undefined;
  renderElement?: (props: RenderElementProps) => JSX.Element | undefined;
  renderLeaf?: (
    props: RenderLeafProps,
    editor: ReactEditor
  ) => JSX.Element | undefined;
  decorate?: (entry: NodeEntry, editor: ReactEditor) => Range[];
  withPlugin?(editor: ReactEditor): ReactEditor;
  editorStyles?(): string;
  globalStyles?(): string;
  onHotKey?: HotKey[];
  onKeyDown?(
    event: React.KeyboardEvent<HTMLElement>,
    editor: ReactEditor
  ): boolean | undefined;
  onClick?(event: React.MouseEvent<HTMLElement>, editor: Editor): void;
  contextMenu?: ContextMenuContribution[];
  name?: string;
  data?: Object;
  order?: number;
}

//Rewrite triggers e.g. const h1Plugin = createPlugin(H1Plugin, { pattern: "#" });
export const createPlugin = (plugin: Plugin, ...triggers: Trigger[]) => {
  return { ...plugin, triggers };
};

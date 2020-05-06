import React, { Fragment, useState, useRef, FunctionComponent } from "react";
import { Action } from "../actions/Action";
import { ColorPicker, getCssColor } from "./ColorPicker";
import { useEditorKit } from "../../editor/EditorKit";
import { marks } from "../marks/Marks";
import { blockEvent } from "../../ui/Utils";
import { HtmlElementModalPopup } from "../popup/HtmlElementModalPopup";
import { DefaultColors } from "./ColorPickerButton";
import { useLastFocused } from "../../editor/LastFocusedNode";

export interface ColorPickerActionProps {
  children: React.ReactNode;
  colors?: Color[][];
}

export type HexColor = string;
export type HslaColor = { h: number; s: number; l: number; a?: number };
export type RgbaColor = { r: number; g: number; b: number; a?: number };
export type Color = HexColor | HslaColor | RgbaColor | "transparent";

export const ColorPickerAction: FunctionComponent<ColorPickerActionProps> = (
  props: ColorPickerActionProps
) => {
  const { children, colors } = props;
  const { editor } = useEditorKit();
  const { element: lastElement } = useLastFocused(editor);

  const [show, setShow] = useState(false);
  const element = useRef<HTMLElement | null>();

  const toggleShow = () => {
    setShow((show) => !show);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault();
    toggleShow();
  };

  const handleColorChange = (color: Color) => {
    console.log("C", color);
    editor.addMark("color", getCssColor(color));
    setShow(false);
  };

  const handleBackgroundColorChange = (color: Color) => {
    editor.addMark("backgroundColor", getCssColor(color));
    setShow(false);
  };

  const handleRef = (ref: HTMLElement | null) => {
    element.current = ref;
  };

  const colorMark = marks(editor).find((mark) => mark.key === "color");
  const color = colorMark ? colorMark.value : "blue";
  const backgroundColorMark = marks(editor).find(
    (mark) => mark.key === "backgroundColor"
  );
  const backgroundColor = backgroundColorMark
    ? backgroundColorMark.value
    : "blue";

  const enabled = editor.isContentAllowed("fontColor", lastElement);
  const className = !enabled ? "rek-disabled" : "";

  return (
    <Fragment>
      <div className={className} ref={handleRef}>
        <Action onMouseDown={handleMouseDown} disabled={!enabled}>
          {children}
        </Action>
      </div>

      <HtmlElementModalPopup
        show={show}
        element={element.current as HTMLElement}
        onClickOutside={toggleShow}
        location="bottom"
      >
        <ColorPicker
          color={color}
          backgroundColor={backgroundColor}
          onColorChange={handleColorChange}
          onBackgroundColorChange={handleBackgroundColorChange}
          colors={colors || DefaultColors}
        />
      </HtmlElementModalPopup>
    </Fragment>
  );
};

ColorPickerAction.defaultProps = {
  colors: DefaultColors,
};

import React, { CSSProperties, useState, useCallback, ReactNode } from "react";
import { ReactEditor } from "slate-react";
import { EditorIcon, Icon } from "../icons/Icon";
import { usePlugin } from "../../plugins/usePlugin";
import { Labels, EditorLabels } from "../i18n/LabelsPlugin";
import { useEditorKit } from "../../editor/EditorKit";
import { block } from "../../ui/Utils";
import { IconProvider } from "../icons/IconProviderPlugin";
import { Show } from "../../ui/Show";
import { getPosition } from "../popup/Popups";
import { Menu } from "./Menu";

export interface MenuItemProps {
  icon?: EditorIcon | ReactNode;
  text?: string;
  labelKey?: keyof EditorLabels;
  rightText?: string;
  rightLabelKey?: keyof EditorLabels;
  group?: string;
  children?: ReactNode;
  onClick?(editor: ReactEditor): void;
  active?: boolean;
  disabled?: boolean;
}

export const MenuItem = (props: MenuItemProps) => {
  let {
    icon,
    text,
    labelKey,
    rightText,
    rightLabelKey,
    children,
    onClick,
    active,
    disabled,
    ...rest
  } = props;
  const { data: labels } = usePlugin("labels") as Labels;
  const { data: icons } = usePlugin("icon-provider") as IconProvider;
  const { editor } = useEditorKit();
  const [element, setElement] = useState<HTMLElement>();
  const [childMenuElement, setChildMenuElement] = useState<HTMLElement>();

  if (labelKey) {
    text = labels[labelKey];
  }

  if (rightLabelKey) {
    rightText = labels[rightLabelKey];
  }

  const handleNestedRef = useCallback(
    (node: HTMLElement) => {
      setChildMenuElement(node);
    },
    [childMenuElement]
  );

  const handleMouseEnter = (event: React.MouseEvent) => {
    setElement(event.currentTarget as HTMLElement);
  };

  const handleMouseLeave = () => {
    setElement(undefined);
  };
  let style: CSSProperties = {};

  if (element && childMenuElement) {
    const anchor = element.getBoundingClientRect();
    const bounds = childMenuElement.getBoundingClientRect();
    style = getPosition(bounds, anchor, "auto", false, { v: 0 });
    // Need to maintain alignment so override auto's vertical position
    // as this mode doesn't support chaining
    const halfHeight = window.innerHeight / 2;
    if (anchor.top < halfHeight) {
      style.top = 0;
    } else {
      style.top = undefined;
      style.bottom = 0;
    }
  }

  return (
    <div
      className="rek-menu-item"
      data-disabled={disabled}
      data-active={active}
      data-name={text}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(event) => {
        block(event);
        onClick && onClick(editor);
      }}
      {...rest}
    >
      <div className="rek-menu-item-icon">{icon && <Icon icon={icon} />}</div>
      <span className="rek-menu-item-text rek-text">{text}</span>
      <div className="rek-menu-item-right">
        {rightText && <span>{rightText}</span>}
      </div>
      <Show when={children}>{icons.dropdownIcon}</Show>
      <Show when={Boolean(element)}>
        <Menu ref={handleNestedRef} style={style}>
          {children}
        </Menu>
      </Show>
    </div>
  );
};

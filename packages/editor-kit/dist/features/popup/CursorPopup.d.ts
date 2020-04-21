/// <reference types="react" />
import { Location, Offsets } from "./Popups";
export interface CursorPopupProps {
    location?: Location;
    children: JSX.Element;
    onClose?(): void;
    fixed?: boolean;
    offsets?: Offsets;
    expanded?: boolean;
    delay?: number;
}
export declare const CursorPopup: (props: CursorPopupProps) => JSX.Element;
export declare const getCursor: () => {
    range: Range;
    length: number;
};

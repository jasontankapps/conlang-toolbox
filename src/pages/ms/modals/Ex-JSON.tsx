import { MouseEvent } from "react";
import { MSState } from "../../../store/types";

const doJSON = (
	e: MouseEvent<HTMLIonItemElement, globalThis.MouseEvent>,
	msInfo: MSState,
	doDownload: (e: MouseEvent<HTMLIonItemElement, globalThis.MouseEvent>, x: string, y: string) => void
) => {
	const { id, lastSave, ...output } = msInfo;
	doDownload(e, JSON.stringify(output), "json");
};

export default doJSON;

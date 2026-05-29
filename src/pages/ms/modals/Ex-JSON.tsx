import { MouseEvent } from "react";
import { MSState } from "../../../store/types";

const doJSON = (
	e: MouseEvent<HTMLIonItemElement, globalThis.MouseEvent>,
	msInfo: MSState,
	doDownload: (e: MouseEvent<HTMLIonItemElement, globalThis.MouseEvent>, x: string, y: string) => void
) => {
	const output: Partial<MSState> = {...msInfo};
	delete output.id;
	delete output.lastSave;
	doDownload(e, JSON.stringify(output), "json");
};

export default doJSON;

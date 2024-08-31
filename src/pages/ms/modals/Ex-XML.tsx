import { MouseEvent } from "react";
import { MSInfo, MSState } from "../../../store/types";

const doXML = (
	e: MouseEvent<HTMLIonItemElement, globalThis.MouseEvent>,
	msInfo: MSState,
	doDownload: (e: MouseEvent<HTMLIonItemElement, globalThis.MouseEvent>, x: string, y: string) => void
) => {
	const {
		id,
		lastSave,
		title,
		description,
		...rest
	} = msInfo;
	let XML: string =
			'<?xml version="1.0" encoding="UTF-8"?>'
			+ "\n<MorphoSyntaxObject>\n\t<Title>"
			+ title
			+ "</Title>\n\t<Description>"
			+ description
			+ "</Description>\n\t<Bool>\n";
	let bool = "";
	let num = "";
	let text = "";
	Object.keys(rest as MSInfo).forEach((prop) => {
		const value = msInfo[prop as keyof MSInfo];
		if(typeof value === "boolean") {
			// bool
			if (value) {
				bool += `\t\t<Item prop="${prop}"></Item>\n`;
			}
		} else if (typeof value === "number") {
			// num
			num += `\t\t<Item prop="${prop}">${value}</Item>\n`;
		} else {
			// text
			text += `\t\t<Item prop="${prop}">${value}</Item>\n`;
		}
	});
	const output = `${XML}${bool}\t</Bool>\n\t<Num>\n${num}\t</Num>\n\t<Text>\n${text}\t</Text>\n</MorphoSyntaxObject>`;
	doDownload(e, output, "xml");
};

export default doXML;

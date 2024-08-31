import { Clipboard } from "@capacitor/clipboard";
import { UseIonToastResult } from "@ionic/react";
import i18n from "../i18n";
import toaster from "./toaster";


async function copyText (copyString: string, toast: UseIonToastResult, msg: string = "") {
	if(copyString) {
		await Clipboard.write({string: copyString});
		//navigator.clipboard.writeText(copyText);
		const message = msg || i18n.t("CopiedToClipboard");
		return toaster({
			message,
			duration: 1500,
			position: "top",
			toast
		});
	}
	toaster({
		message: i18n.t("NothingToCopy"),
		color: "danger",
		duration: 1500,
		position: "top",
		toast
	});
};

export default copyText;

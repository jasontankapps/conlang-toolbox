import { UseIonToastResult } from '@ionic/react';
import { Dispatch } from 'redux';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import sanitize from 'sanitize-filename';

import toaster from './toaster';
import log from './Logging';
import i18n from '../i18n';

// FOR BROWSER TESTING ONLY
import { saveAs } from 'file-saver';
import { isPlatform } from "@ionic/react";
// FOR BROWSER TESTING ONLY

const doExport = async (
	output: string,
	fileName: string,
	toast: UseIonToastResult,
	dispatch: Dispatch | null,
	encodeUTF: boolean = true
) => {
	const Docs = Directory.Documents;
	const filename = sanitize(fileName) || "defaultfilename.txt";
	const path = sanitize(i18n.t("appTitle", { context: "filename" }));


	// FOR BROWSER TESTING ONLY
	if(!isPlatform("android")) {
		var blob = new Blob([output], {type: "text/plain;charset=utf-8"});
		saveAs(blob, filename);
		toaster({
			message: "File saved as " + filename + " (browser)",
			color: "success",
			toast
		})
		return;
	}
	// FOR BROWSER TESTING ONLY


	try {
		/*const ret =*/ await Filesystem.readdir({
			path,
			directory: Docs
		});
//		console.log('Read dir', ret);
	} catch(e) {
		try {
			/*const ret =*/ await Filesystem.mkdir({
				path,
				directory: Docs,
				recursive: false // like mkdir -p
			});
//			console.log('Made dir', ret);
		} catch(e) {
			log(dispatch, ['doExport: Unable to make directory', e]);
			toast && toaster({
				message: i18n.t("UnableToExport", { error: String(e).replace(/\n+/g, " ") }),
				color: "danger",
				duration: 10000,
				toast
			});
		}
	} finally {
		try {
			/*const result =*/ await Filesystem.writeFile({
				path: path + '/' + filename,
				data: output,
				directory: Docs,
				encoding: encodeUTF ? Encoding.UTF8 : undefined
			});
//			console.log('Wrote file', result);
			toast && toaster({
				message: i18n.t("FileExported", { filename }),
				color: "success",
				duration: 5000,
				toast
			});
		} catch(e) {
			log(dispatch, ['doExport: Unable to write file', e]);
			toast && toaster({
				message: i18n.t("UnableToExport", { error: String(e).replace(/\n+/g, " ") }),
				color: "danger",
				duration: 10000,
				toast
			});
		}
	}
};

export default doExport;

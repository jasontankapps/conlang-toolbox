import {
	BorderStyle,
	Document,
	HeadingLevel,
	ITableBordersOptions,
	Packer,
	Paragraph,
	SectionType,
	Table,
	TableCell,
	TableRow,
	TextRun,
	WidthType
} from "docx";
import { UseIonToastResult } from "@ionic/react";
import { Dispatch } from "redux";

import doExport from '../../../components/ExportServices';
import { DJDisplayMethods, DJExportData, DJRawInfo } from "../../../components/DJOutputFormat";
import log from "../../../components/Logging";
import toaster from "../../../components/toaster";
import { tMaker, tc } from "../../../components/translators";

// FOR BROWSER TESTING ONLY
import { saveAs } from 'file-saver';
import { isPlatform } from "@ionic/react";
// FOR BROWSER TESTING ONLY

type Child = (Paragraph | Table);
interface Section {
	properties: { type: SectionType }
	children: Child[]
}

const headerSpacing = {
	before: 200,
	after: 100
};
const spacing = {
	before: 100,
	after: 100
};
const borders: ITableBordersOptions = {
	top: {
		style: BorderStyle.SINGLE,
		size: 1,
		color: "000000"
	},
	bottom: {
		style: BorderStyle.SINGLE,
		size: 1,
		color: "000000"
	},
	left: {
		style: BorderStyle.SINGLE,
		size: 1,
		color: "000000"
	},
	right: {
		style: BorderStyle.SINGLE,
		size: 1,
		color: "000000"
	},
}

const t = tMaker({ns: "dj"});

const topChart = (
	data: DJRawInfo[],
	showGroupInfo: boolean,
	inputFlag: boolean
) => {
	const noMatchesFound = t("noMatchesMsg");
	const children: Child[] = [];
	data.forEach(grouping => {
		const {
			title,
			description,
			rows,
			found
		} = grouping;
		children.push(new Paragraph({
			text: title,
			heading: HeadingLevel.HEADING_3,
			spacing: headerSpacing
		}));
		showGroupInfo && children.push(new Paragraph({
			children: [
				new TextRun({
					text: description,
					italics: true
				})
			],
			spacing
		}));
		if(inputFlag && found.length === 0) {
			children.push(new Paragraph({
				children: [
					new TextRun({
						text: noMatchesFound
					})
				],
				spacing
			}));
		} else {
			const [firstRow, ...etcRows] = rows;
			const percent = Math.floor(100 / firstRow.length);
			const width = {
				size: percent,
				type: WidthType.PERCENTAGE
			};
			children.push(new Table({
				rows: [
					new TableRow({
						children: firstRow.map(word => {
							return new TableCell({
								children: [
									new Paragraph({
										children: [
											new TextRun({
												text: word,
												bold: true
											})
										]
									})
								],
								borders,
								width
							});
						})
					}),
					...etcRows.map(row => {
						return new TableRow({
							children: row.map(word => {
								return new TableCell({
									children: [
										new Paragraph({
											text: word
										})
									],
									borders,
									width
								})
							})
						});
					})
				]
			}));
		}
	});
	return children;
};

const sideChart = (
	data: DJRawInfo[],
	showGroupInfo: boolean,
	inputFlag: boolean
) => {
	const noMatchesFound = t("noMatchesMsg");
	const children: Child[] = [];
	data.forEach(grouping => {
		const {
			title,
			description,
			rows,
			found
		} = grouping;
		children.push(new Paragraph({
			text: title,
			heading: HeadingLevel.HEADING_3,
			spacing: headerSpacing
		}));
		showGroupInfo && children.push(new Paragraph({
			children: [
				new TextRun({
					text: description,
					italics: true
				})
			],
			spacing
		}));
		if(inputFlag && found.length === 0) {
			children.push(new Paragraph({
				children: [
					new TextRun({
						text: noMatchesFound
					})
				],
				spacing
			}));
		} else {
			children.push(new Table({
				rows: rows.map(row => {
					const [header, ...etc] = row;
					const percent = Math.floor(100 / row.length);
					const width = {
						size: percent,
						type: WidthType.PERCENTAGE
					};
					return new TableRow({
						children: [
							new TableCell({
								children: [
									new Paragraph({
										children: [
											new TextRun({
												text: header,
												bold: true
											})
										]
									})
								],
								borders,
								width
							}),
							...etc.map(word => {
								return new TableCell({
									children: [
										new Paragraph({
											text: word
										})
									],
									borders,
									width
								})
							})
						]
					});
				})
			}));
		}
	});
	return children;
};

const text = (
	data: DJRawInfo[],
	showGroupInfo: boolean,
	inputFlag: boolean
) => {
	const noMatchesFound = t("noMatchesMsg");
	const children: Child[] = [];
	data.forEach(grouping => {
		const {
			title,
			description,
			rows,
			found
		} = grouping;
		children.push(new Paragraph({
			text: title,
			heading: HeadingLevel.HEADING_3,
			spacing: headerSpacing
		}));
		showGroupInfo && children.push(new Paragraph({
			children: [
				new TextRun({
					text: description,
					italics: true
				})
			],
			spacing
		}));
		if(inputFlag && found.length === 0) {
			children.push(new Paragraph({
				children: [
					new TextRun({
						text: noMatchesFound
					})
				],
				spacing
			}));
		} else {
			const output = rows.map((row, i) => {
				const [header, ...etc] = row;
				const maybeBreak: { break?: number } = i > 0 ? (
					{ break: 1 }
				) : (
					{}
				);
				const output = [
					new TextRun({
						text: header + ": ",
						bold: true,
						...maybeBreak
					}),
					new TextRun({
						text: etc.join(", ")
					})
				];
				return output;
			});
			const first = output.shift()!;
			children.push(new Paragraph({
				children: first.concat(...output),
				spacing
			}));
		}
	});
	return children;
};
const sendToCorrectMethod = (
	displayMethod: DJDisplayMethods,
	groups: DJRawInfo[],
	showGroupInfo: boolean,
	inputFlag: boolean
) => {
	switch(displayMethod) {
		case "text":
			return text(groups, showGroupInfo, inputFlag);
		case "chartSH":
			return sideChart(groups, showGroupInfo, inputFlag);
		case "chartTH":
			return topChart(groups, showGroupInfo, inputFlag);
	}
};
const exportDocx = (
	data: DJExportData,
	toast: UseIonToastResult,
	dispatch: Dispatch,
) => {
	const sections: Section[] = [];
	const {
		declensions,
		conjugations,
		other,
		showGroupInfo,
		displayMethod,
		unfound
	} = data;
	const inputFlag = unfound !== null;
	if(declensions) {
		sections.push({
			properties: { type: SectionType.CONTINUOUS },
			children: [
				new Paragraph({
					text: t("Declensions"),
					heading: HeadingLevel.HEADING_2,
					spacing
				}),
				...sendToCorrectMethod(displayMethod, declensions, showGroupInfo, inputFlag)
			]
		})
	}
	if(conjugations) {
		sections.push({
			properties: { type: SectionType.CONTINUOUS },
			children: [
				new Paragraph({
					text: t("Conjugations"),
					heading: HeadingLevel.HEADING_2,
					spacing
				}),
				...sendToCorrectMethod(displayMethod, conjugations, showGroupInfo, inputFlag)
			]
		})
	}
	if(other) {
		sections.push({
			properties: { type: SectionType.CONTINUOUS },
			children: [
				new Paragraph({
					text: t("Other"),
					heading: HeadingLevel.HEADING_2,
					spacing
				}),
				...sendToCorrectMethod(displayMethod, other, showGroupInfo, inputFlag)
			]
		})
	}
	if(unfound && unfound.length > 0) {
		sections.push({
			properties: { type: SectionType.CONTINUOUS },
			children: [
				new Paragraph({
					text: t("UnmatchedWords"),
					heading: HeadingLevel.HEADING_2,
					spacing
				}),
				new Paragraph({
					text: unfound.join(", "),
					spacing
				})
			]
		});
	}
	const doc = new Document({
		creator: tc("appTitle"),
		description: t("declenjugatorDocumentDescription"),
		title: t("declenjugatorDocumentTitle"),
		sections: sections
	});
	const filename = tc(
		"fileFormat",
		{
			title: tc("Declenjugator", { context: "filename" }),
			date: (new Date()).toDateString(),
			extension: "docx"
		}
	);

	// FOR BROWSER TESTING ONLY
	if(!isPlatform("android")) {
		Packer.toBlob(doc).then((blob) => {
			saveAs(blob, filename);
			toaster({
				message: "File saved as " + filename + " (browser)",
				color: "success",
				toast
			})
		}).catch((e = "Error blob") => {
			log(dispatch, ["DJExport / Packer / toBlob", e]);
			toaster({
				message: "Unable to save file (browser): " + e,
				color: "success",
				toast
			});
		});
		return;
	}
	// FOR BROWSER TESTING ONLY


	Packer.toBase64String(doc).then((output) => {
		doExport(output, filename, toast, null, false)
			.catch((e = "Error doexport docx") => {
				log(dispatch, ["DJExport / Packer / doExport", e]);//
				toaster({
					message: tc("UnableToExport", { error: `${e}` }),
					color: "success",
					toast
				});
			});
		toaster({
			message: tc("FileExported", { filename }),
			color: "success",
			toast
		});
	}).catch((e = "Error 64") => {
		log(dispatch, ["DJExport / Packer", e]);
		toaster({
			message: tc("UnableToExport", { error: `64 ${e}` }),
			color: "success",
			toast
		});
	});

	return
};

export default exportDocx;

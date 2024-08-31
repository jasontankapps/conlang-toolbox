import React, { ReactElement } from "react";
import { Dispatch } from "redux";
import { UseIonToastResult } from "@ionic/react";

import { tMaker, tc } from "../components/translators";
import { DJCustomInfo, DJGroup, RegexPair } from "../store/types";
import exportDocx from "../pages/dj/modals/ExportToDocx";
import ltr from "./LTR";
import log from "./Logging";
import toaster from "./toaster";
import doExport from "./ExportServices";

const t = tMaker({ns: "dj"});

export type DJDisplayMethods = "text" | "chartTH" | "chartSH";
export type DJFormatTypes = "text" | "csv" | "docx";
export type DJTypeObject = {[key in keyof DJCustomInfo]?: boolean};
export type DJChartDirection = "h" | "v";
type Triple = [string, string, string];
export type DJDisplayData = null | {
	input: string[]
	showGroupInfo: boolean
	showExamples: boolean
	wordsMatchOneTimeOnly: boolean
};
type RowClasses = "headers" | "examples" | "striped" | null;
type ColumnClasses = "headers" | "examples" | "striped" | "first" | "mid" | "mid striped" | null;
export interface DJRawInfo {
	title: string
	groupId: string
	description: string
	rows: string[][]
	rowIds: string[]
	rowClasses: RowClasses[]
	columnIds: string[]
	columnClasses: ColumnClasses[]
	found: string[]
	missing: string[]
	className: string
}
export interface DJExportData {
	declensions: null | DJRawInfo[]
	conjugations: null | DJRawInfo[]
	other: null | DJRawInfo[]
	unfound?: string[] | null
	showGroupInfo: boolean
	displayMethod: DJDisplayMethods
}

const findStem = (
	word: string,
	group: DJGroup
): string | null => {
	const { startsWith, endsWith, regex } = group;
	if(regex) {
		const [matcher, result] = regex;
		const rx = new RegExp(matcher);
		if(word.match(rx)) {
			return word.replace(rx, result);
		}
		return null;
	}
	const starters = startsWith.slice();
	while(starters.length) {
		const start = starters.shift()!;
		if(!word.indexOf(start)) {
			// index === 0 means we found a match
			return word.slice(start.length);
		}
	}
	const enders = endsWith.slice();
	const length = word.length;
	while(enders.length) {
		const end = enders.shift()!;
		const negativeEndLength = 0 - end.length;
		const target = length + negativeEndLength;
		if(word.lastIndexOf(end) === target) {
			// we found a match
			return word.slice(0, negativeEndLength);
		}
	}
	// Unable to find any matches.
	return null;
};

const changeWord = (
	word: string,
	prefix: string = "",
	suffix: string = "",
	regex: RegexPair | undefined | null = null
): string => {
	if(regex) {
		const [matcher, result] = regex;
		const rx = new RegExp(matcher);
		return word.replace(rx, result);
	}
	return prefix + word + suffix;
};

const getGroupDescription = (group: DJGroup): Triple => {
	const { title, id, appliesTo, startsWith, endsWith, separator, regex } = group;
	let parameters: string = "";
	if(regex) {
		const arrow = (ltr() ? "⟶" : "⟵");
		const [match, replace] = regex;
		parameters = `/${match}/ ${arrow} ${replace}`;
	} else {
		const temp: string[] = [];
		startsWith.forEach(line => temp.push(line + "-"));
		endsWith.forEach(line => temp.push("-" + line));
		parameters = temp.join(separator);
	}
	const matches = t("matchesParameters", { params: parameters });
	if(appliesTo) {
		return [title, id, `${appliesTo}; ${matches}`];
	}
	return [title, id, matches];
};

export const findCommons = (input: string[][]): string[] => {
	const listings = input.slice();
	const length = listings.length;
	if(length < 2) {
		return listings.shift() || [];
	}
	const output: string[] = [];
	const first = listings.shift()!;
	const last = listings.pop()!;
	const info: {[key: string]: number} = {};
	first.forEach(word => {
		info[word] = 2; // 1 + one extra to match the final length
	});
	listings.forEach(list => {
		list.forEach(word => {
			const val = info[word];
			if(val) {
				info[word] = val + 1;
			}
		});
	});
	last.forEach(word => {
		if(info[word] === length) {
			// It's in all the lists
			output.push(word);
		}
	});
	return output;
}

const WORD = t("wordBlock");
const STEM = t("stemBlock");
const EXAMPLE = t("Example");
const EXAMPLES = t("Examples");
const ERROR = tc("error");
const getDJRawInfo = (
	group: DJGroup,
	displayMethod: DJDisplayMethods,
	typeString: string,
	input: string[],
	showExamples: boolean
): DJRawInfo => {
	const missing: string[] = [];
	// Gather group info
	const found: string[] = [];
	const [title, groupId, description] = getGroupDescription(group);
	const { declenjugations } = group;
	const rows: string[][] = [];
	const rowIds: string[] = [];
	const rowClasses: RowClasses[] = [];
	const columnIds: string[] = [];
	const columnClasses: ColumnClasses[] = [];
	let className: string = displayMethod === "text" ? "text" : "chart";
	if(displayMethod === "chartSH") {
		// header example item1 item2
		// header example item1 item2
		className += " sideHeaders";
		const stems: string[] = [];
		columnClasses.push("headers");
		showExamples && columnClasses.push("examples");
		columnClasses.push(null);
		input.forEach(word => {
			const stem = findStem(word, group);
			if(stem) {
				stems.push(stem);
				found.push(word);
				// col ids are the word + stem
				columnIds.push(`${word}:${stem}`);
			} else {
				missing.push(word);
			}
		});
		const headers: string[] = [...found];
		rowClasses.push(null);
		if(showExamples) {
			headers.unshift(EXAMPLE);
		}
		rows.push([typeString, ...headers]);
		declenjugations.forEach((unit, i) => {
			const { id, title, prefix, suffix, regex, useWholeWord } = unit;
			const row: string[] = [title];
			if (showExamples) {
				row.push(changeWord(useWholeWord ? WORD : STEM, prefix, suffix, regex));
			}
			row.push(
				...found.map((word, i) => changeWord(
					useWholeWord ? word : stems[i]!,
					prefix,
					suffix,
					regex
				)
			));
			rows.push(row);
			// row ids are the declenjugation ids
			rowIds.push(id);
			// stripe every other row
			rowClasses.push((i % 2) ? null : "striped");
		});
	} else {
		//////// chartTH and text
		// header  header
		// example example
		// item1   item1
		// item2   item2
		displayMethod !== "text" && (className += " topHeaders");
		const headers: string[] = [typeString];
		const examples: string[] = [EXAMPLES];
		rowClasses.push("headers");
		rowIds.push("headerRow");
		columnClasses.push("first");
		if(showExamples) {
			rowClasses.push("examples");
			rowIds.push("exampleRow");
		}
		// Get header info, plus columnar info
		declenjugations.forEach((unit, i) => {
			const { title, id, useWholeWord, prefix, suffix, regex } = unit;
			headers.push(title);
			columnIds.push(id);
			columnClasses.push((i % 2) ? "mid" : "mid striped");
			showExamples && examples.push(
				changeWord(useWholeWord ? WORD : STEM, prefix, suffix, regex)
			);
		});
		// Go through each word and make a row out of each
		input.forEach(word => {
			const stem = findStem(word, group);
			if(stem) {
				found.push(word);
				rowIds.push(`${word}:${stem}`);
				const wordRow: string[] = [word];
				// Make a column out of each declenjugation of this word
				declenjugations.forEach(unit => {
					const { prefix, suffix, regex, useWholeWord } = unit;
					wordRow.push(changeWord(useWholeWord ? word : stem, prefix, suffix, regex));
				});
				rows.push(wordRow);
				rowClasses.push(null);
			} else {
				missing.push(word);
			}
		});
		// Add examples row (if needed)
		showExamples && rows.unshift(examples);
		// Add row of headers
		rows.unshift(headers);
	}
	return {
		title,
		groupId,
		description,
		rows,
		rowIds,
		rowClasses,
		columnIds,
		columnClasses,
		found,
		missing,
		className
	};
};

const getDJRawInfoLoop = (
	groups: DJGroup[],
	displayMethod: DJDisplayMethods,
	title: string,
	input: string[],
	showExamples: boolean,
	wordsMatchOneTimeOnly: boolean
) => {
	const groupsCopy = groups.slice();
	let currentInput = input.slice();
	const unfound: string[][] = [];
	const infoOutput: DJRawInfo[] = [];
	while(groupsCopy.length > 0) {
		const info = getDJRawInfo(groupsCopy.shift()!, displayMethod, title, currentInput, showExamples);
		if(wordsMatchOneTimeOnly) {
			currentInput = info.missing.slice();
		} else {
			unfound.push(info.missing.slice());
		}
		infoOutput.push(info);
	}
	return {
		rawInfo: infoOutput,
		continuing: currentInput,
		notContinuing: wordsMatchOneTimeOnly ? null : unfound
	}
};

// Display

const getTextFromChart = (rows: string[][]): string[] => {
	const output: string[] = [];
	const maxes = (rows[0] || []).map(word => word.length);
	// Find max lengths
	rows.forEach(row => {
		row.forEach((word, i) => (maxes[i] = Math.max(maxes[i], word.length)));
	});
	// Add to output
	rows.forEach(row => {
		const mapped = row.map((word, i) => {
			const max = maxes[i] || 0;
			let padded = word;
			while(padded.length < max) {
				padded = padded + " ";
			}
			return padded;
		});
		output.push(mapped.join(" "));
	});
	return output;
};

const FORMS = t("Forms")
const NOMATCHESFOUND = t("noMatchesMsg"); // NEED TO SEE IF MEMO() NEEDED IN MAIN DJ PAGES
export const display = (
	groups: DJGroup[],
	data: DJDisplayData,
	displayMethod: DJDisplayMethods,
	type: string
): [ReactElement[], string[], string] => {
	const output: ReactElement[] = [
		<div className="djTypeTitle" key={`${type}-title`}>{type}</div>
	];
	const copyStrings: string[] = [type.charAt(0).toLocaleUpperCase() + type.slice(1)];
	const typeString = type === "other" ? FORMS : copyStrings[0];
	const unfound: string[][] = [];
	const {
		input = [],
		showGroupInfo = true,
		showExamples = true,
		wordsMatchOneTimeOnly = false
	} = data || {};
	let currentInput = [...input];
	// Gather group info
	groups.forEach(group => {
		const {
			title,
			groupId,
			description,
			rows,
			rowIds,
			rowClasses,
			columnIds,
			columnClasses,
			found,
			missing,
			className
		} = getDJRawInfo(group, displayMethod, typeString, currentInput, showExamples);
		// Update found/missing
		if(wordsMatchOneTimeOnly) {
			currentInput = [...missing];
		} else {
			unfound.push(missing);
		}
		// Output
		const textDisplayActive = displayMethod === "text";
		const inner: ReactElement[] = [];
		const copyRows: string[][] = [];
		if(!data || (found.length > 0 || showExamples)) {
			const maxRowClass = rowClasses.length - 1;
			const maxColClass = columnClasses.length - 1;
			rows.forEach((row, i) => {
				copyRows.push([...row]);
				const rowId = rowIds[i] || ERROR;
				const rowClass = rowClasses[i > maxRowClass ? maxRowClass : i];
				const cells: ReactElement[] = [];
				const maxRow = row.length - 1;
				row.forEach((col, j) => {
					const colId = columnIds[j] || ERROR;
					const colClass = columnClasses[j > maxColClass ? maxColClass : j];
					const period = (j === maxRow) ? "." : "";
					if(textDisplayActive) {
						// Text display
						if(j > 0) {
							cells.push(
								<React.Fragment key={`${groupId}:cell:${rowId}:${colId}:${col}`}>
									{(j === 1) ? ' ' : ', '}<span
										className={colClass ? `${colClass} word` : "word"}
									>{col}{period}</span>
								</React.Fragment>
							);
						} else {
							cells.push(
								<span
									className={colClass ? `${colClass} word` : "word"}
									key={`${groupId}:word:${rowId}:${colId}:${col}`}
								>{col}{period || ":"}</span>
							);
						}
					} else {
						// Chart display
						cells.push(
							<div
								className={colClass ? `${colClass} cell` : "cell"}
								key={`${groupId}:cell:${rowId}:${colId}:${col}`}
							>{col}</div>
						);
					}
				});
				inner.push(
					<div
						className={rowClass ? `${rowClass} row` : "row"}
						key={`${groupId}:row:${rowId}`}
					>{cells}</div>
				);
			});
		}
		const guts = inner.length > 0 ? (
			<div className="declenjugations">
				{inner}
			</div>
		) : <></>;
		// Send output
		output.push(
			<div
				key={`${type}:displayGroup:${className}:${groupId}`}
				className={"djOutputGroup " + className}
			>
				<div className="header">
					<div className="title">{title}</div>
					{ showGroupInfo ? <div className="description">{description}</div> : <></> }
				</div>
				{guts}
				{(!data || found.length > 0) ?
					<></>
				:
					<div className="unmatched">{NOMATCHESFOUND}</div>
				}
			</div>
		);
		// Send copy strings
		copyStrings.push("", title);
		showGroupInfo && copyStrings.push(description);
		if(textDisplayActive) {
			// Text display
			copyRows.forEach(row => {
				const [title, first,  ...rest] = row;
				rest.unshift(`${title}: ${first || ""}`);
				copyStrings.push(rest.join(", "));
			});
		} else {
			// Chart display
			copyStrings.push(...getTextFromChart(copyRows));
		}
		(data && (found.length === 0)) && copyStrings.push(NOMATCHESFOUND);
	});
	return [
		output,
		wordsMatchOneTimeOnly ? currentInput : findCommons(unfound),
		copyStrings.join("\n")
	];
};

const DECLENSIONS = t("Declensions");
const CONJUGATIONS = t("Conjugations");
export const exporter = (
	whatToExport: DJTypeObject,
	declensions: DJGroup[],
	conjugations: DJGroup[],
	other: DJGroup[],
	data: DJDisplayData,
	displayMethod: DJDisplayMethods,
	format: DJFormatTypes,
	showUnmatched: boolean | null,
	dispatch: Dispatch,
	toast: UseIonToastResult
) => {
	const {
		input = [],
		showGroupInfo = true,
		showExamples = true,
		wordsMatchOneTimeOnly = false
	} = data || {};
	const {declensions: dec, conjugations: con, other: oth} = whatToExport;
	const unfound: string[][] = [];
	let currentInput = [...input];
	const exportData: DJExportData = {
		declensions: null,
		conjugations: null,
		other: null,
		showGroupInfo,
		displayMethod
	};
	if(dec) {
		const {
			rawInfo,
			continuing,
			notContinuing
		} = getDJRawInfoLoop(
			declensions,
			displayMethod,
			DECLENSIONS,
			currentInput,
			showExamples,
			wordsMatchOneTimeOnly
		);
		exportData.declensions = rawInfo;
		currentInput = continuing;
		if(notContinuing) {
			unfound.push(...notContinuing);
		}
	}
	if(con) {
		const {
			rawInfo,
			continuing,
			notContinuing
		} = getDJRawInfoLoop(
			conjugations,
			displayMethod,
			CONJUGATIONS,
			currentInput,
			showExamples,
			wordsMatchOneTimeOnly
		);
		exportData.conjugations = rawInfo;
		currentInput = continuing;
		if(notContinuing) {
			unfound.push(...notContinuing);
		}
	}
	if(oth) {
		const {
			rawInfo,
			continuing,
			notContinuing
		} = getDJRawInfoLoop(
			other,
			displayMethod,
			FORMS,
			currentInput,
			showExamples,
			wordsMatchOneTimeOnly
		);
		exportData.other = rawInfo;
		currentInput = continuing;
		if(notContinuing) {
			unfound.push(...notContinuing);
		}
	}
	if(showUnmatched) {
		exportData.unfound = wordsMatchOneTimeOnly ? currentInput : findCommons(unfound);
	} else if (showUnmatched === null) {
		exportData.unfound = null;
	}
	let formatted: string = "";
	let extension: string = "";
	switch(format) {
		case "text":
			extension = "txt";
			formatted = exportText(exportData);
			break;
		case "csv":
			extension = "csv";
			formatted = exportCSV(exportData);
			break;
		case "docx":
			extension = "docx";
			return exportDocx(exportData, toast, dispatch);
		default:
			log(dispatch, [`Error in DJOutputFormat: bad format "${format}"`]);
	}
	if(formatted && extension) {
		return doExport(
			formatted,
			tc(
				"fileFormat",
				{
					title: tc("Declenjugator", { context: "filename" }),
					date: (new Date()).toDateString(),
					extension
				}
			),
			toast,
			dispatch
		);
	}
	return toaster({
		message: t("errorBadInternalFormatMsg"),
		color: "danger",
		toast
	});
};

// Export: Text

const getExportText = (
	info: DJRawInfo[],
	showGroupInfo: boolean,
	chart: boolean,
	inputFlag: boolean
): string[] => {
	const output: string[] = [];
	const noMatches = "--" + NOMATCHESFOUND;
	info.forEach(declenjugation => {
		const {
			title,
			description,
			rows,
			found
		} = declenjugation;
		output.push("", title);
		showGroupInfo && output.push(description);
		if(inputFlag && found.length === 0) {
			output.push(noMatches)
		} else if(chart) {
			output.push(...getTextFromChart(rows));
		} else {
			output.push(...rows.map(row => {
				const [header, ...etc] = row;
				return `${header}: ${etc.join(", ")}`;
			}));
		}
	});
	return output;
};

const UNMATCHEDWORDS = t("UnmatchedWords");
const exportText = (data: DJExportData) => {
	const {
		declensions,
		conjugations,
		other,
		showGroupInfo,
		displayMethod,
		unfound
	} = data;
	const output: string[] = [];
	const chart = displayMethod !== "text";
	const inputFlag = unfound !== null;
	if(declensions) {
		output.push(
			DECLENSIONS
			+ "\n"
			+ getExportText(declensions, showGroupInfo, chart, inputFlag).join("\n")
		);
	}
	if(conjugations) {
		output.push(
			CONJUGATIONS
			+ "\n"
			+ getExportText(conjugations, showGroupInfo, chart, inputFlag).join("\n")
		);
	}
	if(other) {
		output.push(
			FORMS
			+ "\n"
			+ getExportText(other, showGroupInfo, chart, inputFlag).join("\n")
		);
	}
	if(unfound && unfound.length > 0) {
		output.push(
			UNMATCHEDWORDS
			+ "\n\n"
			+ unfound.join(", ")
		);
	}
	return output.join("\n\n\n");
};

// Export: CSV (chart)

const quote = (input: string): string => `"${input}"`;

const getExportCSV = (info: DJRawInfo[], showGroupInfo: boolean, inputFlag: boolean): string[] => {
	const output: string[] = [];
	const noMatches = quote("--" + NOMATCHESFOUND);
	info.forEach(declension => {
		const {
			title,
			description,
			rows,
			found
		} = declension;
		output.push("", quote(title));
		showGroupInfo && output.push(quote(description));
		if(inputFlag && found.length === 0) {
			output.push(noMatches);
		} else {
			output.push(...rows.map(row => {
				return row.map(col => quote(col)).join(",");
			}));
		}
	});
	return output;
};

const exportCSV = (data: DJExportData) => {
	const {
		declensions,
		conjugations,
		other,
		showGroupInfo,
		unfound
	} = data;
	const output: string[] = [];
	const inputFlag = unfound !== null;
	if(declensions) {
		output.push(
			quote(DECLENSIONS)
			+ "\n"
			+ getExportCSV(declensions, showGroupInfo, inputFlag).join("\n")
		);
	}
	if(conjugations) {
		output.push(
			quote(CONJUGATIONS)
			+ "\n"
			+ getExportCSV(conjugations, showGroupInfo, inputFlag).join("\n")
		);
	}
	if(other) {
		output.push(
			quote(FORMS)
			+ "\n"
			+ getExportCSV(other, showGroupInfo, inputFlag).join("\n")
		);
	}
	if(unfound && unfound.length > 0) {
		output.push(
			quote(UNMATCHEDWORDS)
			+ `\n`
			+ unfound.map(word => quote(word)).join("\n")
		);
	}
	return output.join("\n\n\n");
};

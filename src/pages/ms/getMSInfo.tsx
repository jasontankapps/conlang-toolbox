import { MSBool, MSText } from '../../store/types';

import {

	MSHeader,
	MSRange,
	MSModal,
	MSCheckboxes,
	MSTextbox,
	MSSections,
	SpecificMSPageData
} from './MorphoSyntaxElements';
import msRawInfo from './ms.json';
import { cleanerObject } from '../../store/blankAppState';

interface MSJson {
	sections: string[]
	"01": SpecificMSPageData[]
	"02": SpecificMSPageData[]
	"03": SpecificMSPageData[]
	"04": SpecificMSPageData[]
	"05": SpecificMSPageData[]
	"06": SpecificMSPageData[]
	"07": SpecificMSPageData[]
	"08": SpecificMSPageData[]
	"09": SpecificMSPageData[]
	"10": SpecificMSPageData[]
}

function validateJson (object: MSJson): asserts object is MSJson {
	const { sections, ...etc } = object;
	if(sections.some((section, i) => section !== MSSections[i])) {
		throw new TypeError("Sections property is invalid");
	}
	const pairs = Object.entries(etc) as [string, SpecificMSPageData[]][];
	if(pairs.length !== MSSections.length || pairs.some((pair) => {
		const [prop, value] = pair;
		if(MSSections.indexOf(prop) > -1) {
			// found a prop
			if(value.length > 0 && value.every(unit => {
				switch(unit.tag) {
					case "Header":
						validateHeader(unit as MSHeader);
						break;
					case "Range":
						validateRange(unit as MSRange);
						break;
					case "Modal":
						validateModal(unit as MSModal);
						break;
					case "Checkboxes":
						validateCheckboxes(unit as MSCheckboxes);
						break;
					case "Text":
						validateTextbox(unit as MSTextbox);
						break;
						// For the above, if we didn't error out, we're ok.
					default:
						// Not a correct tag
						throw new TypeError(`Invalid tag "${unit.tag}" in ${prop}`);
				}
				return true;
			})) {
				if(value[0].tag !== "Header") {
					throw new TypeError("First element of a section must be a Header");
				}
				// We're ok to go.
				return false;
			}
			throw new TypeError(`"${prop}" has no contents`);
		}
		throw new TypeError(`Invalid section "${prop}"`);
	})) {
		throw new TypeError("Invalid number of sections");
	}
}

function validateHeader (object: MSHeader): asserts object is MSHeader {
	const { tag, level, heads, content, ...etc } = object;
	let ok = false;
	if(tag === "Header") {
		if(level >= 1 && level <= 4 && Math.round(level) === level) {
			if(typeof content === "string") {
				if(Object.keys(etc).length === 0) {
					if((heads.length === 1 && heads[0] === true) || heads.every(prop => {
						return (
							cleanerObject.msBool.indexOf(prop as MSBool) > -1
							|| cleanerObject.msText.indexOf(prop as MSText) > -1
						);
					})) {
						ok = true;
					}
				}
			}
		}
	}
	if(!ok) {
		throw TypeError("Invalid Header Tag");
	};
}

function validateRange(object: MSRange): asserts object is MSRange {
	const { tag, prop, start, end, max, spectrum, ...etc } = object;
	let ok = false;
	if(tag === "Range") {
		if(Object.keys(etc).length === 0) {
			if(typeof start === "string" && typeof end === "string") {
				if(spectrum === undefined || spectrum === true || spectrum === false) {
					if(max === undefined || (max > 0 && Math.round(max) === max)) {
						ok = (cleanerObject.msNum.indexOf(prop) > -1);
					}
				}
			}
		}
	}
	if(!ok) {
		console.log({...object});
		throw TypeError("Invalid Range Tag");
	};
}

function validateModal (object: MSModal): asserts object is MSModal {
	const { tag, title, content, label, ...etc } = object;
	if(
		(tag !== "Modal")
		|| (typeof title !== "string")
		|| (typeof content !== "string")
		|| (label !== undefined && typeof label !== "string")
		|| Object.keys(etc).length > 0
	){
		throw TypeError("Invalid Modal Tag");
	};
}

function validateTextbox (object: MSTextbox): asserts object is MSTextbox {
	const { tag, prop, content, rows, ...etc } = object;
	let ok = false;
	if(tag === "Text") {
		if(Object.keys(etc).length === 0) {
			if(typeof content === "string") {
				if(rows === undefined || (rows > 0 && Math.round(rows) === rows)) {
					if(cleanerObject.msText.indexOf(prop) > -1) {
						ok = true;
					}
				}
			}
		}
	}
	if(!ok) {
		throw TypeError("Invalid Range Tag");
	};
}

function validateCheckboxes (object: MSCheckboxes): asserts object is MSCheckboxes {
	const { tag, boxes, display, ...etc } = object;
	let ok = false;
	if(tag === "Checkboxes") {
		if(Object.keys(etc).length === 0) {
			if(boxes.every(prop => cleanerObject.msBool.indexOf(prop) > -1)) {
				const { boxesPerRow, class: clss, labelClass, singleHeader, export: expo, i18, ...etc } = display;
				if(boxesPerRow > 0 && Math.round(boxesPerRow) === boxesPerRow) {
					if(Object.keys(etc).length === 0) {
						if(typeof i18 === "string") {
							if(clss === undefined || typeof clss === "string") {
								if(labelClass === undefined || typeof labelClass === "string") {
									if(singleHeader === undefined || typeof singleHeader === "string") {
										if(expo === undefined) {
											ok = true;
										} else {
											const { labelOverrideDocx, i18, header, labels, textOutputBooleans, ...etc} = expo;
											if(Object.keys(etc).length === 0) {
												if(labelOverrideDocx === undefined || labelOverrideDocx === true || labelOverrideDocx === false) {
													if(typeof i18 === "string") {
														if(header === undefined || typeof header === "string") {
															if(labels === undefined || labels.every(label => typeof label === "string")) {
																if(textOutputBooleans === undefined || textOutputBooleans.every(row => row.every(bit => cleanerObject.msBool.indexOf(bit) > -1))) {
																	ok = true;
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	if(!ok) {
		console.log({...object});
		throw TypeError("Invalid Checkbox Tag");
	};
}

const msInfo = (() => {
	validateJson(msRawInfo as MSJson);
	return msRawInfo;
})();

export default msInfo;


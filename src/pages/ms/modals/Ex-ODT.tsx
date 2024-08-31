export {};
//import { MouseEvent } from "react";
//import {
//	TextDocument,
//	Paragraph as P,
//	ParagraphStyle,
//	Typeface
//} from 'simple-odf';
//import {
//	MorphoSyntaxTextObject,
//	MorphoSyntaxNumberObject,
//	MorphoSyntaxBoolObject,
//	MorphoSyntaxObject
//} from '../../../components/ReduxDucksTypes';
//import { exporter, display, anything } from './MorphoSyntaxElements';
//import ms from './ms.json';
//
//
//const doODT = (
//	e: Event,
//	msInfo: MorphoSyntaxObject,
//	doDownload: (e: MouseEvent<HTMLIonItemElement, globalThis.MouseEvent>, x: string, y: string) => void
//) => {
//	const bool = msInfo.bool;
//	const num = msInfo.num;
//	const text = msInfo.text;
//	const msSections: string[] = ms.sections
//	const doc = new TextDocument();
//	const body = doc.getBody();
//	const meta = doc.getMeta();
//	meta.setTitle(msInfo.title + " - MorphoSyntax Document");
//
//	const bold = new ParagraphStyle();
//	bold.setTypeface(Typeface.Bold);
//
//	body.addHeading(msInfo.title, 1);
//	body.addParagraph(msInfo.description || "[NO DESCRIPTION ENTERED]")
//
//	msSections.forEach((sec: string) => {
//		const msSection = (ms[sec as keyof typeof ms] as anything[]);
//		msSection.forEach((item: anything) => {
//			msSection.forEach((item: anything) => {
//				let content = item.content || "";
//				switch(item.tag) {
//					case "Header":
//						body.addHeading(content, item.level);
//						break;
//					case "Range":
//						const min = 0;
//						const max = item.max || 4;
//						const value = num[item.prop as keyof MorphoSyntaxNumberObject] || min;
//						if(item.spectrum) {
//							const div = 100 / (max - min);
//							const lesser = Math.floor(((value - min) * div) + 0.5);
//							body.addParagraph(
//								String(lesser) + "% " + (item.start || "[MISSING]") + '\n'
//								+ String(100 - lesser) + "% " + (item.end || "[MISSING]")
//							);
//						} else {
//							let counter = min;
//							let p: P = body.addParagraph(item.start || "[MISSING]");
//							while(counter <= max) {
//								let c = String(counter);
//								if(counter === value) {
//									p.addText(" (" + c + ")");
//								} else {
//									p.addText(" " + c);
//								}
//								counter++;
//							}
//							p.addText(" " + (item.end || "[MISSING]"));
//						}
//						break;
//					case "Text":
//						body.addParagraph(content || "[TEXT PROMPT]")
//						let tArr: string[] = (text[item.prop as keyof MorphoSyntaxTextObject] || "[NO TEXT ENTERED]").split(/\n\n+/);
//						tArr.forEach((t: string, i: number) => {
//							let p: P = body.addParagraph("");
//							t.split(/\n/).forEach((x: string, j: number) => {
//								if(j > 0) {
//									p.addText("\n" + x);
//								} else {
//									p.addText(x);
//								}
//							});
//						});
//						break;
//					case "Checkboxes":
//						const disp: display = item.display!;
//						const expo: exporter = disp.export!;
//						const output = expo.output;
//						if(output) {
//							const map = output.map((bit) => bit.map((b) => {
//								if(typeof b === "string") {
//									return b;
//								}
//								const found: string[] = [];
//									b.forEach((pair) => {
//									if(bool[pair[0] as keyof MorphoSyntaxBoolObject]) {
//										found.push(pair[1]);
//									}
//								});
//								if (found.length === 0) {
//									return "[NONE SELECTED]";
//								} else if (found.length === 1) {
//									return found[0];
//								} else if (found.length === 2) {
//									return found[0] + " and " + found[1];
//								}
//								const final = found.pop();
//								return found.join(", ") + ", and " + final;
//							}).join(""));
//							body.addParagraph(map.join("\n"));
//						} else {
//							const title = expo.title || "";
//							const boxes = item.boxes!.slice();
//							const labels = (expo.labels || disp.labels || disp.rowLabels || boxes).slice();
//							let result = "";
//							let found: string[] = [];
//							while(boxes.length > 0) {
//								const box = boxes.shift();
//								const label = labels.shift();
//								if(bool[box as keyof MorphoSyntaxBoolObject]) {
//									found.push(label || "[ERROR]");
//								}
//							}
//							if (found.length === 0) {
//								result = "[NONE SELECTED]";
//							} else if (found.length === 1) {
//								result = found[0];
//							} else if (found.length === 2) {
//								const final = found.pop();
//								result = (found.join(", ") + ", and " + final);
//							}
//							body.addParagraph(title + " " + result);
//						}
//					}
//			});
//		});
//	});
//
//
//	// FOR BROWSER TESTING ONLY
//	saveAs(new Blob([doc.toString()], {type: "application/vnd.oasis.opendocument.text;charset=utf-8"}), msInfo.title + " - " + (new Date()).toDateString() + ".odt")
//	// FOR BROWSER TESTING ONLY
//
//
//	doDownload(e, doc.toString(), "odt");
//};
//
//
//export default doODT;

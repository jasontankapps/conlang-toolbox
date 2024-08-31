import React, { MouseEvent, useCallback, useMemo, FC } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonContent,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonTitle,
	IonModal,
	IonFooter,
	useIonToast
} from '@ionic/react';
import {
	closeCircleOutline
} from 'ionicons/icons';
import { useDispatch, useSelector } from "react-redux";

import { Lexicon, ModalProperties, SetBooleanState, StateObject } from '../../store/types';
import useTranslator from '../../store/translationHooks';

import doExport from '../../components/ExportServices';
import log from '../../components/Logging';
import useI18Memo from '../../components/useI18Memo';

interface ExportModalProps extends ModalProperties {
	setLoading: SetBooleanState
}

type IonItemEvent = MouseEvent<HTMLIonItemElement, globalThis.MouseEvent>;

const translations = [
	"exportCSVFile", "exportCSVFileNoDesc", "fileJson",
	"exportTextNewline", "exportTextSemicolon",
	"exportTextTab", "fileXml", "TITLE"
];

const commons = [ "Cancel", "Close", "Description" ];

const ExportLexiconModal: FC<ExportModalProps> = (props) => {
	const [ tc ] = useTranslator('common');
	const [ tCancel, tClose, tDesc ] = useI18Memo(commons);
	const [ tCSV, tCSVNoTitle, tJSON, tTxNew, tTxSemi, tTxTab, tXML, tTITLE ] = useI18Memo(translations, "lexicon");
	const tFormat = useMemo(() => tc("ChooseFormat", { context: "presentation" }), [tc]);

	const { isOpen, setIsOpen, setLoading } = props;
	const {
		title,
		description,
		lexicon,
		columns
	} = useSelector((state: StateObject) => state.lexicon);
	const tExportThing = useMemo(() => tc("exportTitle", { title }), [tc, title]);
	const doClose = useCallback(() => {
		setIsOpen(false);
		setLoading(false);
	}, [setIsOpen, setLoading]);
	const dispatch = useDispatch();
	const columnTitles = useMemo(() => columns.map((obj) => obj.label), [columns]);
	const length = columns.length;
	const toast = useIonToast();
	const doDownload = useCallback((e: IonItemEvent, output: string, extension: string) => {
		e.preventDefault();
		const filename = tc("fileFormat", { title, date: (new Date()).toDateString(), extension });
		setLoading(true);
		doExport(output, filename, toast, dispatch)
			.catch((e = "Error?") => log(dispatch, ["doExport / doDownload", e]))
			.then(doClose);
	}, [dispatch, doClose, setLoading, tc, title, toast]);
	const doText = useCallback((e: IonItemEvent, separator: string, unitSplit: string = "\n") => {
		const lines: string[] = [columnTitles.join(separator)];
		lexicon.forEach((lex: Lexicon) => lines.push(lex.columns.join(separator)));
		const output = title + "\n" + description + "\n\n" + lines.join(unitSplit) + "\n";
		doDownload(e, output, "txt");
	}, [columnTitles, description, doDownload, lexicon, title]);
	const doTabbed = useCallback((e: IonItemEvent) => doText(e, "\t"), [doText]);
	const doSemicolons = useCallback((e: IonItemEvent) => doText(e, "; "), [doText]);
	const doNewlines = useCallback((e: IonItemEvent) => doText(e, "\n", "\n\n"), [doText]);
	const doCSVall = useCallback((e: IonItemEvent) => {
		const quotify = (input: string) => JSON.stringify(input).replace(/\\"/g, "\"\"");
		const lines: string[] = [columnTitles.map((colTitle: string) => quotify(colTitle)).join(",")];
		lexicon.forEach(
			(lex: Lexicon) => lines.push(lex.columns.map((title: string) => quotify(title)).join(","))
		);
		let filler = "";
		if(length > 2) {
			let x = 2;
			while(x < length) {
				x++;
				filler = filler + ",";
			}
		}
		const output = `"${tTITLE}",${quotify(title)}${filler}\n`
			+ `"${tDesc}",${description}${filler}\n`
			+ lines.join(length < 2 ? ",\n" : "\n") + "\n";
		doDownload(e, output, "csv");
	}, [columnTitles, description, doDownload, length, lexicon, tDesc, tTITLE, title]);
	const doCSV = useCallback((e: IonItemEvent) => {
		const quotify = (input: string) => JSON.stringify(input).replace(/\\"/g, "\"\"");
		const lines: string[] = [columnTitles.map((colTitle: string) => quotify(colTitle)).join(",")];
		lexicon.forEach(
			(lex: Lexicon) => lines.push(lex.columns.map((line: string) => quotify(line)).join(","))
		);
		const output = lines.join("\n") + "\n";
		doDownload(e, output, "csv");
	}, [columnTitles, doDownload, lexicon]);
	const doJSON = useCallback((e: IonItemEvent) => {
		const counter: {[key: string]: number} = {};
		const colTitles: string[] = [];
		columnTitles.forEach((columnTitle: string) => {
			let colTitle = columnTitle;
			if(counter[colTitle] !== undefined) {
				let c = 0;
				while(counter[colTitle + c.toString()] !== undefined) {
					c++;
				}
				colTitle = colTitle + c.toString();
			}
			counter[colTitle] = 1;
			colTitles.push(colTitle);
		});
		const base: {
			title: string,
			description: string,
			content: any[]
		} = {
			title,
			description,
			content: []
		};
		lexicon.forEach((lex: Lexicon) => {
			const item: any = {};
			for(let x = 0; x < length; x++) {
				item[colTitles[x]] = lex.columns[x];
			}
			base.content.push(item);
		});
		const output = JSON.stringify(base);
		doDownload(e, output, "json");
	}, [columnTitles, description, doDownload, length, lexicon, title]);
	const doXML = useCallback((e: IonItemEvent) => {
		let XML: string =
			'<?xml version="1.0" encoding="UTF-8"?>'
			+ `\n<Lexicon>\n\t<Title>${title}</Title>\n\t<Description>${description}</Description>\n\t<Headers>\n`;
		columnTitles.forEach((colTitle: string, ind: number) => {
			const i = String(ind + 1);
			XML = XML + `\t\t<Column${i}>${colTitle}</Column${i}>\n`;
		});
		XML = XML + "\t</Headers>\n\t<Content>\n";
		lexicon.forEach((lex: Lexicon) => {
			XML = XML + "\t\t<Item>\n";
			lex.columns.forEach((value: string, ind: number) => {
				const i = String(ind + 1);
				XML = XML + `\t\t\t<Column${i}>${value}</Column${i}>\n`;
			});
			XML = XML + "\t\t</Item>\n"
		});
		const output = XML + "\t</Content>\n</Lexicon>";
		doDownload(e, output, "xml");
	}, [columnTitles, description, doDownload, lexicon, title]);
	return (
		<IonModal isOpen={isOpen} onDidDismiss={doClose}>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>{tExportThing}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={doClose} aria-label={tClose}>
							<IonIcon icon={closeCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList lines="none" className="buttonFilled multiLinePossible">
					<IonItem>{tFormat}</IonItem>
					<IonItem
						button={true}
						onClick={doTabbed}
					>{tTxTab}</IonItem>
					<IonItem
						button={true}
						onClick={doSemicolons}
					>{tTxSemi}</IonItem>
					<IonItem
						button={true}
						onClick={doNewlines}
					>{tTxNew}</IonItem>
					<IonItem
						button={true}
						onClick={doCSVall}
					>{tCSV}</IonItem>
					<IonItem
						button={true}
						onClick={doCSV}
					>{tCSVNoTitle}</IonItem>
					<IonItem
						button={true}
						onClick={doJSON}
					>{tJSON}</IonItem>
					<IonItem
						button={true}
						onClick={doXML}
					>{tXML}</IonItem>
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton color="warning" slot="end" onClick={doClose}>
						<IonIcon icon={closeCircleOutline} slot="start" />
						<IonLabel>{tCancel}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default ExportLexiconModal;

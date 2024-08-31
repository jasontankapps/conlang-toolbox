import React, { useEffect, useCallback, useState, FC, useMemo } from 'react';
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
	IonChip,
	IonFooter,
	IonInput,
	useIonToast,
	InputCustomEvent
} from '@ionic/react';
import {
	checkmarkCircleOutline,
	helpCircleOutline,
	copyOutline,
	readerOutline,
	heartOutline
} from 'ionicons/icons';
import { Action, Dispatch } from 'redux';
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';

import { ExtraCharactersDisplayName, ModalProperties, StateObject } from '../../store/types';
import { setFaves, setNowShowing, setToCopy, toggleCopyImmediately, toggleShowNames } from '../../store/extraCharactersSlice';

import charData from '../../components/ExtraCharactersData';
import debounce from '../../components/Debounce';
import toaster from '../../components/toaster';
import copyText from '../../components/copyText';
import useI18Memo from '../../components/useI18Memo';

interface CurrentFavorites {
	[key: string]: boolean
}
const {
	objects,
	contents
} = charData;

interface ChipProperties {
	title: ExtraCharactersDisplayName
	current: boolean
	toggleChars: (x: ExtraCharactersDisplayName) => void
}
const Chip: FC<ChipProperties> = (props) => {
	const { t } = useTranslation();
	const { title, current, toggleChars } = props;
	return (
		<IonChip
			outline={!current}
			onClick={() => toggleChars(title)}
			className={current ? "active" : ""}
		>
			<IonLabel>{title === "Favorites" ? t("Favorites") : t("characterInfo." + title)}</IonLabel>
		</IonChip>
	);
}

interface DisplayProps {
	character: string
	isFave: boolean
	characterClicked: (x: string) => void
}
const DisplayWithName: FC<DisplayProps> = (props) => {
	const { t } = useTranslation();
	const { character, isFave, characterClicked } = props;
	return (
		<div>
			<div
				className={isFave ? "char favorite" : "char"}
				onClick={() => characterClicked(character)}
			>{character}</div>
			<div
				className="label"
			>{t("characterInfo." + character)}</div>
		</div>
	);
};
const DisplayWithoutName: FC<DisplayProps> = (props) => {
	const { character, isFave, characterClicked } = props;
	return (
		<div
			className={isFave ? "char favorite" : "char"}
			onClick={() => characterClicked(character)}
		>{character}</div>
	);
};

const translations = [
	"CharactersToBeCopied", "Copy", "Done", "ExtraChars", "Favorites",
	"Help", "HideNames", "ShowNames",
	"startedFavoriting", "stoppedFavoriting",
	"TapToAdd",
	"stoppedCopying",
	"startedCopying",
	"stoppedSaving",
	"startedSaving"
];
const arrays = [
	"extraHelp.help1p1", "extraHelp.help1p2",
	"extraHelp.help1p3", "extraHelp.help1p4",
	"extraHelp.help2", "extraHelp.help3"
];
const joinArrays = { joinArrays: "\n" };

const ExtraCharactersModal: FC<ModalProperties> = (props) => {
	//interface ExtraCharDataFlags {
	//	[key: string]: boolean
	//}
	const { t } = useTranslation();
	const [
		tCharsToCopy, tCopy, tDone, tExtraCharacters, tFavorites, tHelp,
		tHideCharNames, tShowCharNames, tStartFave, tStopFave, tTapToAdd,
		tNotCopying, tCopying, tNotSaving, tSaving
	] = useI18Memo(translations);
	const [ tHelp1p1, tHelp1p2, tHelp1p3, tHelp1p4, tHelp2, tHelp3 ] = useI18Memo(arrays, "common", joinArrays);

	const {
		isOpen,
		setIsOpen
	} = props;
	const dispatch = useDispatch();
	const {
		nowShowing,
		faves,
		copyImmediately,
		toCopy,
		showNames
	} = useSelector((state: StateObject) => state.ec);
	const data: string[] = useMemo(() => nowShowing === "Favorites" ? faves : objects[nowShowing] || [], [faves, nowShowing]);
	const [currentFaves, setCurrentFaves] = useState<CurrentFavorites>({});
	const [isFavoriting, setIsFavoriting] = useState<boolean>(false);
	const [showHelp, setShowHelp] = useState<boolean>(false);
	const [tNowShowingCharInfo, setNowShowingCharInfo] = useState<string>("");
	const toast = useIonToast();
	const tDisplay = useMemo(() => t("Display"), [t]);

	useEffect(() => {
		const newFaves: CurrentFavorites = {};
		faves.forEach((selected: string) => (newFaves[selected] = true));
		setCurrentFaves(newFaves);
	}, [faves]);
	useEffect(() => {
		setNowShowingCharInfo(nowShowing === "Favorites" ? tFavorites : t("characterInfo." + nowShowing));
	}, [nowShowing, t, tFavorites]);

	const cancel = useCallback(() => {
		setIsOpen(false);
	}, [setIsOpen]);
	const toggleChars = useCallback((what: ExtraCharactersDisplayName) => {
		if(nowShowing !== what) {
			dispatch(setNowShowing(what));
		}
	}, [dispatch, nowShowing]);
	const toggleFave = useCallback((char: string) => {
		if(!currentFaves[char]) {
			// New fave
			dispatch(setFaves([...faves, char]));
			return;
		}
		// Deleting fave
		dispatch(setFaves(faves.filter((fave: string) => fave !== char)));
	}, [currentFaves, faves, dispatch]);
	const copyNow = useCallback(
		(char: string) => copyText(char, toast, t("copiedCharToClipboard", { char })),
		[toast, t]
	);
	const saveToBeCopied = useCallback((char: string) => {
		dispatch(setToCopy(toCopy + char));
	}, [dispatch, toCopy]);
	const characterClicked = useCallback(async (char: string) => {
		if(isFavoriting) {
			toggleFave(char);
		} else if (copyImmediately) {
			// Copy now
			copyNow(char);
		} else {
			// Save to be copied
			saveToBeCopied(char);
		}
	}, [toggleFave, copyImmediately, isFavoriting, copyNow, saveToBeCopied]);
	const toggleCopy = useCallback(() => {
		toaster({
			message: copyImmediately ? tNotCopying : tCopying,
			duration: 2500,
			position: "middle",
			toast
		});
		dispatch(toggleCopyImmediately());
	}, [dispatch, copyImmediately, toast, tNotCopying, tCopying]);
	const modifySavedToBeCopied = useCallback((e: InputCustomEvent) => {
		debounce<Dispatch, Action>(dispatch, [setToCopy(e.detail.value as string)], 250, "copyExtraChars");
	}, [dispatch]);
	const toggleFavoriting = useCallback(() => {
		setIsFavoriting(!isFavoriting);
		toaster({
			message: isFavoriting ? tNotSaving : tSaving,
			duration: 2500,
			position: "middle",
			toast
		});
	}, [toast, tSaving, tNotSaving, isFavoriting]);

	const mapChips = useMemo(() => contents.map(
		(title: ExtraCharactersDisplayName) =>
			<Chip key={title} title={title} current={nowShowing === title} toggleChars={toggleChars} />
	), [nowShowing, toggleChars]);
	const mapCharsWithNames = useMemo(() => data.map(
		(character: string) =>
			<DisplayWithName
				key={"mNamed" + nowShowing + character}
				character={character}
				isFave={currentFaves[character]}
				characterClicked={characterClicked}
			/>
	), [characterClicked, currentFaves, data, nowShowing]);
	const mapChars = useMemo(() => data.map(
		(character: string) =>
			<DisplayWithoutName
				key={"mUnnamed" + nowShowing + character}
				character={character}
				isFave={currentFaves[character]}
				characterClicked={characterClicked}
			/>
	), [characterClicked, currentFaves, data, nowShowing]);
	const toggleHelp = useCallback(() => setShowHelp(!showHelp), [showHelp]);
	const doToggleShowNames = useCallback(() => dispatch(toggleShowNames()), [dispatch]);
	const toggleFavorites = useCallback(() => toggleChars("Favorites"), [toggleChars]);

	return (
		<IonModal isOpen={isOpen} onDidDismiss={cancel}>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>{tExtraCharacters}</IonTitle>
					<IonButtons slot="end">
						<IonButton
							onClick={toggleHelp}
							color={showHelp ? "secondary" : undefined}
							fill={showHelp ? "solid" : "clear"}
							aria-label={tHelp}
						>
							<IonIcon icon={helpCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList
					id="ExtraCharactersModalList"
					lines="none"
					className={showHelp ? "showingHelp" : undefined}
				>
					<IonItem className="extraHelp">
						<div>
							<Markdown>{tHelp1p1}</Markdown>
							<div className="central"><IonIcon icon={copyOutline} /></div>
							<Markdown>{tHelp1p2}</Markdown>
							<div className="central"><IonIcon icon={heartOutline} /></div>
							<Markdown>{tHelp1p3}</Markdown>
							<div className="central"><IonIcon icon={readerOutline} /></div>
							<Markdown>{tHelp1p4}</Markdown>
						</div>
					</IonItem>
					<IonItem className={"inputItem" + (copyImmediately ? "" : " sticky")}>
						<IonButton
							size="default"
							slot="start"
							disabled={isFavoriting}
							onClick={toggleCopy}
							color={copyImmediately ? "secondary" : undefined}
							fill={copyImmediately ? "solid" : "clear"}
							aria-label={tCopy}
						>
							<IonIcon icon={copyOutline} />
						</IonButton>
						<IonButton
							size="default"
							slot="start"
							disabled={copyImmediately}
							onClick={toggleFavoriting}
							color={isFavoriting ? "secondary" : undefined}
							fill={isFavoriting ? "solid" : "clear"}
							aria-label={isFavoriting ? tStopFave : tStartFave}
						>
							<IonIcon icon={heartOutline} />
						</IonButton>
						<IonInput
							aria-label={tCharsToCopy}
							id="toBeCopied"
							value={toCopy}
							onIonChange={modifySavedToBeCopied}
							placeholder={tTapToAdd}
						/>
						<IonButton
							size="default"
							slot="end"
							onClick={doToggleShowNames}
							color={showNames ? "secondary" : undefined}
							fill={showNames ? "solid" : "clear"}
							aria-label={showNames ? tHideCharNames : tShowCharNames}
						>
							<IonIcon icon={readerOutline} />
						</IonButton>
					</IonItem>
					<IonItem className="extraHelp">
						<Markdown>{tHelp2}</Markdown>
					</IonItem>
					<IonItem>
						<div className="ion-flex-row-wrap ion-align-items-center ion-justify-content-center displayChips">
							<span>{tDisplay}</span>
							<IonChip
								outline={nowShowing !== "Favorites"}
								onClick={toggleFavorites}
								className={"ion-margin-start" + (nowShowing === "Favorites" ? " active" : "")}
							>
								<IonLabel>{tFavorites}</IonLabel>
							</IonChip>
							{mapChips}
						</div>
					</IonItem>
					<IonItem className="extraHelp">
						<Markdown>{tHelp3}</Markdown>
					</IonItem>
					{data ? (
						<IonItem key={`${nowShowing}-Group`}>
							{showNames ? (
								<div className="twoColumnsEC centralized">
									<h2>{tNowShowingCharInfo}</h2>
									{mapCharsWithNames}
								</div>
							) : (
								<div className="multiColumnEC centralized">
									<h2>{tNowShowingCharInfo}</h2>
									<div>
										{mapChars}
									</div>
								</div>
							)}
						</IonItem>
					) : <></>}
				</IonList>
			</IonContent>
			<IonFooter id="ExtraCharactersModalFooter">
				<IonToolbar className="ion-text-wrap">
					<IonButtons slot="end">
						<IonButton onClick={cancel} slot="end" fill="solid" color="success">
							<IonIcon icon={checkmarkCircleOutline} slot="start" />
							<IonLabel>{tDone}</IonLabel>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default ExtraCharactersModal;

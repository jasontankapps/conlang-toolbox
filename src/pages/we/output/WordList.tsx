import React, { FC } from 'react';

type Input = [number, string];
type SaveFunc = (text: string) => void;

interface Props {
	words: Input[]
	maybeSaveThisWord: SaveFunc
	savedWordsObject: { [key: string]: boolean }
}
interface MinSelectableProps {
	result: string
	id: string
	maybeSaveThisWord: SaveFunc
	savedWordsObject: { [key: string]: boolean }
}

const OutputOnly: FC<MinSelectableProps> = ({id, result: word, maybeSaveThisWord, savedWordsObject}) => {
	const className = savedWordsObject[word] ? "word selectable saved" : "selectable word";
	return <div className={className} key={id} id={id} onClick={() => maybeSaveThisWord(word)}>{word}</div>;
};

const WordList: FC<Props> = ({words, maybeSaveThisWord, savedWordsObject}) => {
	return (
		<div>{words.map((input) => {
			const [i, word] = input;
			const id = `evolved:basic:${word}:${i}`;
			return <OutputOnly key={id} id={id} result={word} maybeSaveThisWord={maybeSaveThisWord} savedWordsObject={savedWordsObject} />;
		})}</div>
	);
};

export default WordList;

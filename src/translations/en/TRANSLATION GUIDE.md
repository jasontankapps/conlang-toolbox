# Translation Guide

This contains a copy of the translation files for [Conlang Toolbox](https://www.github.com/jasontankapps/conlang-toolbox) for easy access. They are formatted as Typescript modules that export JSON objects compliant with [i18next](https://www.i18next.com/misc/json-format).

## PLURALITY

Some terms will end in `_one` or `_other`. They always have a `{{count}}` that can be used if needed.

>**dog_one** = 1 dog
>
>>`"There is {{count}} dog."`  
>>= "There is 1 dog."
>
>**dog_other** = 0 dogs, 2+ dogs, etc
>
>>`"There are {{count}} dogs."`  
>>= "There are 17 dogs."

Other languages may have their own plurality \_endings. Check your i18n specifications.

---

## CONTEXTS

Some terms may be used in a specific context. This app uses `filename`, `formal`, and `presentation` contexts.

### Normal

>**dogQuestion** = Normal use
>
>>`"dogQuestion": "Is this a dog?"`

### Filename

>**dogQuestion_filename** = Must consist of only characters safe to use in a filename (this is generally anything except the backslash `\`, slash `/`, colon `:`, asterisk `*`, question mark `?`, quotation mark `"`, greater-than sign `>`, less-than sign `<`, and vertical bar `|`).
>
>>`"dogQuestion_filename": "Is_this_a_dog"`

### Formal

>**dogQuestion_formal** = This is being used as a proper name or otherwise has importance. In English, this simply means Capitalizing Most Words.
>
>>`"dogQuestion_formal": "Is This a Dog?"`

### Presentation

>**dogQuestion_presentation** = This is a user-facing term that is "pointing" at...
>
>- important information
>- a text box
>- a selectable option
>- a toggleable option
>- or something similar
>
>In English, I add a colon on the end of the formal term.
>
>>`"dogQuestion_presentation": "Is This a Dog?:"`

**Note:** Some keys are always in `presentation` or `formal` context, even though they don't use the listed suffix. This will be noted in the key's description.

---

## Labels

These symbols indicate *where* in the app a message is used.

>🟥 :: Headers *(important text in the app, possibly placed in the toolbar)*
>
>> Text headers should be relatively short and are usually capitalized.
>
>🔴 :: Button or option text
>
>> Button text should be kept short
>
>🟨 :: Dialog box headers *(yes/no prompts, alerts, etc, are dialog boxes)*
>
>🟡 :: Dialog box messages
>
>> Dialog box text should be clear and concise. Dialog box headers should be kept reasonably short.
>
>**🟦x** :: "Toast" message that stays on screen for `x` seconds before disappearing on its own.
>
>>The average user should be able to read a toast message before `x` seconds have expired.
>>
>> For example, `🟦3.5` indicates a toast message that displays for three and a half seconds before disappearing. A message like *"Good job!"* would be appropriate, but *"Good job! Your next task is to read 30 pages of Hemmigway's biography and prepare a 2-page essay on what you've learned. The paper should be double-spaced in a font no smaller than 12pt."* would be far too long.
>
>🔵 :: ARIA labels *(accessibility messages, not visible to the average user)*

Keys without any of these labels are only shown on-screen in plain text.

---

## Common Terms : common.tsx

These are terms used across the app, or only on "main" app pages, like Settings and About.

| Label | Key | English Translation | Description (if needed) |
| --- | --- | --- | --- |
| 🟥 | appTitle | Conlang Toolbox | Title of the app. |
|  | appTitle_filename | ConlangToolbox | *(filename context)* |
| 🟥 | appSubtitle | tools for language invention | Subtitle of the app. |
| 🟥 | MorphoSyntax | MorphoSyntax | Title of the MorphoSyntax tool. It is based on the word "morphosyntax the study of the form and meaning of language through the structure of words and sentences. |
| 🟥 | WordGen | WordGen | Title of the WordGen tool. It is a combination of "word" and "generator". |
|  | WordGen_filename | WordGen | *(filename context)* |
| 🟥 | WordEvolve | WordEvolve | Title of the WordEvolve tool. It is a combination of "word" and "evolve". |
|  | WordEvolve_filename | WordEvolve | *(filename context)* |
| 🟥 | Declenjugator | Declenjugator | Title of the Declenjugator tool. It is a combination of "declension" (modifying nouns based on their case) and "conjugation" (modifying verbs based on their tense, aspect and/or mode), along with an -or suffix to indicate it's an object that does something. |
|  | Declenjugator_filename | Declenjugator | *(filename context)* |
| 🟥 | Lexicon | Lexicon | Title of the Lexicon tool. |
|  | Lexicon_filename | Lexicon | *(filename context)* |
| 🟥 | Concepts | Concepts | Title of the Concepts tool. |
| 🟥 🔵 | ExtraChars | ExtraChars | Title of the Exra Characters tool. |
| 🟥 | AppInfo | App Info | Title of the page where you find information about the app. |
| 🟥 | AppSettings | App Settings | Title of the page where you find settings for the entire app. |
| 🟥 | Main | Main | Title of the "About" page, which is also the app startup page. |
| 🟥 | Overview | Overview | Title of several pages which provide a broad overview of a tool. |
| 🟥 | Settings | Settings | Title of several pages where you can find settings for the various tools. |
| 🟥 | Input | Input | Title of several pages where you "input" things into a tool. |
| 🟥 | Output | Output | Title of several pages where a tool presents output. |
| 🟥 | Info | Info | Title of several modals that provide information. |
| 🔴 | Cancel | Cancel | Cancel current operation |
| 🔴 | Clear | Clear | Clear all input or output |
| 🔴 | Save | Save | Save the current information |
| 🔴 | Ok | Ok | General acknowledgement |
| 🔴 | Done | Done | User has finished using this modal or tool |
| 🔴 | Close | Close | Close the modal |
| 🔴 | Delete | Delete | Delete something |
| 🔴 | Edit | Edit | Edit something |
| 🔴 | Help | Help | Get helpful information |
| 🔴 | AddAndClose | Add and Close | Text of button that adds something and closes a modal |
| 🔴 | AddNew | Add New | Text of button that adds a new thing |
| 🔴 | Copy | Copy | Copy information |
| 🔴 | Generate | Generate | Generate some output |
| 🔴 | SaveAsNew | Save as New | save current info as a new document |
| 🔴 | CopyToClipboard | Copy to Clipboard | Copy something to the clipboard |
| | Display | Display: | *(presentation context)* A choice of something to display |
| | SavedAt | Saved: {{time}} | Indicates when something was saved. `{{time}}` is replaced with a timestamp. |
| 🟦1.5 | CopiedToClipboard | Copied to clipboard | Displays after anything has been copied to the clipboard. |
| 🟦1.5 | NothingToCopy | Nothing to copy | Displays when the user tries to copy something to the clipboard, but there is nothing to copy. |
| 🔵 | CharactersToBeCopied | Characters to be copied | ARIA label for the input box inside Extra Characters that holds characters to be copied. |
| | Untitled | \[Untitled\] | This is used as a document title if no title is given. |
| | fileFormat | {{title}} - {{date}}.{{extension}} | This becomes a filename and is used by MorphoSyntax, Declenjugator, and Lexicon for exporting documents. `{{title}}` is user-generated, `{{date}}` is replaced with a datestamp in a format like "Thu Jan 01 1970 and `{{extension}}` will be a common file extension like "docx" or "csv". |
| 🟦10 | UnableToExport | UNABLE TO EXPORT: {{error}} | Displayed when the app is unable to export a document to the user's device. `{{error}}` is a system-generated error message. |
| 🟦5 | FileExported | {{filename}} exported. | Displayed when a file is successfully exported to the user's device. |
| | andGlue | ", " | Put between items when the app assembles items into a single sentence. **Note:** The quotation marks are not a part of the message, they are there to indicate it ends with a space. |
| | andFinal | ", and " | Put between the penultimate and ultimate items instead of `andGlue`. **Note:** The quotation marks are not a part of the message, they are there to indicate it ends with a space. |
| | joinTwo | {{one}} and {{two}} | Used instead of `andGlue` when there are only two items in a list. |
| 🟨 | ExitAppQHead | Exit App? | Header of a yes/no confirmation dialog when the user hits the device back button and is about to close the app. |
| 🟡 | ExitAppQ | Do you want to exit the app? | Body text of the confirmation dialog above |
| 🔴 | YesExit | Yes, Exit! | The "yes" button on the confirmation dialog above |
| 🟦3.5 | saveToLexColumn_one | {{count}} word saved to $t(Lexicon) under "{{column}}" | Used when words from other tools are added to Lexicon. `{{column}}` is the name of the column the words were saved under. `$t(Lexicon)` is replaced with the `Lexicon` translation above. |
| 🟦3.5 | saveToLexColumn_other | {{count}} words saved to $t(Lexicon) under "{{column}}" | Same as above, but for English plurality rules. |
| 🟨 | SelectAColumn | Select a column | Used in dialogs where the user is attempting to take words from a tool and save them in Lexicon. |
| 🟦3.5 🔴 | GoToLexicon | Go to $t(Lexicon) | Used in a button inside a toast message after the user has successfully saved words from a tool into Lexicon. |
| 🟦2.5 | TapWordsToSave | Tap words you want to save to $t(Lexicon). | Used inside of tools when prompting the user to tap on words on the screen that they wish to save to Lexicon. |
| 🟡 | SaveToLexiconMessage | Your selected words will be added to the $t(Lexicon) under that column. | Used in dialogs where the user is about to send words to the Lexicon to be saved. |
| 🟨 🟥 | ChooseFormat | Choose a Format | Used when the user is about to export a file and they have to choose what file format they will use. |
| 🟨 🟥 | ChooseFormat_presentation | Choose a format: | The *presentation* context of the above. |
| 🔴 | fileDocx | Word Document (docx) | User-selectable option for file export |
| 🔴 | fileText | Text File | User-selectable option for file export |
| 🔴 | filePlain | $t(fileText) (plain) | User-selectable option for file export |
| 🔴 | fileMd | $t(fileText) (markdown) | User-selectable option for file export |
| 🔴 | fileCsv | Spreadsheet (csv) | User-selectable option for file export |
| 🔴 | fileJson | JSON File | User-selectable option for file export |
| 🔴 | fileXml | XML File | User-selectable option for file export |
| 🟨 | deleteTitleQ | Delete "{{title}}"? | Message used with user-titled info. |
| 🟨 | loadTitleQ | Load "{{title}}"? | Message used with user-titled info. |
| 🟥 | exportTitle | Export "{{title}}" | Message used with user-titled info. |
| 🟦2.5 | titleSaved | "{{title}}" saved. | Message used with user-titled info. |
| 🟨 | titleAlreadyExists | "{{title}}" already exists. | Message used with user-titled info. Followed by a message asking if the user wants to overwrite the existing info. |
| 🟦2.5 | titleLoaded | "{{title}}" loaded. | Message used with user-titled info. |
| 🟡 | titleNotFound | "{{title}}" not found. | Error message used with user-titled info. |
| 🟦2.5 | titleDeleted | "{{title}}" deleted. | Message used with user-titled info. |
| 🟦2.5 | titleOverwritten | "{{title}}" overwritten. | Message used with user-titled info. |
| 🔴 | YesOverwriteIt | Yes, Overwrite It | Confirmation button when the user is about to overwrite stored info in WordGen, WordEvolve, or Declenjugator |
| 🟡 | ClearOverwritePrevSave | This will clear and overwrite the previous save | Used with stored information in several tools |
| 🟨 | LoadError | Load Error | Shows up in dialogs explaining that the app was unable to load stored info. |
| 🟥 | ManageCustomInfo | Manage Custom Info | Header for modals where the user is manipulating stored info inside a tool. |
| 🟡 | SaveCurrentInfo | Save Current Info | Used by DJ and WE when saving custom info |
| 🔵 | NameOfSave | Name of save | As above, but is the ARIA text for the input. |
|  | NameYourInfo | Name your custom info | Provided as a hint when the user is prompted to entitle a save. |
| 🔴 | Load | Load | When loading stored information. |
| 🟡 | NoSavedInfo | No saved info | A message that shows up in some dialog boxes if the user hasn't saved anything in that tool yet. |
| 🟥 | LoadSavedInfo | Load Saved Info | Used in DJ, WE and WG |
| 🟡 | missingTitleMsg | Missing title. |  |
|  | SortMethod | Sort method: | *(presentation context)* Indicates a way to sort the given info. |
| 🟡 | cannotUndo | This cannot be undone. | This action, usually deleting something, cannot be undone. |
| 🟡 | areYouSure | Are you sure? | Do you want to do this action? |
| 🟡 | deleteThisCannotUndo | Are you sure you want to delete this? $t(cannotUndo) | Combines the `cannotDo` message with the common use case where something is about to be deleted. |
| 🟨 | DeleteEverythingQ | Delete Everything? | Asking to delete something. The dialog text will specify what is being deleted. |
| 🔴 | confirmDel_one | Yes, Delete It | The things being deleted might be: 1) custom meanings in Concepts; 2) A column or item in Lexicon; 3) Character Groups or Transformations in WG and WE; 4) Syllables in WG; 5) Sound Changes in WE; 6) A single unit of saved custom info in WG, WE, Declenjugator, Lexicon, or MorphoSyntax; 7) A Custom Sort in Settings, or one of their relations or equalities; 8) a group in Declenjugator, or a single declension or conjugation in a group. |
| 🔴 | confirmDel_other | Yes, Delete Them | The English plural version of the key above. |
| 🔴 | confirmLoad | Yes, Load Info | Used to confirm loading Custom Info in WG, WE, Declenjugator, Lexicon, or MorphoSyntax |
| 🟦2.5 | NothingToSave | Nothing to save. | An attempt was made to save something, but there was no information to save. |
| 🟦2 | Deleted | Deleted | Successful deletion. |
| 🟨 | UnsavedInfo | Unsaved Info | Dialogs regarding exiting or closing something before everything has saved. |
| 🟡 | MaybeDiscardThing | Are you sure you want to discard this? | When deciding not to add a new thing |
| 🟡 | MaybeDiscardEdits | Are you sure you want to discard your edits? | When deciding not to edit an existing thing |
| 🔴 | YesDiscard | Yes, Discard | Affirmative answer to either of the above two questions. |
| 🟡 | MaybeClearEntireInput | $t(areYouSure) This will clear the entire input, and cannot be undone. | Clearing the entire Input in Declenjugator and WE |
| 🔴 | YesClear | Yes, Clear It | Affirmative answer to the above question. |
| 🔴 | defaultSort | Default sort | Refers to the default sort method (whatever it may be) |
|  | error | Error | Simple translation |
| 🟥 | emphasizedError | \<$t(error)\> | A visually emphasized version of `error`. |
| 🟨 | regexpError | Error trying to parse "{{regex}}" | The user gave a malformed regular expression `{{regex}}` in WG or WE. |
| 🟥 | Loading | Loading | A tool or page is loading. |
| 🟥 | PleaseWait | Please wait... | An additional loading message. |
| 🔵 | Title | Title |  |
| 🔴 | Title_presentation | Title: | *(presentation context)* |
| 🟥 🔵 | Description | Description |  |
|  | Description_presentation | Description: | *(presentation context)* |
| 🟥 | overviewOf | Overview: {{what}} | `{{what}}` will be replaced by the name of a tool: Declenjugator, WordEvolve or WordGen |
| 🔴 🟥 🟨 | ImportFromLexicon | Import from Lexicon | (to DJ, WG or WE) |
| 🔴 | LoadPreset | Load Preset | Load a preset in WE or WG |
| 🔴 | Import | Import | Import from Lexicon (to WG or WE) |
| 🟨 | ImportFromWhichColumns | Import from which column(s)? | Import from Lexicon (to WG or WE) |
|  | optional | (optional) | Placeholder text for optional text inputs |
|  | AddConditions | Add Conditions $t(optional) | The user can specify conditions that must be met before a specific word can be imported from the Lexicon. |
|  | WordMustContainX | Word must contain \[x\] | A condition |
|  | TypeWordHere | Type part of word here. | Placeholder text for the above input |
|  | WordMustMatchX | Word must match expression \[x\] | A condition |
|  | TypeRegExHere | Type regular expression here. | Placeholder text for the above input |
|  | ColXMustHaveY | Column \[x\] must contain \[y\] | A condition |
|  | ColXMustMatchY | Column \[x\] must match expression \[y\] | A condition |
| 🟦2.5 | ConditionSaved | Condition saved. | One of the conditions below has been saved. |
| 🟥 | TestColumn | Test column: | *(presentation context)* The column being tested for a match (see the two keys above) |
| 🟥 | WordsThatContain | Words that contain: | *(presentation context)* Prefixes the input box for the above key |
| 🟥 | WordsThatMatch | Words that match: | *(presentation context)* Prefixes the input box for the above key |
| 🟥 | WordsWithColumn | Words where the column: | *(presentation context)* Header for displaying the column conditions |
|  | columnContains | \[{{column}}\] contains "{{test}}" | Shows a result of `ColXMustHaveY` where `{{column}}` is the Lexicon column and `{{test}}` is the user-provided string a word must contain. |
|  | columnMatches | \[{{column}}\] matches /{{test}}/ | Same as above, but `{{test}}` is the user-provided regular expression. |
| 🟥 | MatchAllConditions | Match all conditions | Toggle switch label |
|  | ifMatchAllOff | If off, this will import words that match any condition. | Explanatory text for the toggle |
| 🟨 | ExitWOImport | Exit Without Importing? | Exit the importer without actually importing anything. |
| 🟦2.5 | SelectOneCol | Please select at least one column to import from. | Error message where no column was selected for the importer. |
| 🟦4.5 | NothingToImport | Did not find anything to import. | The conditions given resulted in no words being eligible for importing. |
| 🟦3.5 | importSuccess_one | Imported {{count}} word from $t(Lexicon) | Successful import |
| 🟦3.5 | importSuccess_other | Imported {{count}} word from $t(Lexicon) | English plural of the above |
| 🔴 | yesImport | Yes, Import | Proceed with the import |
| 🟦2.5 | stoppedCopying | No longer copying directly to clipboard. | Extra Characters |
| 🟦2.5 | startedCopying | Now copying immediately to clipboard. | Extra Characters |
| 🟦1.5 | copiedCharToClipboard | Copied {{char}} to clipboard | Extra Characters: Only one character was copied |
| 🔴 | Favorites | Favorites | Extra Characters |
| 🔵 | startedFavoriting | Start favoriting characters | Extra Characters |
| 🔵 | stoppedFavoriting | Stop favoriting characters | Extra Characters |
| 🟦2.5 | startedSaving | Now saving characters to $t(Favorites) | Extra Characters |
| 🟦2.5 | stoppedSaving | No longer saving to $t(Favorites) | Extra Characters |
|  | TapToAdd | Tap characters to add them here | Extra Characters: placeholder text |
| 🔵 | ShowNames | Show full character names | Extra Characters |
| 🔵 | HideNames | Hide full character names | Extra Characters |
|  | extraHelp.help1p1 | \[ "This is a place to find and copy characters that may not be easily accessible to you on your device's keyboard. The other buttons can be toggled for additional effects:" \] | Help text for Extra Characters. This text appears at the top of the modal, and is followed by the icon for copying to the clipboard. *This is an array of strings in Markdown format.* |
|  | extraHelp.help1p2 | \[ "When active, copies any character you tap directly to the clipboard. When inactive, copies tapped characters to the copy-bar below, where you can copy them at your leisure." \] | Help text for Extra Characters. This text is followed by the icon for favoriting characters. *This is an array of strings in Markdown format.* |
|  | extraHelp.help1p3 | \[ "When active, tapping on a character adds or removes it from your Favorites list. Characters will not be copied to the clipboard or the copy-bar." \] | Help text for Extra Characters. This text is followed by the icon for showing full Unicode names of the characters. *This is an array of strings in Markdown format.* |
|  | extraHelp.help1p4 | \[ "When active, shows the standard Unicode name of every character. When inactive, the characters are presented by themselves." \] | Help text for Extra Characters. This ends the first help section in the modal. *This is an array of strings in Markdown format.* |
|  | extraHelp.help2 | \[ "Tap a character set below to see the characters in that set." \] | Help text for Extra Characters. This text appears between the control buttons and the area where you choose which character set to display. *This is an array of strings in Markdown format.* |
|  | extraHelp.help3 | \[ "Characters will display below. Tap them to copy them to the copy-bar above." \] | Help text for Extra Characters. This text appears between the character set display controls and the characters being displayed. *This is an array of strings in Markdown format.* |
| 🔴 | WGPresetsSorter | WG Presets Sorter | The name of the permanent sort method in sort settings. |
| 🟡 | cannotDeleteSorter | This is used by $t(WordGen) presets. It cannot be modified or deleted. | Error message shown when a user tries to delete the permanent sort method. |

### regexpInfo

This property is an array of strings in Markdown format. They give a brief overview of how regular expressions work.

Feel free to change the links to resources in your target language.

```javascript
[
  "To put it as simply as possible, a regular expression is a sequence of characters that specifies a match pattern in text. $t(appTitle) uses JavaScript-style regexes without the surrounding slash characters.",
  "",
  "Fully explaining regular expressions is a topic that's too complicated for this app to cover, but they are very useful. Here are some resources where you can learn more about them:",
  "",
  "- [Wikipedia: Regular Expression](https://en.wikipedia.org/wiki/Regular_expression)",
  "- [MDN: Writing a regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#writing_a_regular_expression_pattern)",
  "- [Regular-Expressions.info](https://www.regular-expressions.info) (a tutorial site)",
  "- [Geeks for Geeks: Write Reguar Expressions](https://www.geeksforgeeks.org/write-regular-expressions/)"
]
```

---

### Extra Characters : characters.tsx

This file is imported into common.tsx, and its properties become properties of the `characterInfo` object within it.

| Label | Key | English Translation | Description (if needed) |
| --- | --- | --- | --- |
| 🔴 | characterInfo.Latin | Latin | The Latin character set |
| 🔴 | characterInfo.IPA | IPA | Characters used in the International Phonetic Alphabet |
| 🔴 | characterInfo.Greek | Greek | The Greek character set |
| 🔴 | characterInfo.Coptic | Coptic | The Coptic character set |
| 🔴 | characterInfo.Cyrillic | Cyrillic | The Cyrillic character set |
| 🔴 | characterInfo.Armenian | Armenian | The Armenian character set |
| 🔴 | characterInfo.Hebrew | Hebrew | The Hebrew character set |
| 🔴 | characterInfo.Arabic | Arabic | The Arabic character set |
| 🔴 | characterInfo.Thai | Thai | The Thai character set |
| 🔴 | characterInfo.Lao | Lao | The Lao character set |
| 🔴 | characterInfo.Hiragana | Hiragana | The Hiragana character set |
| 🔴 | characterInfo.Katakana | Katakana | The Katakana character set |
| 🔴 | characterInfo.Bopomofo | Bopomofo | The Bopomofo character set |

Each character in Extra Characters has an official Unicode name. You can find the list of them in [CHARACTERCODES.md](CHARACTERCODES.md).

---

## Settings : settings.tsx

| Label | Key | English Translation | Description (if needed) |
| --- | --- | --- | --- |
| 🟥 🔴 | DisableConfPrompts | Disable Confirmation Prompts |  |
|  | confPromptExplanation | Eliminates yes/no prompts when deleting or overwriting data. | Explanation for the setting above |
| 🟥 🔴 | ChangeTheme | Change Theme |  |
| 🟥 🔴 | SortSettings | Sort Settings |  |
| 🟥 🔴 | ImportAppInfo | Import App Info |  |
|  | ChooseATheme | Choose a Theme |  |
| 🔴 | Default | Default | Theme name |
| 🔴 | Light | Light | Theme name |
| 🔴 | Dark | Dark | Theme name |
| 🔴 | SolarizedLight | Solarized Light | Theme name; "Solarized" is the name of a popular color palette |
| 🔴 | SolarizedDark | Solarized Dark | Theme name; "Solarized" is the name of a popular color palette |
| 🟥 | ExportData | Export App Data | Title of the "Export App Info" modal |
|  | exportAllMsg | \[ "Save this info to a note or file.&nbsp;&nbsp;", "You can use it later to restore your data." \] | *This is an array of strings in Markdown format.* |
| 🔵 | ExportedData | Exported Data |  |
| 🟥 | WhatToExport | What to Export |  |
| 🟡 | nothingImportedMsg | You haven't imported anything yet. |  |
| 🔴 | YesClose | Yes, Close This |  |
| 🟦10 | successImport | Imported new info for {{listing}} | `{{listing}}` will be replaced with a list of tools that received imported data. |
| 🟦10 | alsoOverwrote | also completely overwrote storage for {{listing}} | Optionally appended to `successImport`; `{{listing}}` will be replaced with a list of tools that had data overwritten with imported data. |
| 🟦10 | successOverwrote | Completely overwrote storage for {{listing}} | `{{listing}}` will be replaced with a list of tools that had data overwritten with imported data. |
| 🔴 | exportAppInfo | Export App Info |  |
|  | ImportInfo | Import Info |  |
|  | importDescription | Paste your data below. This only accepts data exported through "Export App Info". | The phrase `Export App Info` should be the same text as the `exportAppInfo` key. |
| 🔵 | DataToImport | Data to Import |  |
| 🔴 | Reset | Reset |  |
| 🔴 | Analyze | Analyze |  |
| 🟥 | WhatToImport | What to Import |  |
| 🔴 | currentSettings | Current {{tool}} Settings | `{{tool}}` is replaced with "WordGen", "MorphoSyntax", etc. |
| 🔴 | storedSettings | Stored {{tool}} Settings | `{{tool}}` is replaced with "WordGen", "MorphoSyntax", etc. |
| 🔴 | storedDocuments | Stored {{tool}} Documents | `{{tool}}` is replaced with "WordGen", "MorphoSyntax", etc. |
| 🔴 | appSettings | {{tool}} Settings | `{{tool}}` is replaced with "WordGen", "MorphoSyntax", etc. |
| 🔴 | OtherAppSettings | Other App Settings |  |
| 🟦5 | nothingChosenForImportMsg | You did not choose anything to import. |  |
| 🟨 | WARNING | WARNING! | Header for the importing data warning |
| 🟡 | willOverwriteCurrent | This will overwrite all current data in {{listing}}. |  |
| 🟡 | alsoOverwriteStorage | It will ALSO delete and replace stored data for {{listing}}. |  |
| 🟡 | willOverwriteStorage | This will delete and replace stored data for {{listing}}. |  |
| 🟡 | areYouVerySure | Are you SURE you want to do this? |  |
| 🔴 | YesIAmSure | Yes, I Want to Do This | Confirmation button for the importing data warning |
| 🔴 | none | (none) | Indicates no custom sort is being used. |
| 🟥 | ManageSortMethods | Manage Sort Methods |  |
| 🟥 | BasicSort | Basic Sort |  |
| 🔴 🟥 | UseLangBasedSort | Use Language-Based Sort |  |
|  | langSortExplanation | Use a language's rules for sorting instead of using Unicode points. (If this option is disabled, your device does not support language-based sorting.) | Explanation for the `UseLangBasedSort` option |
| 🔴 | SortLanguage | Sort Language: | *(presentation context)* |
|  | Sort | Sort | used in `deleteThing` |
| 🟨 | ThisSort | This Sort | used in `deleteThing` |
| 🔴 | BaseOnly | \[ȁ = Ȁ, a = ȁ\]: Base letters only | *This key and the next three display a representation of the sort option in \[brackets\], followed by its description.* The sort only compares the base letter, ignores case and diacritics |
| 🔴 | Diacritics | \[ȁ = Ȁ, a ≠ ȁ\]: Diacritics | The sort compares the base letter and its diacritics, ignores case |
| 🔴 | UpperLowercase | \[ȁ ≠ Ȁ, a = ȁ\]: Upper/lowercase | The sort compares the base letter and its case, ignores diacritics |
| 🔴 | DiacriticsUpperLowercase | \[ȁ ≠ Ȁ, a ≠ ȁ\]: Diacritics and upper/lowercase | The sort compares the base letter, its case, and its diacritics |
|  | overrideNoteMsg | Note: This can be overriden by a language's sorting rules. |  |
|  | UsingCustomSort | Using Custom Sort: | *(presentation context)* |
| 🟥 | AllCustomSortMethods | All Custom Sort Methods |  |
|  | customAlphabet | custom alphabet |  |
| 🔵 | CustomAlphabet | Custom Alphabet |  |
|  | relation_one | {{count}} relation | A "relation" is the relationship between two characters (e.g. 'A', 'B', and 'C' are before 'D') |
|  | relation_other | {{count}} relations | As above, but the English plural |
|  | equality_one | {{count}} equality | An "equality" is declaring two or more characters equal (e.g. 'A' is equal to 'a') |
|  | equality_other | {{count}} equalities | As above, but the English plural |
| 🟡 | needTitleMsg | You must provide a title before saving. | Error message |
| 🟡 | blankAlphabetProvided | The alphabet provided was blank. | Error message |
| 🟡 | noEnteredInfoMsg | You did not enter any information. | Error message |
| 🟡 | noBaseCharMsg | You must provide a "base" character. | Error message |
| 🟡 | noEqualCharMsg | You must provide some "equal" characters. | Error message |
| 🟡 | noPostPreCharMsg | You must provide some "pre" or "post" characters. | Error message |
| 🔴 | NewCustomSort | New Custom Sort |  |
| 🟥 | AddSort | Add Custom Sort |  |
| 🟦2.5 | SortAdded | Custom Sort added |  |
| 🟨 | DeleteSort | Delete This? |  |
| 🔴 | DeleteSortButton | Delete Sort |  |
| 🟦2.5 | SortDeleted | Custom Sort deleted |  |
| 🟥 | EditSort | Edit Custom Sort |  |
| 🟦2.5 | SortEdited | Custom Sort edited |  |
|  | TitleOfSort | Title for this sort |  |
| 🔴 | UnicodeSort | Unicode sort (language-independent) |  |
|  | SortSensitivity | Sort Sensitivity: | *(presentation context)* |
| 🔴 | DefaultSensitivity | Default sensitivity |  |
| 🔴 | UseAlternateAlphabet | Use alternate alphabet |  |
|  | alternateAlphabetExplanation | Items will be sorted according to the order you provide. Characters not in your alphabet will be sorted according to the rules above. |  |
|  | WriteAlphaHere | Write your alphabet here. |  |
|  | AlphabetSeparator | Alphabet separator: | *(presentation context)* |
| 🔴 | NoSeparator | \[abcde\]: No separator | This key and the next four keys display a representation of the option in \[brackets\], followed by its descriptive name |
| 🔴 | Space | \[a b c d e\]: Space |  |
| 🔴 | Comma | \[a,b,c,d,e\]: Comma |  |
| 🔴 | Period | \[a.b.c.d.e\]: Period |  |
| 🔴 | Semicolon | \[a;b;c;d;e\]: Semicolon |  |
| 🟥 | Relations | Relations |  |
|  | relationMsg | Similar characters that should be sorted separately. |  |
| 🟥 | AddRelation | Add Relation |  |
| 🟦2.5 | RelationAdded | Relation added |  |
| 🟥 | DeleteRelation | Delete Relation? |  |
| 🟦2.5 | RelationEdited | Relation edited |  |
| 🟥 | EditRelation | Edit Relation |  |
| 🟥 | Equalities | Equalities |  |
|  | equalityMsg | Characters that should be sorted together as if they were strictly equal. |  |
| 🟥 | AddEquality | Add Equality |  |
| 🟦2.5 | EqualityAdded | Equality added |  |
| 🟥 | DeleteEquality | Delete Equality? |  |
| 🟦2.5 | EqualityEdited | Equality edited |  |
| 🟥 | EditEquality | Edit Equality |  |
|  | BaseChar | Base Character: | *(presentation context)* |
|  | BaseEqual | Equal to the Base: | *(presentation context)* |
|  | CharsSeparator | Characters Separator: | *(presentation context)* |
|  | PrePostSeparator | Pre/Post Separator: | *(presentation context)* |
|  | SortedAfterBase | Sorted After the Base: | *(presentation context)* |
|  | SortedBeforeBase | Sorted Before the Base: | *(presentation context)* |
|  | EqualsSeparator | Equalities Separator: | *(presentation context)* |
| 🔵 | Basecharacter | Base character |  |
|  | TheBaseCharacter | The base character | Placeholder text in an input box |
| 🔵 | CharsEqual | Characters equal to the base |  |
|  | CharsToBeEqual | Characters to be equal to the Base. | Placeholder text in an input box |
| 🔵 | CharsPreBase | Characters sorted before the base |  |
|  | charsPreBaseMsg | End with the one just before the Base. | Placeholder text in an input box |
| 🔵 | CharsPostBase | Characters sorted after the base |  |
|  | charsPostBaseMsg | Start with the one just after the Base. | Placeholder text in an input box |

---

## App Info : appInfo.tsx

| Label | Key | English Translation | Description (if needed) |
| --- | --- | --- | --- |
| 🟥 | CreditsAcknowledgements | Credits and Acknowledgements |  |
|  | credit1 | \[ "App icon is based on \[Toolbox by Maxicons\]\(https:/\/thenounproject.com/term/toolbox/2586725/\) from the Noun Project" \] | *This is an array of strings in Markdown format.* |
|  | credit2 | \[ "$t(common:WordGen) and $t(common:WordEvolve) are heavily inspired by \[Gen\]\(https:/\/www.zompist.com/gen.html\) and \[SCA²\]\(https:/\/www.zompist.com/sca2.html\) by Mark Rosenfelder" \] | *This is an array of strings in Markdown format.* |
|  | credit3 | \[ "MorphoSyntax is based on an outline presented throughout \_Describing Morphosyntax: A Guide for Field Linguists\_ by Thomas E. Paine, and it also uses some foreign-language examples presented therein" \] | *This is an array of strings in Markdown format.* |
| 🟥 | BugReports | Bug Reports |  |
|  | bugReportMsg | \[ "Please report bugs and errors to \[the Github repository\]\(https:\//github.com/jasontankapps/conlang-toolbox/issues\). In order to diagnose errors, you need to include information from the tool or tools that are causing you problems. \*\*This will include the raw data you've currently have loaded up in the app.\*\* Choose the tools you are having problems with, then copy the information that appears in the box below and submit it to the GitHub." \] | *This is an array of strings in Markdown format.* |
| 🟨 | EntireState | Entire State | 'State' refers to the info saved by the app that is used to display info, create info, etc. |
| 🟥 | Changelog | Changelog | A list of changes made to the app |
| 🔴 | HideOlderChanges | Hide Older Changes |  |
| 🔴 | ShowOlderChanges | Show Older Changes |  |
|  | changelog | *See description* | This is a special object containing multiple properties. Each property is an array of strings in Markdown format. They describe the various changes to the app. |

---

## Concepts : concepts.tsx

| Label | Key | English Translation | Description (if needed) |
| --- | --- | --- | --- |
| 🔴 | Stop | Stop |  |
| 🔴 | Swadesh100 | Swadesh 100 | Name of a list |
| 🔴 | Swadesh207 | Swadesh 207 | Name of a list |
| 🔴 | SwadeshYakhontov | Swadesh-Yakhontov | Name of a list |
| 🔴 | SwadeshWoodward | Swadesh-Woodward | Name of a list |
| 🔴 | Dolgopolsky | Dolgopolsky | Name of a list |
| 🔴 | LeipzigJakarta | Leipzig-Jakarta | Name of a list |
| 🔴 | ASJP | ASJP | Name of a list |
| 🔴 | Landau200 | Landau 200 | Name of a list |
| 🟡 | addToColumnMsg | Your selected meanings will be added to the $t(common:Lexicon) under that column. |  |
| 🟦5 | tapToLinkMsg | Tap meanings you want to link, in the order you wish to link them. |  |
| 🟡 | meaningsStillSelected_one | You have {{count}} meanings still selected. Do you want to discard this? | This is only shown when one meaning is left selected, meaning that there aren't enough to be linked. `{{count}}` will **NEVER** be 0. |
| 🟡 | meaningsStillSelected_other | You have {{count}} meanings still selected. Do you want to link them? | This is only shown when two or more meanings are left selected. `{{count}}` will **NEVER** be 0. |
| 🟨 | StopLinking | Stop Linking? |  |
| 🔴 | YesSaveThem | Save Them | "Them" refers to the meanings that could be linked together. There wil *always* be two or more. |
| 🔴 | NoDiscardThem | Discard |  |
| 🟦2.5 | CombinationSaved | Combination saved. | The combination of meanings has been saved |
| 🟦2.5 | tapToSaveMsg | Tap meanings you want to save to $t(common:Lexicon) |  |
| 🟦3 | tapToUnlinkMsg | Tap combinations you want to delete, then tap the Unlink button again. |  |
| 🟨 | delMeanings_one | Delete {{count}} meaning? | English singular |
| 🟨 | delMeanings_other | Delete {{count}} meanings? | English plural |
| 🟡 | delMeaningsMessage_one | The selected meaning will be removed. $t(common:cannotUndo) | English singular |
| 🟡 | delMeaningsMessage_other | The selected meanings will be removed. $t(common:cannotUndo) | English plural |
| 🔴 | MyCombinations | My Combinations |  |
| 🔴 | SaveAllMeanings | Save All Meanings |  |
| 🔴 | SaveSelectedMeanings | Save Selected Meanings |  |
| 🟥 | CurrentCombo | Current Combination: | *(presentation context)* |
| 🟦3.5 | saveToLexColumn_one | {{count}} meaning saved to $t(common:Lexicon) under "{{column}}" | `{{column}}` is the name of the column the meanings were saved under. |
| 🟦3.5 | saveToLexColumn_other | {{count}} meanings saved to $t(common:Lexicon) under "{{column}}" | English plural of the above key |

### info

The `info` key has multiple subkeys. They are all arrays of strings in Markdown format.

#### info.basic

```javascript
[
  "Presented here are a number of lists of basic concepts. Each list was originaly created for the purposes of historical-comparative linguistics.",
  "",
  "They are included in this app because they may serve you as a useful source of meanings to start a conlang with. Remember: you can combine multiple meanings into a single word!"
]
```

#### info.controlLexicon

```javascript
[
  "Use the \"lexicon\" button to quickly save meanings to the $t(common:Lexicon)."
],
```

#### info.controlJoin

```javascript
[
  "Use the \"join\" button to create compound meanings."
],
```

#### info.controlUnjoin

```javascript
[
  "Use the \"unjoin\" button to delete compound meanings."
],
```

#### info.theLists

```javascript
[  
  "## Swadesh Lists",
  "",
  "Originally assembled by Morris Swadesh, this list of concepts was chosen for their universal, culturally independent availability in as many languages as possible. However, he relied more on his intuition than on a rigorous set of criteria. **$t(Swadesh100)** is his final list from 1971. The **$t(Swadesh207)** is adapted from his original list from 1952. **$t(SwadeshYakhontov)** is a subset of the 207 assembled by Sergei Yakhontov. And the **$t(SwadeshWoodward) Sign List** was assembled by James Woodward to take into account the ways sign languages behave.",
  "",
  "## $t(Dolgopolsky) List",
  "",
  "Compiled by Aharon Dolgopolsky in 1964, this lists the 15 lexical items that are the least likely to be replaced by other words as a language evolves. It was based on a study of 140 languages from across Eurasia, only.",
  "",
  "## $t(LeipzigJakarta) List",
  "",
  "Similar to the Dolgopolsky list, this is a list of words judged to be the most resistant to borrowing. Experts on 41 languages from across the world were given a uniform vocabulary list and asked to provide the words for each item in the language on which they were an expert, as well as information on how strong the evidence that each word was borrowed was. The 100 concepts that were found in most languages and were most resistant to borrowing formed the Leipzig-Jakarta list.",
  "",
  "## $t(ASJP) List",
  "",
  "The **Automated Similarity Judgment Program** is a collaborative project applying computational approaches to comparative linguistics using a database of word lists. It uses a 40-word list to evaluate the similarity of words with the same meaning from different languages.",
  "",
  "## $t(Landau200)",
  "",
  "The **Basic 200 List** is a subset of the **Landau Core Vocabulary (LCV)** developed by James Landau. It is Part I of the entire LCV. This list consists of 200 basic concepts that basically all anthropic cultures will have and have words for. This list makes many semantic distinctions that are not made in English (e.g \"leaf (on plant)\" vs. \"leaf (fallen off)\"), and some that are not made in any \"Standard Average European\" language (e.g. \"river (flowing into the sea)\" vs. \"river (flowing into another river)\")."
]
```

### The concepts list

You can find the master list of concepts in [CONCEPTS.md](CONCEPTS.md).

---

## Lexicon : lexicon.tsx

| Label | Key | English Translation | Description (if needed) |
| --- | --- | --- | --- |
|  | beginDeleteMode | Tap on items to mark them for deletion. Finish deleting by tapping the top floating button. Cancel by tapping the bottom floating  button. |  |
| 🟨 | delItems_one | Delete {{count}} Item? |  |
| 🟨 | delItems_other | Delete {{count}} Items? |  |
| 🟦2.5 | delItemsSuccess_one | Deleted {{count}} item. |  |
| 🟦2.5 | delItemsSuccess_other | Deleted {{count}} items. | English plural of the above key |
| 🟡 | noInfoProvided | You did not type any information into any text field. |  |
| 🔵 | MergeSelected | Merge selected items |  |
| 🔵 | LexiconTitle | $t(common:Lexicon) $t(common:Title) |  |
|  | LexiconTitle_presentation | $t(common:Lexicon) $t(common:Title) | *Note: This key being in presentation context will cause it to pull common:Title_presentation by default* |
|  | lexTitleHelperText | Usually the language name. |  |
|  | lexDescriptionHelperText | A short description of this lexicon. |  |
| 🟥 | lexItems_one | {{count}} Item | *(formal context)* Displayed on the main Lexicon page, showing how many items there are. |
| 🟥 | lexItems_other | {{count}} Items | *(formal context)* English plural of the above key |
| 🔴 | storedLexItems_one | {{title}} [{{count}} item] | Used in modals, listing a saved Lexicon's title and how many items it stores |
| 🔴 | storedLexItems_other | {{title}} [{{count}} items] | English plural of the above key |
| 🟥 | LexiconStorage | $t(common:Lexicon) Storage |  |
| 🔴 | ClearLexicon | Clear $t(common:Lexicon) |  |
| 🟥 | LexiconSorting | $t(common:Lexicon) Sorting |  |
|  | sortLexDescription | The Lexicon will be sorted in the order you choose. It alphabetically sorts by the first column in the list. If two items are identical in that column, it will sort them by the next column in the list, and so on. |  |
|  | Sort | Sort | Used by `deleteThing` |
| 🟥 | Sort_presentation | Sort: | *(presentation context)* |
| 🔵 | DeleteSelectedLexItems | Delete selected lexicon items |  |
| 🔵 | DeleteMultipleLexItems | Delete multiple lexicon items |  |
| 🔵 | CancelDel | Cancel deleting |  |
| 🟦4 | LexCleared | Lexicon cleared |  |
| 🟦3 | NothingToClear | Nothing to clear |  |
| 🟡 | deleteEverythingMessage | This will erase everything currently displayed (but not anything previously saved). Are you sure you want to do this? |  |
| 🟡 | loadLexiconConfirm | Are you sure you want to load this? It will overwrite your current lexicon and cannot be reversed. |  |
| 🟥 | NoSavedLexicons | No Saved Lexicons |  |
| 🟥 | DeleteStoredLexicon | Delete Stored Lexicon |  |
| 🟦2.5 | LexiconDeleted | Lexicon deleted. |  |
| 🟥 🔴 | LoadLexicon | Load Lexicon |  |
| 🔴 | SaveLexicon | Save Lexicon |  |
| 🟦2.5 | LexiconSaved | Lexicon saved. |  |
| 🟦2.5 | LexSavedAsNew | Lexicon saved as new lexicon! |  |
| 🟡 | needTitleMsg | You must input a title before saving. |  |
| 🟡 | needLexiconTitleMsg | Please give your lexicon a title before exporting it. |  |
| 🟡 | needWordsMsg | Please add words to your lexicon before exporting it. |  |
| 🟥 | AddLexiconItem | Add Lexicon Item |  |
| 🔴 | AddItem | Add Item | A shorter version of the above key, used in buttons |
| 🟥 | EditLexiconItem | Edit Lexicon Item |  |
| 🟨 | DeleteItem | Delete Item? |  |
| 🟦2.5 | ItemDeleted | Item was deleted. |  |
| 🔴 | SaveItem | Save Item |  |
| 🟥 | EditCols | Edit Columns |  |
| 🟦2.5 | ItemSaved | Item saved to Lexicon |  |
| 🟨 | ExitWOSave | Exit Without Saving? |  |
| 🟡 | exitWithoutSavingMsg | You have unsaved changes. Are you sure you want to exit? |  |
| 🟦2.5 | ColumnAdded | Column added |  |
| 🟥 | AddColumn | Add Column |  |
|  | New | New | Default label for a new column |
| 🟡 | deleteColumnMsg | Are you sure you want to delete this column? $t(common:cannotUndo) |  |
| 🟥 | LexOptions | $t(common:Lexicon) Options |  |
| 🔴 | ShowTitles | Show Full Column Titles |  |
| 🟦 5 | cannotDeleteFinalColumnMsg | Cannot delete: a Lexicon must contain at least ONE column. |  |
|  | SortBlanks | Sort blank columns: | *(presentation context)* |
| 🟥 | RearrangeColumns | Rearrange Lexicon Columns |  |
| 🔴 | optionToBeginning | To Beginning, Always | Describes how blank columns will be sorted in the Lexicon |
| 🔴 | optionToEnd | To End, Always | Describes how blank columns will be sorted in the Lexicon |
| 🔴 | optionAlphaFirst | As Alphabetically First | Describes how blank columns will be sorted in the Lexicon |
| 🔴 | optionAlphaLast | As Alphabetically Last | Describes how blank columns will be sorted in the Lexicon |
| 🔵 | FieldName | Field Name | Column info |
| 🔴 | Small | Small | Small column size *(Note: this must be kept very short)* |
| 🔴 | Med | Med | Medium column size *(Note: this must be kept very short)* |
| 🔴 | Large | Large | Large column size *(Note: this must be kept very short)* |
| 🟡 | SaveChanges | Save Changes | Used when saving an edited word or saving edited columns |
|  | workingMsg | Working... |  |
|  | TITLE | TITLE | Only used in CSV exports |
| 🔴 | ExportLex | Export Lexicon |  |
| 🔴 | exportTextTab | Text, Tabbed | Type of export |
| 🔴 | exportTextSemicolon | Text, Semicolons | Type of export |
| 🔴 | exportTextNewline | Text, Newlines | Type of export |
| 🔴 | exportCSVFile | CSV File | Type of export |
| 🔴 | exportCSVFileNoDesc | CSV File, no title/description | Type of export |
| 🔴 | fileJson | JSON File | Type of export |
| 🔴 | fileXml | XML File | Type of export |
|  | Word | Word | Initial column name |
|  | PartOfSpeech | Part of Speech | Initial column name |
|  | Definition | Definition | Initial column name |
|  | lexiconMergeInstructions | This will combine the selected Lexicon items into one single Lexicon item. Use the "How to Merge" section to choose how the items are merged, and see a preview of the final result in the "Current Merged Result" section. This action cannot be undone. |  |
|  | HowToMerge | How to Merge |  |
|  | CurrentMerge | Current merged result: | *(presentation context)* |
| 🔴 | CancelMerge | Cancel Merging |  |
| 🔴 | SaveMerge | Save and Merge |  |
| 🟥 🔵 | MergeItems | Merge Items |  |
| 🔴 | merge.first | Use first non-blank value | Lexicon merging option |
| 🔴 | merge.last | Use last non-blank value | Lexicon merging option |
| 🔴 | merge.merge | Merge all non-blank values together | Lexicon merging option |
| 🔴 | merge.firstAll | Use first value, even if it's blank | Lexicon merging option |
| 🔴 | merge.lastAll | Use last value, even if it's blank | Lexicon merging option |
| 🔴 | merge.mergeAll | Merge all values together, including any that are blank | Lexicon merging option |
| 🔴 | merge.blank | Save nothing, leave blank | Lexicon merging option |

### info

The `info` key has multiple subkeys. They are all arrays of strings in Markdown format.

#### info.basic

```javascript
[
  "This tool is for storing the raw info of your language, whether that be words or something else. The default setup includes dictionary-style columns such as \"word\", \"part of speech\" and \"definition\", but you can add, remove, or rename columns as you see fit."
]
```

#### info.description

```javascript
[
  "The beginning of the page has a place where you can title your collection and give it a short description. You can toggle this entire section by using the (^) button at the top of the page."
]
```

#### info.saveCounterAndSort

```javascript
[  
  "The save button at the top can be used to store, delete, and export entire lexicons.",  
  "",  
  "Below the title and description, you'll find a counter displaying how many words you have stored in your $t(common:Lexicon). Next to it is are two sort buttons, where you can choose which columns will be used to sort your collection."  
]
```

#### info.editColumnsEtc

**Note:** Use `` `DRAG HANDLE` `` to insert the drag handle icon into the text.

```javascript
[  
  "The gear icon opens the **Edit Columns** settings. You can choose whether or not to show the columns' full names, the method you wish to use to sort the $t(common:Lexicon), and how blank columns will be handled. Below that you'll find a list of all current columns. You can edit them, delete them, add more, or use the &#96;DRAG HANDLE&#96; drag handles to rearrange their order.",
  "",
  "The second row contains the titles of the columns. Beneath them are input boxes for quickly adding info to the $t(common:Lexicon). Use the small (+) button to save what you've typed.",
  "",
  "Under those boxes you'll find the meat of $t(common:Lexicon): all the items you've stored. They will appear as striped rows. You can **swipe left** on each one to find **Edit** and **Delete** buttons."
]
```

#### info.mergeButton

```javascript
[  
  "You can swipe right on a lexicon item to find the **Merge Items** button. You can use this to mark multiple entries. Once you've selected at least two, a large paperclip button will appear at the bottom of the page. Tapping on it will prompt you to merge the selected items into one entry.",
  "",
  "Several tools in $t(common:appTitle) can export info into the $t(common:Lexicon). The merge function can be used to merge all this different info. Here's an example:",
  "",
  "1. You begin by naming columns in the $t(common:Lexicon) \"original\", \"changed\", and \"definition\".",
  "2. Then, you use $t(common:WordGen) to create a bunch of new words, which you export to $t(common:Lexicon) under the \"original\" column.",
  "3. Next, you change those words with $t(common:WordEvolve) and export the changed words to \"changed\".",
  "4. Then, you visit $t(common:Concepts) and export meanings to \"definition\".",
  "5. Finally, you swipe and link each \"original\", \"changed\" and \"definition\" column with each other and merge them into single entries."
]
```

#### info.toolButton

```javascript
[
  "At the bottom of the page, you'll find a large tool button. You can tap on it to pull up a small menu. Tap on the (+) button to pop up a large form for adding to the $t(common:Lexicon). Tap on the trash can to enter mass-delete mode, where you can select multiple entries and delete them all at once."
]
```

---

## Declenjugator : dj.tsx

| Label | Key | English Translation | Description (if needed) |
| --- | --- | --- | --- |
| 🟥 | Groups | Groups | The delenjugation groups as a whole |
|  | Group | Group | used in `thingDeleted` and `thingSaved` |
| 🟦2.5 | groupsDeleted_one | {{count}} Group deleted. |  |
| 🟦2.5 | groupsDeleted_other | {{count}} Groups deleted. | English plural of the key above |
| 🟦2.5 | GroupSaved | Group saved. |  |
| 🟦2.5 | GroupDeleted | Group deleted. |  |
| 🟥 | Type | Type | The 'type' refers to whether a group is a declension, conjugation, or other. |
|  | Type_presentation | Type: | *(presentation context)* |
| 🔴 | Declension | Declension |  |
| 🟥 | Declensions | Declensions | group of declensions on-screen |
| 🟥 | AddDeclensions | Add Declension |  |
| 🟥 | EditDeclensions | Edit Declension |  |
| 🟦2.5 | DeclensionsSaved | Declension saved. |  |
| 🟨 | DeleteDeclensions | Delete Declension? |  |
| 🔴 | Conjugation | Conjugation |  |
| 🟥 | Conjugations | Conjugations | group of conjugations on-screen |
| 🟥 | AddConjugations | Add Conjugation |  |
| 🟥 | EditConjugations | Edit Conjugation |  |
| 🟨 | DeleteConjugations | Delete Conjugation? |  |
| 🟦2.5 | ConjugationsSaved | Conjugation saved. |  |
| 🔴 | Other1 | Other | 'other' type of declension/conjugation |
| 🟥 | Other | Other | group of 'other' type on-screen |
| 🟥 | AddOther | Add Other |  |
| 🟥 | EditOther | Edit Other |  |
| 🟨 | DeleteOther | Delete Other? |  |
| 🟦2.5 | OtherSaved | Other saved. |  |
|  | Forms | Forms | a plural version of 'other', mainly used in exports |
|  | errorBadInternalFormatMsg | Error in exporting: bad format (internal) | An error message that only appears if something goes very wrong when exporting from Declenjugator |
| 🔵 | WordsToGiveDJ | Words to send through $t(common:Declenjugator) |  |
|  | EnterWordsOnePerLine | Enter words here, one per line |  |
| 🟡 | delEntireGroup | This will delete this entire Group, and cannot be undone. |  |
| 🟡 | clearEverythingMsg | This will clear and overwrite all current Groups. |  |
| 🟨 | ClearAllGroups | Clear All Groups? |  |
| 🟡 | needTitleOrDescriptionMsg | You must provide a title or description before saving. |  |
| 🟡 | regExNeedsBothMsg | If using regular expressions, you must provide both match and replacementExpressions. |  |
| 🟡 | needConditionMsg | You must provide at least one condition (start or end) before saving. |  |
| 🟡 | noMatchExpressionMsg | You did not enter a match expression. |  |
| 🟥 | AddGroup | Add Group |  |
| 🟥 | EditGroup | Edit Group |  |
|  | TitleInput | Title or Description of this grouping: | *(presentation context)* |
| 🔵 | TypesBeingAffected | Type(s) of word this group affects |  |
|  | TypesBeingAffected_presentation | Type(s) of word this group affects: | *(presentation context)* |
|  | exampleAppliesTo | nouns? verbs? adjectives? |  |
|  | UseRegExpToIdStem | Use regular expressions to identify the stem. |  |
| 🟥 | SimpleRootFinder | Simple Root Finder |  |
| 🟥 | Modification | Modification |  |
| 🟥 | MatchingExpression | Matching Expression |  |
|  | MatchingExpression_presentation | Matching Expression: | *(presentation context)* |
| 🟥 | ReplacementExpression | Replacement Expression |  |
|  | ReplacementExpression_presentation | Replacement Expression: | *(presentation context)* |
| 🟥 | TitleMethod_Declensions | Title or Description of this declension: | *(presentation context)* |
| 🟥 | TitleMethod_Conjugations | Title or Description of this conjugation: | *(presentation context)* |
| 🟥 | TitleMethod_Other | Title or Description of this method: | *(presentation context)* |
| 🟦2.5 | TitleSaved | Title/Description saved. |  |
|  | advancedExplanation_Declensions | Use regular expressions to craft a declension. |  |
|  | advancedExplanation_Conjugations | Use regular expressions to craft a conjugation. |  |
|  | advancedExplanation_Other | Use regular expressions to craft a method. |  |
|  | groupAppliesTo | ; applies to {{appliesTo}} | This is appended to a description of a Group; `{{appliesTo}}` will be a user-generated string |
| 🟥 | WhatIsDJ | What is $t(common:Declenjugator)? |  |
| 🟡 | noFormatMsg | You didn't select a format. |  |
| 🟡 🟦2.5 | noDisplayGroupMsg | Please choose at least one Group to display. |  |
| 🟥 | UnmatchedWords | Unmatched Words |  |
| 🟥 | declenjugatorTitle | Declension/Conjugation Title |  |
| 🟥 | declenjugatorDocumentTitle | Declensions/Conjugations | Used in `docx` exports |
|  | declenjugatorDocumentDescription | A declension/conjugation document exported from $t(common:appTitle). | Used in `docx` exports |
|  | caseMakerInstructions | Tap on terms to add them. Tap them again to remove them. Tap save button when you're finished. |  |
| 🔴 | Hide | Hide |  |
| 🔴 | ShowMore | Show More |  |
|  | DisplayAs | Display as: | *(presentation context)* |
| 🔴 | ChartTopHeaders | Chart, Top Headers |  |
| 🔴 | ChartSideHeaders | Chart, Side Headers |  |
| 🔴 | Text | Text |  |
| 🟥 | UseInput | Use $t(common:Input) |  |
|  | showDeclenjugationsInInputMsg | Display the declensions/conjugations of words in the input. |  |
| 🟥 | ShowGroupInfo | Show Group Info |  |
|  | includeGeneralInfoMsg | Include general Group information. |  |
| 🟥 | ShowExamples | Show Examples |  |
|  | includeGenericMsg | Include generic example. |  |
| 🟥 | SortInput | Sort $t(common:Input) |  |
| 🟥 | OneMatch | OneMatch |  |
|  | oneMatchMsg | $t(common:Input) words can only match one method |  |
| 🟥 | ShowUnmatchedWords | Show Unmatched Words |  |
|  | showUnmatchedMsg | Display any words that were not matched by any Group. |  |
| 🟥 | InputTab | $t(common:Input) Tab |  |
| 🟥 | GroupsTab | Groups Tab |  |
| 🟥 | OutputTab | Output Tab |  |
| 🟥 | RegExp | Regular Expression |  |
| 🟡 | willClearOverwriteMsg | This will clear and overwrite the previous save. |  |
| 🔴 | Export | Export |  |
| 🟥 | Example | Example |  |
| 🟥 | Examples | Examples |  |
| 🟥 | Prefix | Prefix |  |
| 🟥 | Suffix | Suffix |  |
| 🟥 | stem | stem |  |
| 🟥 | word | word |  |
|  | wordBlock | \[word\] |  |
|  | stemBlock | \[stem\] |  |
|  | noMatchesMsg | No words matched this Group. |  |
| 🔵 | RemoveFromEndOfWordToFindRoot | Remove from End of Word to Find Root |  |
| 🟥 | RemoveFromEndOfWordToFindRoot_presentation | Remove from End of Word to Find Root: | *(presentation context)* |
| 🔵 | RemoveFromStartOfWordToFindRoot | Remove from Start of Word to Find Root |  |
| 🟥 | RemoveFromStartOfWordToFindRoot_presentation | Remove from Start of Word to Find Root: | *(presentation context)* |
| 🟥 | UseAdvancedMethod | Use advanced method |  |
| 🟥 | UseEntireWord | Use entire word |  |
|  | modBaseWordNotStemMsg | This applies your modifications to the base word instead of the stem. |  |
|  | SepMultiWith | Separate Multiple Conditions With: | *(presentation context)* |
| 🔵 | ChooseSeparator | Choose Separator |  |
| 🔴 | Space | \[ \] Space |  |
| 🔴 | Comma | \[,\] Comma |  |
| 🔴 | Semicolon | \[;\] Semicolon |  |
| 🔴 | Slash | \[/\] Slash |  |
|  | wordMarker | \[W\] | a small notation that this declension/etc uses the "entire word" option instead of the stem/root |
|  | matchesParameters | matches {{params}} | This is a short description describing how a declension or conjugation is found. `{{params}}` may become something like `"-ar, -or"`, `"en-oof"`, or `"/\[a-z\]d\[aeiou\]$/"` |

### cases

The `cases` object is an array of objects. Each object has a `header` property (a string), a `content` property (an array, described below), and an optional `extended` property (an array, same contents as `content`).

The `content` and `extended` properties are an array of either strings or arrays with exactly two strings.

The `header` is presented to the user, along with the items in the content property. (Items that are arrays only show the first string.) Tapping on an item will add it to the user's input, along with a single space. (Items that are array will add the second string instead of a space.)

The `extended` items will be hidden; the user can toggle to see them, At which point they appear the same way as `content` items.

```javascript
[
  {  
    header: "Modifiers",  
    content: [ [ "non-", "" ], [ "high-", "" ], [ "low-", "" ], "formal", "diminutive", "augmentative", "emphatic" ]  
  },
  {  
    header: "Number",  
    content: [ "singular", "plural", "dual", "trial", "paucal", "definite", "indefinite" ]  
  },
  {  
    header: "Noun Case",  
    content: [ "male", "female", "neuter", "animate", "inanimate" ]  
  },
  {  
    header: "Grammatical Case",  
    content: [ "nominative", "accusative", "genitive", "dative", "ablative", "instrumental", "locative" ],  
    extended: [ "vocative", "ergative", "absolutive", "partitive", "abessive", "adessive", "allative", "benefactive", "causal", "comitative", "delative", "distributive", "elative", "essive", "illative", "inessive", "instructive", "interrogative", "semblative", "sociative", "sublative", "superessive", "temporal", "terminative", "translative", "proximal", "relative", "adverbial", "oblique", "prepositional" ]  
  },
  {  
    header: "Person",  
    content: [ "1st-person", "2nd-person", "3rd-person", "1s", "1pl", "2s", "2pl", "3s", "3pl" ]  
  },
  {  
    header: "Tense",  
    content: [ "past", "present", "future" ]  
  },
  {  
    header: "Aspect",  
    content: [ "perfective", "imperfective", "perfect", "continuative", "progressive" ],  
    extended: [ "pluperfect", "habitual", "punctual", "iterative", "completive", "inceptive", "atelic", "telic", "static" ]  
  },
  {  
    header: "Mode",  
    content: [ "realis", "irrealis", "conditional", "subjunctive", "interrogative" ],  
    extended: [ "optative", "deontic", "hypothetical", "imaginary", "potential", "evidentiality", "validationality", "mirativity" ]  
  },
  {  
    header: "Valence",  
    content: [ "causative", "applicative", "reflexive", "reciprocal", "passive", "inverse", "anticausative", "antipassive" ]  
  }
],
```

### info

The `info` object has several properties. Most are arrays of strings in Markdown format, but one is special.

#### info.input

```javascript
[
  "This tab has one purpose: determining which words you want to decline or conjugate. Using this tab is entirely optional.",
  "",
  "The easiest way is to copy-paste a list of words, each on a line by itself. Or, you can use the **Import From Lexicon** button to pull in words stored in the **$t(common:Lexicon)**.",
  "",
  "Use the **$t(common:Input)** button to empty all words from $t(common:Input)."
]
```

#### info.groups

`` `DRAG HANDLE` `` (or any other text inside backticks) will be replaced with the drag handle icon.

```javascript
[
  "This is where you define groups of declensions and conjugations. Most languages treat certain groupings of words differently when they are declined or conjugated. For instance, English only declines its pronouns for case and person while Spanish has different conjugations for verbs depending on if they end in -ar, -er, or -ir.",
  "",
  "Click the (+) button to add a new Group. When you make a Group, you must give it a title or description. You can choose to label this as a _declension_, a _conjugation_ or under _other_ if you don't want to use those labels Optionally, you can note what types of words this Group will apply to.",
  "",
  "Next, you will provide instructions on how to find the \"$t(stem)\" of the word. For example, if you were creating a conjugation for words ending in -ar, you would put \"ar\" in the box labelled \"$t(RemoveFromEndOfWordToFindRoot)\".",
  "",
  "Note: You can provide multiple conditions. For instance, putting \"ar\" in both boxes will match words that begin with ar- _and_ end with -ar. You can also hit the \"$t(UseAdvancedMethod)\" toggle switch to use **regular expressions** to find a $t(stem). (See the end of this section for more info on regular expressions.)",
  "",
  "---",
  "",
  "At the end of the form, you will see an \"$t(common:AddNew)\" button. Use this to create the Group's individual declensions or conjugations. For simplicity, we will use the term \"method\" to mean either.",
  "",
  "First, you give the method a title. There is a small (+) button next to the input that will open a pop-up with numerous common declension and conjugation types, if you wish to use it.",
  "",
  "Below that is a toggle \"$t(UseEntireWord)\". If checked, the method will operate on the entire word instead of just the $t(stem).",
  "",
  "At the bottom, there are two input boxes around the word \"$t(stem)\". (This becomes \"$t(word)\" if you check the toggle above.) If this method would add a prefix, put the prefix in the box before \"$t(stem)\". If it would use a suffix, put it in the box after \"$t(stem)\". You can use both boxes for a circumfix but for infixes and other more complicated changes, you will need to use the \"advanced method\" and regular expressions.",
  "",
  "---",
  "",
  "Once your Groups are made, they will show up on the screen. Swipe left on them to find $t(common:Edit) and $t(common:Delete) buttons. You can also use the &#96;DRAG HANDLE&#96; drag handles to rearrange their order. (Note: you can't rearrange across types dragging a \"conjugation\" into the \"other\" or \"declension\" areas, for example. If you want to change its type, swipe left and choose the $t(common:Edit) button.)",
  "",
  "Here's an example of possible methods you could make for a Spanish-type conjugation:"
]
```

#### info.groupsExample

This is an array of two objects. Each object has a `title` property as a header and a `content` property that is an array of strings in Markdown format.

```javascript
[
  //This first object describe a Declenjugation group.
  {
    title: "Group",
    content: [
      "- **$t(common:Title)**: Conjugations (A)",
      "- **Type**: _conjugation_",
      "- **Remove from Start of Word**: (blank)",
      "- **Remove from End of Word**: ar",
    ],
  },
  //This second object describes a set of conjugations.
  {
    title: "Conjugations",
    content: [
      "- **1st-person singular present**: $t(stem)[o]",
      "- **2nd-person singular present**: $t(stem)[as]",
      "- **3rd-person singular present**: $t(stem)[a]",
      "- **1st-person plural present**: $t(stem)[amos]",
      "- **3rd-person plural present**: $t(stem)[an]",
    ],
  }
]
```

#### info.output

```javascript
[
  "This is where you can find the results of your work. At the top of the page, you can choose how you want the information to display, and choose if you want to display declensions conjugations, and/or other. If you want to decline/conjugate words you put in the **$t(common:Input)** tab be sure to switch the toggle on. It will open up a new set of options you can use to fine-tune the results.",
  "",
  "Click on $t(common:Generate) to display your info, or click on $t(Export) to export your info to a file. **Note**: when displaying a chart in the app, it may clip off the edge of the screen. If this happens, you can drag the chart left and right to scroll the hidden areas into view."
]
```

#### info.overview

```javascript
[
  "This tool is for creating **declensions** and **conjugations**.",
  "",
  "A declension is, at its most basic, modifying a word to show its role in a sentence. $t(Declensions) may apply to nouns pronouns, adjectives, adverbs, and articles to indicate number (singular, dual, plural, etc), case (nominative accusative, genitive, dative, etc), gender (male, female inanimate, etc), and other grammatical categories. ",
  "",
  "A conjugation is much like a declension, but it modifies verbs. Like declensions, they can indicate number gender, and case, but they also often include person (I, you they, etc), tense (past, present, future, etc), aspect (perfect, imperfect, etc), mood/mode, politeness, and numerous other verb qualities."
]
```

---

## MorphoSyntax : ms.tsx

| Label | Key | English Translation | Description (if needed) |
| --- | --- | --- | --- |
|  | showUnused | \[ "\#\# Show Unused Sections", "", "Include sections that you did not fill out, leaving space for you to write in later.&nbsp;&nbsp;", "\*\*NOTE: this option has no effect on JSON and XML exports.\*\*" \] | This is an array of strings in Markdown format. |
|  | clearMSInfo | Clear MorphoSyntax Info |  |
| 🔴 | confirmClear | Yes, Clear All | Confirmation when clearing all info. |
| 🟦2.5 | noInfoToClearMsg | You have no information to clear. |  |
| 🟦2.5 | clearedMS | All MorphoSyntax information has been cleared. |  |
| 🟡 | clearAllMS | This will clear and overwrite everything currently in MorphoSyntax (but not anything previously saved) |  |
| 🟡 | needInfoToExportMsg | Please add information to your MorphoSyntax document in at least one section before exporting it. |  |
|  | msDocument | {{title}} - MorphoSyntax Document | *(formal context)* Used in `docx` exports as the title of the file; `{{title}}` is replaced with the user-generated title. |
|  | msDocumentDescription | A MorphoSyntax document exported from $t(common:appTitle). | Used in `docx` exports to describe the file |
| 🟥 | DeleteMorphoSyntaxDocument | Delete Saved MorphoSyntax Info | *(formal context)* |
| 🟥 | MorphoSyntaxSettings | MorphoSyntax $t(common:Settings) |  |
| 🟥 | NoSavedMorphoSyntaxDocuments | No Saved MorphoSyntax Documents. |  |
| 🟡 | clearMSInfoMsg | This will clear and overwrite your current MorphoSyntax information |  |
| 🔵 | msTitle | MorphoSyntax Title |  |
| 🟥 | msTitle_presentation | MorphoSyntax Title: | *(presentation context)* |
|  | UsuallyLangName | Usually the language name. |  |
|  | ShortDescriptionMsg | A short description of this document. |  |
| 🔴 | DeleteSavedMorphoSyntaxInfo | Delete Saved MorphoSyntax Info |  |
| 🟦2.5 | SavedMorphoSyntaxInfoDeleted | Saved MorphoSyntax info deleted. |  |
| 🟥 🔴 | ExportMorphoSyntaxInfo | Export MorphoSyntax Info |  |
| 🔴 | SaveMorphoSyntaxInfo | Save MorphoSyntax Info |  |
| 🟥 🔴 | LoadMorphoSyntaxInfo | Load MorphoSyntax Info |  |
| 🟦2.5 | MorphoSyntaxInfoSaved | MorphoSyntax info saved. |  |
| 🟥 | MISSINGTITLE | MISSING TITLE | (error message) |
| 🔴 | genericInfoButtonText | Information |  |
| 🔵 | rangeFromTo | Range from {{start}} to {{end}} |  |
|  | missingDocumentMsg | \[MISSING\] | This is an error message that only appears in exports. |
|  | missingTextDocumentMsg | \[MISSING TEXT PROMPT\] | This is an error message that only appears in exports. |
|  | noLabelDocumentMsg | \[LABEL NOT FOUND FOR "{{box}}"\] | This is an error message that only appears in exports. `{{box}}` is an internal name. |
|  | noTextExportMsg | \[NO TEXT ENTERED\] | This is an informative message that is only used in exports. |
|  | noDescriptionExportMsg | \[NO DESCRIPTION PROVIDED\] | This is an informative message that is only used in exports. |
|  | noSelectionExportMsg | \[NONE SELECTED\] | This is an informative message that is only used in exports. |
|  | textUnselectedRange | {{number}} | Indicates a number **not** selected by user; only used in textual exports. |
|  | textSelectedRange | ({{number}}) | Indicates the number selected by user; only used in textual exports. |
|  | textCheckedBox | X | This indicates that a checkbox was checked; only used in textual exports. |

### The Rest of the Keys

The remaining keys are where you'll find the essence of MorphoSyntax: the jargon-heavy explanation of linguistics. They are covered in [MORPHOSYNTAX.md](MORPHOSYNTAX.md).

---

## WordGen and WordEvolve Common Terms : wgwe.tsx

These are terms that are used in both WordGen and WordEvolve.

| Label | Key | English Translation | Description (if needed) |
| --- | --- | --- | --- |
|  | CharGroups | Character Groups | Title of page |
|  | CharGroups_shorter | Char Groups | Shorter version of the above key, used on smaller screens in the tab bar |
| 🟦2.5 | charGroupsDeleted_one | {{count}} Character Groups deleted. |  |
| 🟦2.5 | charGroupsDeleted_other | {{count}} Character Groups deleted. | English plural of the above |
| 🟦2.5 | CharGroupDeleted | Character Group deleted. |  |
| 🟦2.5 | transDeleted_one | {{count}} Transformation deleted. |  |
| 🟦2.5 | transDeleted_other | {{count}} Transformations deleted. |  |
| 🟨 | DeleteAll | Delete All |  |
| 🟡 | delAllCharGroups_one | This will delete the current character group, and cannot be undone. | Takes a `{{count}}` property, if needed. |
| 🟡 | delAllCharGroups_other | This will delete all {{count}} current character groups, and cannot be undone. | English plural version of the above key. |
| 🟡 | delAllTransforms_one | This will delete the current transformation, and cannot be undone. | Takes a `{{count}}` property, if needed. |
| 🟡 | delAllTransforms_other | This will delete all {{count}} current transformations, and cannot be undone. | English plural version of the above key. |
| 🟦2.5 | importCharGroups_one | Imported {{count}} Character Group. |  |
| 🟦2.5 | importCharGroups_other | Imported {{count}} Character Groups. | English plural version of the above key. |
| 🟡 | importOverwriteCG | If any current character group has the same label as an incoming character group, the current character group will be overwritten. Do you want to continue? |  |
| 🟨 | AddCharGroup | Add Character Group |  |
| 🟨 | DeleteCharGroup | Delete Character Group |  |
| 🟨 | EditCharGroup | Edit Character Group |  |
| 🟨 | SaveCharGroup | Save Character Group |  |
| 🟦2.5 | CharGroupSaved | Character Group saved. |  |
|  | Transformations | Transformations | Title of page |
|  | Transformations_shorter | Transforms | Shorter version of the above key, used on smaller screens in the tab bar |
|  | DescOfTheTransformation | Description of the transformation |  |
|  | DescOfTheTransformation_formal | Description of the transformation | *(formal context)* |
|  | DescOfTheTransformation_presentation | Transformation Description: | *(presentation context)* |
| 🟨 | AddTransformation | Add Transformation |  |
| 🟦2.5 | TransformationAdded | Transformation added. |  |
| 🔴 | SaveTrans | Save Transformation |  |
| 🟦2.5 | TransSaved | Transformation saved. |  |
| 🟥 | EditTrans | Edit Transformation |  |
| 🔴 | DeleteTrans | Delete Transformation |  |
| 🟦2.5 | TransDeleted | Transformation deleted. |  |
| 🟡 | noSearchMsg | No search expression present |  |
|  | searchExpression | search expression |  |
|  | searchExpression_formal | Search Expression | *(formal context)* |
|  | searchExpression_presentation | Search Expression: | *(presentation context)* |
|  | replacementExpression | replacement expression |  |
|  | replacementExpression_formal | Replacement Expression | *(formal context)* |
|  | replacementExpression_presentation | Replacement Expression: | *(presentation context)* |
| 🟥 | CharacterGroupsTab | Character Groups Tab |  |
| 🟥 | TransformationsTab | Transformations Tab |  |
| 🟥 | OutputTab | Output Tab |  |
| 🟥 | OutputOptions | Output Options |  |
| 🟦4 | cantMakeLabelMsg | Unable to suggest a unique label from the given descrption. |  |
| 🟡 | noTitleMsg | No title present |  |
| 🟡 | noLabelMsg | No label present |  |
| 🟡 | duplicateLabel | There is already a label "{{label}}" |  |
| 🟡 | invalidLabel | You cannot use "{{label}}" as a label |  |
| 🟡 | noRunMsg | No run present |  |
| 🔵 | TitleOrDesc | Title or description |  |
| 🟥 | TitleOrDesc_presentation | Title/Description: | *(presentation context)* |
| 🔵 | ShortLabel | Short Label |  |
| 🟥 | ShortLabel_presentation | Short Label: | *(presentation context)* |
|  | OneCharOnly | 1 character only |  |
| 🔴 | Suggest | Suggest | suggest a 1-character label for this character group |
| 🔵 | LettersCharacters | Letters, Characters |  |
| 🟥 | LettersCharacters_presentation | Letters/Characters: | *(presentation context)* |
|  | enterCharsInGroupHere | Enter characters in Character Group here |  |
|  | WhatToChange | what to change | Helper text for a text input |
|  | WhatItChangesTo | what it changes into | Helper text for a text input |

---

## WordEvolve : we.tsx

| Label | Key | English Translation | Description (if needed) |
| --- | --- | --- | --- |
|  | Evolve | Evolve |  |
|  | SoundChanges | Sound Changes | Title of page |
|  | SoundChanges_shorter | Changes | Shorter version of the above key, used on smaller screens in the tab bar |
|  | SoundChangesTab | Sound Changes Tab |  |
| 🟦2.5 | changesDeleted_one | {{count}} Sound Change deleted. |  |
| 🟦2.5 | changesDeleted_other | {{count}} Sound Changes deleted. | English plural form of the above |
| 🟥 | AddSoundChange | Add Sound Change |  |
| 🟦2.5 | SoundChangeAdded | Sound Change added. |  |
| 🔴 | DeleteSoundChange | Delete Sound Change |  |
| 🟥 | EditSoundChange | Edit Sound Change |  |
| 🔴 | SaveSoundChange | Save Sound Change |  |
| 🟦2.5 | SoundChangeDeleted | Sound Change deleted. |  |
| 🟦2.5 | SoundChangeSaved | Sound Change saved. |  |
| 🟥 🔴 | ConvertToLowercase | Convert input to lowercase before evolving |  |
| 🟥 🔴 | SortBeforehand | Sort input before evolving |  |
| 🟡 | delAllSC | This will delete all current sound changes, and cannot be undone. |  |
|  | Context | Context |  |
|  | Exception | Exception |  |
| 🟡 | noUnderscore | {{what}} must contain one underscore (\_) | `{{what}}` is either Context or Exception above |
| 🟡 | multiUnderscore | {{what}} can only have one underscore (\_) | `{{what}}` is either Context or Exception above |
| 🟡 | wordBoundaryError | {{what}} can only have word-boundaries (\#) at the beginning and/or end | `{{what}}` is either Context or Exception above |
|  | soundChangeDesc | Description of the sound change |  |
|  | soundChangeDesc_presentation | Sound Change Description: | *(presentation context)* |
| 🟥 | Overview | Overview: $t(common:WordEvolve) |  |
| 🟥 | WhatIsWE | What is $t(common:WordEvolve)? |  |
| 🔵 | WordsToEvolve | Words to Evolve |  |
| 🟥 | InputTab | $t(common:Input) Tab |  |
|  | EnterWordsHere | Enter words here, one per line |  |
| 🟨 | ClearInput | Clear Input |  |
| 🟡 | noSoundChangesMsg | You have no sound changes defined. |  |
| 🟡 | noInputWordsMsg | You have no input words to evolve. |  |
|  | soundToChange | sound to change |  |
|  | soundChangesTo | sound changes into this |  |
|  | whereChangeHappens | where the change happens |  |
|  | whereChangeDoesntHappen | where the change cannot happen |  |
| 🔵 | InputExpression | Input Expression |  |
| 🟥 | InputExpression_presentation | Input Expression: | *(presentation context)* |
| 🔵 | OutputExpression | Output Expression |  |
| 🟥 | OutputExpression_presentation | Output Expression: |  |
|  | TransformationDirection | Transformation Direction: | *(presentation context)* |
|  | atInputUndoOutput | At input, then undo at output |  |
|  | atInputUndoOutput_formal | At Input, Then Undo At Output | *(formal context)* |
|  | atInputAtOutput | At input and at output |  |
|  | atInputAtOutput_formal | At Input and At Output | *(formal context)* |
|  | atInput | At input only |  |
|  | atInput_formal | At Input Only | *(formal context)* |
|  | atOutput | At output only |  |
|  | atOutput_formal | At Output Only | *(formal context)* |
|  | contextExpression_formal | Context Expression | *(formal context)* |
|  | contextExpression_presentation | Context Expression: | *(presentation context)* |
|  | exceptionExpression_formal | Exception Expression | *(formal context)* |
|  | exceptionExpression_presentation | Exception Expression: | *(presentation context)* |
| 🔴 | OutputOnly | $t(common:Output) only |  |
| 🔴 | OutputAndSCRules | $t(common:Output) and Sound-Change Rules |  |
| 🔴 | InputThenOutput | $t(common:Input), then $t(common:Output) |  |
| 🔴 | OutputThenInput | $t(common:Output), then $t(common:Input) |  |
| 🟥 | ImportFromWG | Import from WordGen |  |
| 🟡 | clearAllThingsMsg | This will clear and overwrite all current character groups, transformations and sound changes |  |
|  | GrassmannLaw | Grassmann's Law | Used in Presets |
|  | RukiRule | Ruki Rule | Used in Presets |
|  | DahlLaw | Dahl's Law | Used in Presets |
|  | IngvaeonicNasalSpirantLaw | Ingvaeonic Nasal Spirant Law | Used in Presets |
|  | GrimLaw | Grim's Law | Used in Presets |
|  | GreatEnglishVowelShift | Great English Vowel Shift | Used in Presets |
|  | HighGermanConsonantShift | High German Consonant Shift | Used in Presets |
|  | UnvoicedConsonants | Unvoiced Consonants | Used in Presets |
|  | VoicedConsonants | Voiced Consonants | Used in Presets |
|  | Vowels | Vowels | Used in Presets |
|  | NewVowels | New Vowels | Used in Presets |

### info

The `info` key has multiple subkeys. All but one are arrays of strings in Markdown format.

#### info.input

```javascript
[
  "This tab has one purpose: determining which words you want to change.",
  "",
  "The easiest way is to copy-paste a list of words, each on a line by itself. Or, you can use the **Import from Lexicon** button to pull in words stored in the **$t(common:Lexicon)**.",
  "",
  "Use the **$t(common:Clear)** button to empty all words from $t(common:Input)."
],
```

### info.charGroups

```javascript
[
  "This is where you define groups of characters representing sounds. You can reference these character groups in **Transformations** and **Sound Changes** to fine-tune the way your language evolves.",
  "",
  "Click the (+) button to add a new character group. When you make a character group, you must give it a _description_ and a one-character _label_. The description is for your own benefit, while the label will be used to refer to this character group in the other tabs. The label can be any single character except for these: **^$()[]{}.*+?|**. The letters/characters in your character group are called a _run_."
],
```

### info.transformations

Words placed in `` `backticks` `` will be replaced with the icon for a drag hande

```javascript
[
  "There may be cases when you need to modify the input words before you evolve them. A common reason would be to turn a group of characters (such as \"sh\", \"th\", or \"ng\" in English) into a single character that can be targeted more easily.",
  "",
  "When you make a new _transformation_, you provide an _input expression_, a _transformation direction_, an _output expression_, and, optionally, a _transformation description_ for your own benefit.",
  "",
  "The _transformation direction_ is either \"At input then undo at output\", \"At input and at output\", \"At input only\", or \"At output only\", and they determine how the two expressions are used.",
  "",
  "**At input only:** Before anything else happens, input words are searched, and any instances of the _input expression_ are replaced with the _output expression_. **Regular expressions** (see the **Sound Changes Tab**'s help section) and %Group references are allowed in the _input expression_ only. (A %Group reference is something like **%G** to indicate any character in character group G's run, or **!%G** to indicate any character _not_ in that run.)",
  "",
  "**At output only:** After all **sound changes** are processed, any instances of the _input expression_ are replaced with the _output expression_. Regular expressions and %Group references are allowed in the _input expression_ only.",
  "",
  "**At input then undo at output:** Before anything else happens, input words are searched, and any instances of the _input expression_ are replaced with the _output expression_. After all **sound changes** are processed, any instances of the _output expression_ are replaced with the _input expression_.",
  "",
  "Regular expressions are not allowed, but non-negative %Group references are allowed if and only if both input and output have them. In that case, something special happens: when the transformation matches a character in a character group, it will note what position that character is in the character group's run. It will then look at the other expression's character group and pick out the character in the same position.",
  "",
  "For example: If %S is being replaced with %Z, and those character groups have runs \"ptk\" and \"bdg\", \"p\" will be replaced with \"b\", \"t\" will be replaced with \"d\", and \"k\" will be replaced by \"g\". If the first character group has more letters than the second, the second character group's run will be repeated until it's long enough to find a match.",
  "",
  "NOTE: If you have unequal numbers of %Group references in the search and replacement expressions, errors may occur.",
  "",
  "**At input and at output:** As _At input then undo at output_, but the _input expression_ is replaced with the _output expression_ before AND after the **sound changes** are processed.",
  "",
  "Click the (+) button to add a new transformation. The first transformation in the list will be run first, the second transformation second, and so on down the list. This may cause unintended effects as previous transformations mutate the original word, so you can reorganize your transformations by using the `DRAG HANDLE` drag handles."
],
```

### info.soundChangesBlocks

This object defines `BlockFormat` objects that will be inserted into the text as specially-formatted HTML blocks.

The tables will have "important" text enclosed in a box, and "unimportant" text linking the boxes together.

Each object will have an optional `arrow` property (defaults to `"-&gt;"`), an optional `serif` property that changes the font to a serif font (defaults to `false`).

Each object chooses **one** of the following sets of properties to add.

1. **simple**: an array of strings in the format `important, uninmportant, important...`
2. **reversed**: an array of strings in the format `unimportant, important, unimportant...`
3. Three properties:
     - **important**: a string that marks the boundaries of "important" info (defaults to `"!"`)
     - **unimportant**: a string that marks the boundaries of "unimportant" info (defaults to `"$"`)
     - **complex**: an array of strings, each formatted as `"Some !important! and $unimportant$ stuff with regular stuff mixed in."`

You probably don't need to translate these or modify them in any way. They just express certain linguistic concepts. The arrow *may* need adjusting if your target language is RtL.

```javascript
{
  block1: {
    arrow: "->",
    simple: ["s", "->", "z", "/", "d_", "!", "_h"]
  },
  block2: {
    arrow: "->",
    simple: ["s", "->", "z", "/", "#_"]
  },
},
```

Other `info` properties may access these bits on information by putting a block's name inside of `` `backticks` `` on a line by itself. Anything else put inside backticks will be replaced with the drag handle icon.

### info.soundChanges

```javascript
[
  "This is where you determine how your words evolve. The display follows basic standard phonological rules for describing sound changes:",
  "",
  "`block1`",
  "",
  "The above means that \"s\" changes to \"z\" after a \"d\", but not when it's before an \"h\".",
  "",
  "The first box is the _search expression_, the second is the _replacement expression_, the third is the _context expression_, and the last is the _exception expression_.",
  "",
  "The _search expression_ can include plain text or **regular expressions** (see the end of this section for more info). It can also contain %Group references. (A %Group reference is something like **%G** to indicate any character in character group C's run, or **!%G** to indicate any character that is _not_ in that run.)",
  "",
  "The _replacement expression_ should be plain text. However, it can include non-negative %Group references **if and only if** the _search expression_ does, too. In that case, something special happens: when the evolver matches a character in a character group, it will note what position that character is in the character group's run. It will then look at _replacement_ character group and pick out the character in the same position. For example: If %S is being replaced with %Z, and those character groups have runs \"ptk\" and \"bdg\", \"p\" will be replaced with \"b\", \"t\" will be replaced with \"d\", and \"k\" will be replaced by \"g\". (If the first character group has more letters than the second, the second character group's run will be repeated until it's long enough to find a match.) **NOTE:** If you have unequal numbers of %Group references in the _search expression_ and _replacement expression_, errors may occur.",
  "",
  "The _context expression_ describes where in the word the _search expression_ must be before it can be changed into the _replacement expression_. The _exception expression_ is similar, but it describes where in the world a match **can't** be made. (The _exception expression_ is optional.)",
  "",
  "There are two characters in a _context expression_ and _exception expression_ that have special functions. The underscore **_** represents where the _replacement expression_ is being matched. You **must** include an underscore. The hash symbol **#** represents the beginning or end of a word. For example: if you want to turn \"s\" into \"z\" at the beginning of a word, you could create the following:",
  "",
  "`block2`",
  "",
  "If you have no special rules for where in a word a replacement can happen, just make a _context expression_ that's only a single underscore.",
  "",
  "Click the (+) button to add a new sound change. The first sound change in the list will be run first, the second sound change second, and so on down the list. This may cause unintended effects, so you can reorganize your sound change to avoid any such effects by using the `DRAG HANDLE` drag handles."
],
```

### info.outputMain

```javascript
[
  "This is where the magic happens. Click the **Generate** button and the evolver will process all your input words and present your output in the space below."
],
```

### info.outputSettings

```javascript
[
  "Click on the gear icon to open a list of options. The first is a drop-down menu where you can select what to output. The choices are **Output Only**, **Output and Sound-Change Rules**, **Input then Output** and **Output then Input**.",
  "",
  "Choosing **Output Only** will display a simple list of evolved words.",
  "",
  "**Output and Sound-Change Rules** displays the most complex output. For every word, it will print the input word, an arrow, and then the evolved word. Below that, it will print an indented list of the **Sound Changes** that evolved the word, in the format [rule] [arrow] [evolved word]. (If a sound change didn't affect that word, then it will be omitted from this list.)",
  "",
  "**Input then Output**, as you might guess, prints a list in the format [input word] [arrow] [evolved word]. **Output then Input** is the same, but the evolved word comes first.",
  "",
  "The second option under the gear icon determines the style of arrow that is displayed with the output."
],
```

### info.outputLexicon

```javascript
[
  "Once you've evolved words, you can save them to the **$t(common:Lexicon)**. Click the book button and the evolved words will light up. Tap on words you wish to save. When you've selected all the words you want, tap the book button again and you'll be given a pop-up where you can choose which **$t(common:Lexicon)** column to import them into."
],
```

### info.overview

```javascript
[
  "This tool is designed to take a list of words and transform them into (possibly) new forms. The idea is to mimic the way natural languages change over time.",
  "",
  "This is the most basic use case:",
  "- Decide on how your language will evolve over time.",
  "- Identify which parts will change, such as vowels and consonants.",
  "- Note the environment in which the sound change takes place. (For example, a vowel may change only if it's preceded by a nasal consonant.)",
  "",
  "The **$t(common:Input)** tab holds the words you wish to change. **Character Groups** can hold categories of sounds that will change in the same way. **Transformations** is a place where you can define complex transformations that may be needed to simplify your sound changes. (For example, you may want to simplify multi-letter sounds into a single character.) The **Sound Changes** tab is where you define the various changes you want to make, and the **$t(common:Output)** tab is where you can see the results."
]
```

---

## WordGen : wg.tsx

| Label | Key | English Translation | Description (if needed) |
| --- | --- | --- | --- |
| 🟥 | SyllablesTitle | Syllables | *(formal context)* Name of the Syllables page |
| 🟥 | Syllables | Syllables | *(formal context)* Label of the syllables box when only one type of syllable is presented |
| 🟦2.5 | syllablesDeleted_one | {{count}} Syllable deleted. |  |
| 🟦2.5 | syllablesDeleted_other | {{count}} Syllables deleted. | English plural form of the above |
| 🟥 | swSyllables | Single-Syllable Words | *(formal context)* |
|  | wiSyllables | word-initial syllables |  |
| 🟥 | wiSyllables_formal | Word-Initial Syllables |  |
|  | mwSyllables | mid-word syllables |  |
| 🟥 | mwSyllables_formal | Mid-Word Syllables |  |
|  | wfSyllables | word-final syllables |  |
| 🟥 | wfSyllables_formal | Word-Final Syllables |  |
| 🟥 | SyllablesTab | Syllables Tab |  |
| 🟥 | SettingsTab | Settings Tab |  |
| 🟥 | WhatIsWordGen | What is $t(common:WordGen)? |  |
|  | DeleteAllSyllables | Delete All Syllables |  |
| 🟡 | delAllSyllables | This will delete any and all current syllables, and cannot be undone. |  |
|  | syllableDropoffExplanation | Syllables at the top of a box tend to be picked more often than syllables at the bottom of the box. This slider controls this tendency. A rate of zero is flat, making all syllables equiprobable." |  |
|  | useLabelsToMakeSyllables | Use character group labels to construct syllables |  |
| 🔴 | useSepDropoffRate | Use separate dropoff rate | 🟥 |
|  | usedToBeginWords | These syllables are used to begin words |  |
|  | usedInMiddleOfWords | These syllables are used between the first and last syllable of a word |  |
|  | usedToEndWords | These syllables are used to end words |  |
| 🔵 | From0To50 | From 0 to 50 |  |
| 🔵 | From0To100 | From 0% to 100% |  |
| 🔵 | From2To15 | From 2 to 15 |  |
| 🟡 | noCharGroupsDefinedMsg | You have no character groups defined. |  |
| 🟡 | noSyllablesDefinedMsg | You have no syllables defined. |  |
| 🟡 | missingSyllableTypesMsg | You are missing one or more types of syllables. |  |
| 🟥 | unableToCreateXWords | Unable to create {{amount}} unique words (maxed out at {{max}}) |  |
|  | dropoffRate | Dropoff Rate | formal context |
|  | characterDropoffExplanation | Characters at the beginning of a group tend to be picked more often than characters at the end of the group. This slider controls this tendency. A rate of zero is flat, making all characters equiprobable." |  |
| 🟥 | CharGroupRunDropoff | Character Group run dropoff |  |
| 🟥 | SyllableBoxDropoff | Syllable box dropoff |  |
| 🔴 | UseMultiSyllTypes | Use multiple syllable types |  |
| 🔴 | PseudoText | Pseudo-text |  |
| 🔴 | Wordlist | Wordlist |  |
|  | AllPossibleSyllables | All possible syllables |  |
|  | NumberOfSentences | Number of sentences |  |
|  | CapitalizeWords | Capitalize words |  |
|  | SortOutput | Sort output |  |
|  | MultiColumnLayout | Multi-column layout |  |
|  | WordlistSize | Wordlist size |  |
| 🔴 | ShowSyllableBreaks | Show syllable breaks |  |
| 🔴 | SaveLoadCustomInfo | Save/Load Custom Info |  |
| 🟥 | RateOfMonos | Rate of monosyllable words |  |
| 🟥 | MaxSyllPerWord | Maximum number of syllables per word |  |
| 🔴 | CapSentences | Capitalize sentences |  |
|  | sentenceBeginning_declarative | Declarative sentence beginning |  |
|  | sentenceEnding_declarative | Declarative sentence ending |  |
|  | sentenceBeginning_interrogative | Interrogative sentence beginning |  |
|  | sentenceEnding_interrogative | Interrogative sentence ending |  |
|  | sentenceBeginning_exclamatory | Exclamatory sentence beginning |  |
|  | sentenceEnding_exclamatory | Exclamatory sentence ending |  |
| 🟥 | PresetsStoredInfo | Presets and Stored Info |  |
| 🟥 | WordGenControls | Word Generation Controls |  |
| 🔴 | Never | Never |  |
| 🔴 | Always | Always |  |
| 🟥 | PseudoTextControls | Pseudo-text Controls |  |
| 🟥 | WordListSyllListControls | Wordlist and Syllable-List Controls |  |
| 🟥 | WhatToGenerate | What to Generate |  |
| 🔴 | Default | Default | default sort option |
| 🟥 | ImportFromWE | Import from WordEvolve |  |
| 🟡 | clearAllThingsMsg | This will clear and overwrite all current character groups, transformations and sound changes |  |

### WordGen presets

These keys are a part of `wg.tsx` and name Presets and their components' descriptions.

| Label | Key | English Translation | Description (if needed) |
| --- | --- | --- | --- |
| 🔴 | Simple | Simple | Preset name |
| 🔴 | Medium | Medium | Preset name |
| 🔴 | Complex | Complex | Preset name |
| 🔴 | PseudoLatin | Pseudo-Latin | Preset name |
| 🔴 | PseudoChinese | Pseudo-Chinese | Preset name |
| 🔴 | PseudoGreek | Pseudo-Greek | Preset name |
| 🔴 | PseudoEnglish | Pseudo-English | Preset name |
| 🔴 | PseudoJapanese | Pseudo-Japanese | Preset name |
|  | Consonants | Consonants | Title of Character Group in a Preset |
|  | InitialConsonants | Initial consonants | Title of Character Group in a Preset |
|  | WordEndingConsonants | Word-ending consonants | Title of Character Group in a Preset |
|  | PreLiquidConsonants | Pre-liquid consonants | Title of Character Group in a Preset |
|  | SyllableFinalConsonants | Syllable-final consonants | Title of Character Group in a Preset |
|  | PNoLFConsonants | Post-nasal or -liquid Final Consonants | Title of Character Group in a Preset |
|  | Liquids | Liquids | Title of Character Group in a Preset |
|  | Nasals | Nasals | Title of Character Group in a Preset |
|  | Plosives | Plosives | Title of Character Group in a Preset |
|  | AspiratedConsonants | Aspirated consonants | Title of Character Group in a Preset |
|  | Vowels | Vowels | Title of Character Group in a Preset |
|  | MWVowels | Mid-word vowels | Title of Character Group in a Preset |
|  | Vowels1 | Vowels 1 | Title of Character Group in a Preset |
|  | Vowels2 | Vowels 2 | Title of Character Group in a Preset |
|  | Dipthongs | Dipthongs | Title of Character Group in a Preset |

Many of the translations below are in "glossing rules" format. See: <https://www.eva.mpg.de/lingua/resources/glossing-rules.php>

| Key | English Translation | Description (if needed) |
| --- | --- | --- |
| WFConjugation | Word-final conjugation | Title of Character Group in the "Complex" preset |
| CONJ | conjugation: {{type}} | Description of a Transformation in the "Complex" preset; `{{type}}` will be replaced by one of the keys below, which represent a gloss of a particular type |
| g1s | 1s | 1st-person singular; a `{{type}}` |
| g2s3sAN | 2s/3s.AN | 2nd-person singular, 3rd-person singular animate; a `{{type}}` |
| g2s | 2s | 2nd-person singular; a `{{type}}` |
| g3sAN | 3s.AN | 3rd-person singular animate; a `{{type}}` |
| g2sFORM | 2s.FORM | 2nd-person singular formal; a `{{type}}` |
| g3sINAN | 3s.INAN | 3rd-person singular inanimate; a `{{type}}` |
| g1DUIN | 1.DU.INCL | 1st-person dual inclusive; a `{{type}}` |
| g1DUEX | 1.DU.EXCL | 1st-person dual exclusive; a `{{type}}` |
| g1PAUIN1pIN | 1.PAU.INCL/1p.INCL | 1st-person paucal inclusive, 1st-person plural inclusive; a `{{type}}` |
| g1PAUIN | 1.PAU.INCL | 1st-person paucal inclusive; a `{{type}}` |
| g1PAUIN1PAUEX1pIN | 1.PAU.INCL/1.PAU.EXCL/1p.INCL | 1st-person paucal inclusive, 1st-person paucal exclusive, 1st-person plural inclusive; a `{{type}}` |
| g1PAUEX | 1.PAU.EXCL | 1st-person paucal exclusive; a `{{type}}` |
| g1PAUEX1pIN | 1.PAU.EXCL/1p.INCL | 1st-person paucal exclusive, 1st-person plural inclusive; a `{{type}}` |
| g1PAUEX1pEX | 1.PAU.EXCL/1p.EXCL | 1st-person paucal exclusive, 1st-person plural exclusive; a `{{type}}` |
| g1pIN | 1p.INCL | 1st-person plural inclusive; a `{{type}}` |
| g1pEX | 1p.EXCL | 1st-person plural exclusive; a `{{type}}` |
| g2PAU | 2.PAU | 2nd-person paucal; a `{{type}}` |
| g2PAUFORM | 2.PAU.FORM | 2nd-person paucal formal; a `{{type}}` |
| g2p | 2p | 2nd-person; a `{{type}}` |
| g2pFORM | 2p.FORM | 2nd-person formal; a `{{type}}` |
| g3PAUAN | 3.PAU.AN | 3rd-person paucal animate; a `{{type}}` |
| g3pAN | 3p.AN | 3rd-person plural animate; a `{{type}}` |
| g3PAUINAN | 3.PAU.INAN | 3rd-person paucal inanimate; a `{{type}}` |
| g3pINAN | 3p.INAN | 3rd-person plural inanimate; a `{{type}}` |
| gGER | GER | gerund; a `{{type}}` |

| Key | English Translation | Description (if needed) |
| --- | --- | --- |
| changeTo | change {{from}} to {{to}} | Description of a Transformation in the "Complex" preset; the Transformation will change `{{from}}` into `{{to}}`; the `{{from}}` portion will be very descriptive and often complex, while the `{{to}}` portion will usually be very simple |
| tripleVowels | triple vowels | a `{{from}}` |
| doubleDipthongs | double-dipthongs | a `{{from}}` |
| nonWIVowelIPairs | certain non-word-initial vowel-i pairs | a `{{from}}` |
| nPlosive | n-plosive | n followed by a plosive consonant; a `{{from}}` |
| mPlosive | m-plosive | m followed by a plosive consonant; a `{{from}}` |
| retroNPlosive | retroflex n-plosive | retroflex n followed by a plosive consonant; a `{{from}}` |
| pNasal | p-nasal | p followed by a nasal consonant; a `{{from}}` |
| tNasal | t-nasal | t followed by a nasal consonant; a `{{from}}` |
| nasalPostRetroT | nasal after retoflex t | a `{{from}}` |
| pFricative | p-fricative | p followed by a fricative consonant; a `{{from}}` |
| tFricative | t-fricative | t followed by a fricative consonant; a `{{from}}` |
| postRetroTFric | post-retroflex t fricative | a fricative consonant after a retroflex T; a `{{from}}` |
| kFricative | k-fricative | k followed by a fricative consonant; a `{{from}}` |
| fFricative | f-fricative | f followed by a fricative consonant; a `{{from}}` |
| sFricative | s-fricative | s followed by a fricative consonant; a `{{from}}` |
| postRetroSFric | post-retroflex s fricative | a fricative consonant after a retroflex S; a `{{from}}` |
| hFricative | h-fricative | h followed by a fricative consonant; a `{{from}}` |
| ft | ft | a `{{from}}` |
| retroST | retroflex s-t | retroflex s followed by a t; a `{{from}}` |
| nonInitHNotPreG | non-initial h not preceded by a g | a `{{from}}` |
| WVowel | W-vowel | W followed by a vowel; a `{{from}}` |
| remWs | remaining Ws | any Ws that still remain after the previous transformations have been made; a `{{from}}` |
| vowelCh | vowel-ch | vowel followed by ch; a `{{from}}` |
| bWithConditions | B after a vowel and at word-end or before a non-vowel | a `{{from}}` |
| vowelB | vowel-B | vowel followed by a b; a `{{from}}` |
| wordFinalOOrAu | word-final o or au | a `{{from}}` |
| wordFinalOuOrEi | word-final ou or ei | a `{{from}}` |
| wordFinalQu | qu at word-end | a `{{from}}` |
| wordFinalC | word-final c | a `{{from}}` |
| doubleAIU | double a/i/u | aa, ii, or uu; a `{{from}}` |
| wordFinalMkOrMt | word-final mk or mt | a `{{from}}` |
| wordFinalNkOrNp | word-final nk or np | a `{{from}}` |
| ngkNgt | ngk and ngt | a `{{from}}` |
| doubleVowels | double vowels | a `{{to}}` |
| singleDipthongs | single dipthongs | a `{{to}}` |
| dipthong | dipthong | a `{{to}}` |
| dipthongs | dipthongs | a `{{to}}` |
| nt | nt | a `{{to}}` |
| mp | mp | a `{{to}}` |
| retroNRetroPlosive | retroflex n-retroflex plosive | retroflex n followed by retroflex plosive consonant; a `{{to}}` |
| pm | pm | a `{{to}}` |
| tn | tn | a `{{to}}` |
| retroN | retroflex n | a `{{to}}` |
| pf | pf | a `{{to}}` |
| ts | ts | a `{{to}}` |
| retroS | retroflex s | a `{{to}}` |
| kh | kh | a `{{to}}` |
| fp | fp | a `{{to}}` |
| st | st | a `{{to}}` |
| retroT | retroflex t | a `{{to}}` |
| hk | hk | a `{{to}}` |
| retroSRetroT | retroflex s-retroflex t | retroflex s followed by a retroflex t; a `{{to}}` |
| k | k | a `{{to}}` |
| whVowel | wh-vowel | wh followed by a vowel; a `{{to}}` |
| w | w | a `{{to}}` |
| vowelTch | vowel-tch | vowel followed by tch; a `{{to}}` |
| vowelBle | vowel-ble | vowel followed by ble; a `{{to}}` |
| vowelBl | vowel-bl | vowel followed by bl; a `{{to}}` |
| ow | ow | a `{{to}}` |
| oughEigh | ough or eigh | a `{{to}}` |
| que | que | a `{{to}}` |
| ck | ck | a `{{to}}` |
| singleAIU | single a/i/u | a single a, i, or u (started as aa, ii or uu); a `{{to}}` |
| nk | nk | a `{{to}}` |

| Key | English Translation | Description (if needed) |
| --- | --- | --- |
| deRetro | de-retroflex {{char}} after {{what}} | Description of a Transformation in the "Complex" preset; Changes a retroflex character `{{char}}` into a non-retroflex version, but only if it comes after `{{what}}` |
| deRetroBefore | de-retroflex {{one}} before retroflex {{two}} | Description of a Transformation in the "Complex" preset; Changes a retroflex character `{{one}}` into a non-retroflex version, but only if it comes before `{{two}}` |
| markRetro | mark retroflex {{char}} | Description of a Transformation in the "Complex" preset; Substitutes a capital letter `{{char}}` (e.g. `T`) with its retroflex version (e.g. `ʈ`) |
| aDipthong | a dipthong | used as `{{what}}` |
| s | s | can be used as `{{one}}`, `{{two}}`, `{{what}}`, or `{{char}}` |
| t | t | can be used as `{{one}}`, `{{two}}`, or `{{char}}` |
| n | n | can be used as `{{one}}`, `{{two}}`, or `{{char}}` |
| l | l | can be used as `{{one}}`, `{{two}}`, or `{{char}}` |
| nix | eliminate {{what}} | Description of a Transformation in the "Complex" preset; deletes `{{what}}` |
| thirdVowel | third vowel in a row | a `{{what}}` for `nix` |
| dipthongI | dipthong before i | a `{{what}}` for `nix` |
| plosiveR | plosive before an r | a `{{what}}` for `nix` |
| kNasal | nasal after k | a `{{what}}` for `nix` |
| retroConsNonRetroCons | non-retroflex consonant after retroflex consonants | a `{{what}}` for `nix` |
| nonRetroConsRetroCons | retroflex consonant after non-retroflex consonant | a `{{what}}` for `nix` |
| otherHs | all other h | a `{{what}}` for `nix` |
| otherBs | remaining Bs | a `{{what}}` for `nix` |
| dupeYs | duplicate ys | a `{{what}}` for `nix` |
| qTripVowels | triple+ vowels after q | a `{{what}}` for `nix` |

| Key | English Translation | Description (if needed) |
| --- | --- | --- |
| reduceMultiHsToH | reduce multiple h to single | Description of a Transformation in the "Complex" preset; e.g. hhhhh -> h |
| reduceDoubleConsToCon | reduce double consonants to one | Description of a Transformation in the "Complex" preset; e.g. cc -> c, dd-> d |
| reduceKhToK | reduce kh to k | Description of a Transformation in the "Complex" preset; kh -> k |
| saveHBeforeStress | save h before stressed syllable | Description of a Transformation in the "Complex" preset |
| saveWIH | save word-initial h | Description of a Transformation in the "Complex" preset |
| saveWFH | save word-final h | Description of a Transformation in the "Complex" preset |
| restoreSavedH | restore saved h | Description of a Transformation in the "Complex" preset; previously, h was "saved" as H, and now H becomes h again. |
| iBeforeE | i before e except after c | Description of a Transformation in the Pseudo-English preset; refers to a common "rule" of English spelling |
| reduceTlClusterAfterCon | reduce tl cluster to t after non-vowel | Description of a Transformation in the Pseudo-English preset |
| reduceTlClusterBeforeConOrEnd | reduce tl cluster to t before consonant or word-end | Description of a Transformation in the Pseudo-English preset |
| reduceTripleToTwo | reduce triple-letter clusters to two | Description of a Transformation in the Pseudo-English preset |
| reduceMultiVowelsToMatching | reduce multiple vowels in a row, where any two vowels match, to the matching vowels | Description of a Transformation in the Pseudo-English preset |
| qFollowedByU | q is always followed by u | Description of a Transformation in the Pseudo-English preset |
| replaceForbiddenSyll | replace forbidden syllable | Description of a Transformation in the Pseudo-Japanese preset; some syllables *could* be possible, but are never actually used in Japanese |
| removeDupeChars | remove duplicate characters | Description of a Transformation in the Pseudo-Japanese preset |
| reduceTripPlusVowelsToTwo | reduce 3+ vowels in a row down to just 2 | Description of a Transformation in the Pseudo-Japanese preset |

### info

The `info` key has multiple subkeys. Most are arrays of strings in Markdown format.

This information is presented in help screens on the main WG subpages, as well as the WordGen Overview page.

#### info.charGroupExample

This is a block of text representing a set of Character Groups. It can be used in the next key and the `syllablesStartIsOverview` key.

```javascript
[
  "I=pbk",
  "L=lr",
  "C=pbklr",
  "V=eioau"
]
```

#### info.charGroups

Put `` `example` `` in backticks to insert `info.charGroupExample` as a block.

Putting `` `anything else` `` inside backticks will display "anything else" as visually emphasized text, indicating it is in International Phonetic Alphabet (IPA) format.

```javascript
[
  "This is where you define groups of sounds. The two simplest groupings are _consonants_ and _vowels_, but you may want to create multiple character groups depending on how you want your language's syllables formed. For example, the consonants `pbk` in English may be followed by the consonants `lr` at the beginning of syllables. So you might choose them as character groups, while also putting `pbklr` in a third character group for general consonants.",
  "",
  "Click the (+) button to add a new character group. When you make a character group, you must give it a _description_ and a one-character _label_. The label can be any single character except for these: **^$\\()[]{}.*+?|**. The description is for your own benefit, while the label will be used to refer to this character group in the **Syllables** tab. So you may end up with character groups that look like the following:",
  "",
  "`example`",
  "",
  "The letters/characters in your character group are called a _run_. The run should be put in a specific order. The first letter is more likely to be used than the second, the second more likely than the third, and so on. This is designed to mimic natural languages, which tend to use certain sounds more than others. You can adjust this _dropoff rate_, or eliminate it entirely, on the **$t(common:Settings)** tab."
]
```

#### info.charGroupsIsOverview

This section is only printed on the Overview page, not the Character Group help page.

```javascript
[
  "**Character group run dropoff** is explained in the **$t(common:Settings)** section below."
],
```

#### info.charGroupsNotOverview

This section is printed on the Character Group help page, not the Overview page.

```javascript
[
  "**Character group run dropoff** ranges from 0 to 50. At zero (flat), character group choices are all equiprobable. Otherwise, the higher the number, the more likely it is that the first characters in the character group are used. See the help section on the **$t(common:Settings)** page for more information."
],
```

#### info.syllablesStart

This section begins the Syllables section in the Syllables help page, but is **not** shown on the Overview page.

Put `` `charGroup example` `` in backticks to insert `info.charGroupExample` as a block.

Putting anything else inside backticks will be ignored and not display.

```javascript
[
  "This is where you determine how your syllables are formed. You use the _labels_ to describe the elements that make up a syllable.",
  "",
  "For example, using the character groups in the previous section, you could decide to make a list of syllables that looks like this:",
  "",
  "`charGroup example`",
  "",
  "...you could decide to make a list of syllables such as the following:"
],
```

#### info.syllablesStartIsOverview

This section is the beginning of the Syllables help page, but is only shown on the Overview page.

```javascript
[
  "This is where you determine how your syllables are formed. You use the _labels_ to describe the elements that make up a syllable. For example, using the character groups in the previous section, you could decide to make a list of syllables such as the following:"
],
```

#### info.syllablesExample

This is an array of strings representing a set of Syllables. It is presented between the beginning of the Syllables section (either `syllablesStart` or `syllablesStartIsOverview`) and the `syllables` key below.

```javascript
[
  "ILV",
  "CV",
  "ILVC"
],
```

#### info.syllables

This is the main block of text for the Syllables section in both Overview and the Syllables help page.

```javascript
[
  "The above can generate syllables such as _pla_, _ku_, or _brep_, which could then be combined into words such as _plabrep_ or _kupla_. You can also put characters in a syllable that don't correspond to a character group: **sILV** could generate syllables such as _sbra_ or _spli_.",
  "",
  "If you desire a greater amount of control over your words, you can turn on the **Use multiple syllable types** toggle. This will show you four separate boxes, each with a different role in a word: **single-word syllables** are used exclusively for one-syllable words, **word-initial syllables** are only used at the start of a word, **word-final syllables** are only used at the end of a word, and **mid-word syllables** fill out the middle of words when needed.",
  "",
  "The order of syllables in each box makes a difference. The first syllable listed is more likely to be used than the second, the second more likely than the third, and so on. You can adjust this _dropoff rate_, or eliminate it entirely, on the **$t(common:Settings)** tab. You'll also find options there to determine how often one-syllable words are generated, and put an upper limit on the number of syllables any one word can have."
],
```

#### info.syllablesEndIsOverview

This section ends the Syllables section in the Overview, and is not shown on the Syllables help page.

```javascript
[
  "The **Syllable box dropoff** is explained in the **$t(common:Settings)** section below."
],
```

#### info.syllablesEnd

This section is the end of the Syllables help page, and not shown on the Overview page.

```javascript
[
  "The **Syllable box dropoff** ranges from 0 to 50. At zero (flat), syllable choices are all equiprobable. Otherwise, the higher the number, the more likely it is that the first lines in the box are used. See the help section on the **$t(common:Settings)** page for more information."
],
```

#### info.transBlocks

This object uses `BlockFormat` objects, as described in [WordEvolve's info.soundChangesBlocks](#infosoundchangesblocks)

Insert a formatted block into the text with `` `nameOfBlock` `` inside backticks.

```javascript
{
  block1: {
    serif: true,
    arrow: "->",
    simple: ["C", "->", "ch"]
  },
  block2: {
    serif: true,
    important: "!",
    unimportant: "$",
    complex: [
      "RtL: !s(?=.*ʃ)!$->$!ʃ!  ",
      "LtR: !(ʃ.+)s!$->$!$1ʃ!"
    ]
  },
  block3: {
    serif: true,
    important: "!",
    unimportant: "$",
    complex: [
      "!r(.+)r!$->$!r$1l!  ",
      "!l(.+)l!$->$!l$1!"
    ]
  },
  block4: {
    serif: true,
    simple: ["r([aeiou]r)", "->", "rd$1"]
  },
  block5: {
    serif: true,
    simple: ["[kp]t+", "->", "tt"]
  }
}
```

#### info.trans

This section describes the Transformations tool inside the Overview and the Transformations help page.

Use `` `DRAG HANDLE` `` inside of backticks to insert the drag handle icon into the text.

```javascript
[
  "There may be cases when you need to fine-tune the words that get generated on the **Output Tab**. A common reason would be to turn a specific character into two or three letters. You may create a group such as **C=pbkClrS**, using capital letters in place of sounds like _\"ch\"_ or _\"sh\"_. This could generate syllables like _Cu_ or _pliS_.",
  "",
  "When you make a new _transformation_, you provide a _$t(wgwe:searchExpression)_, a _$t(wgwe:replacementExpression)_, and, optionally, a _transformation description_ for your own benefit.",
  "",
  "Both expressions can use **regular expressions** (an explanation can be found at the end of this section). You can also use the special expression %X to indicate any character in group X's run, or !%X to indicate any character _not_ in that run. (e.g, If _X=abc_, then %X will be treated as if it was the regular expression _[abc]_.)",
  "",
  "So, you could make a $t(wgwe:searchExpression) **C** with a $t(wgwe:replacementExpression) **ch**, which will result in _Cu_ above becoming _chu_. This will result in a transformation that looks like the following:",
  "",
  "`block1`",
  "",
  "Click the (+) button to add a new transformation. The first transformation in the list will be run first, the second transformation second, and so on down the list. This may cause unintended effects as previous transformations mutate the original word, so you can reorganize your transformations by using the `DRAG HANDLE` drag handles.",
  "",
  "---",
  "",
  "Here are some sample transformations for some linguistic phenomina:",
  "- Consonant harmony: `block2`",
  "- Liquid dissimilation: `block3`",
  "- Synchronic epenthesis: `block4`",
  "- Anticipatory assimilation: `block5`"
]
```

#### info.outputMain

This section describes the "Main" part of the Output page. It's used in the Overview and Output help page.

```javascript
[
  "This is where the magic happens. Click the **Generate** button and your output will appear. Press the button again and a new set of output will replace it."
]
```

#### info.outputSettings

This section describes the "Settings" part of the Output page, which can be found by tapping on the Gear icon. It's used in the Overview and Output help page.

```javascript
[
  "Click on the gear icon to open a list of options. The first is a drop-down menu where you can select what to output. The choices are **Pseudo-text**, **Wordlist** and **All possible syllables**.",
  "",
  "The **Pseudo-text** will create words and put them into sentences, making a block of text you might find in a book. You can determine how many sentences are made by adjusting the **Number of sentences** slider.",
  "",
  "The **Wordlist** outputs a list of words devoid of context. You can choose a number of options to modify this list. **Capitalize words** will capitalize every word. **Sort output** will alphabetize the list, and **Multi-column layout** will arrange the list in multiple columns instead of one long column. At the bottom, there is a **Wordlist size** slider that controls how many words are generated.",
  "",
  "**All possible syllables**, as you might guess, outputs a list of every possible syllable your character groups, syllables and transformations allow. The _Capitalize words_, _Sort output_ and _Multi-column layout_ options above will also work on this syllable list.",
  "",
  "At the top of the settings, you can choose to **Show syllable breaks**, which will in·sert a dot be·tween eve·ry syl·la·ble in each word. While this option can be useful, please note that it will break any _transformations_ that try to work across syllable boundaries."
]
```

#### info.outputLexicon

This section describes the exporting-to-Lexicon part of the Output page. It's used in the Overview and Output help page.

```javascript
[
  "Once you've generated words, you can save them to the **$t(common:Lexicon)**. Click the book button and the generated words will light up. Tap on words you wish to save. When you've selected all the words you want, tap the book button again and you'll be given a pop-up where you can choose which **$t(common:Lexicon)** column to import them into."
]
```

#### info.settings

This section describes the Settings page. It's used in the Overview and Output help page.

```javascript
[
  "This final tab fine-tunes the output. These can make a huge difference in how your conlang appears.",
  "",
  "## The Buttons",
  "",
  "**Load Preset** brings up a menu where you can choose from several pre-loaded options. The initial settings when you first start the app are the _Simple_ preset. The others are offered to give you ideas of what's possible with the app. They will load _character groups_, _syllables_, _transformations_ and possibly change the remaining settings on this page, too.",
  "",
  "**Save/Load Custom Info** opens a dialog where you can save your own _character groups_, _syllables_, _transformations_ and the settings on this page. This allows you to switch between your own personal language settings.",
  "",
  "## The Settings",
  "",
  "**Rate of monosyllable words** determines how often a one-syllable word is created. It's a percentage from 0 (never) to 100 (always).",
  "",
  "**Maximum number of syllables per word** sets an upper limit on how long your words can grow.",
  "",
  "**Character group run dropoff** and **Syllable box dropoff** range from 0 to 50. At zero (flat), group and syllable choices are all equiprobable. Otherwise, the number becomes a percentage. The higher the number, the more likely it is that the first syllables or group characters are used. (This mimics natural languages, which tend to prefer certain sounds and patterns.) This is how it works:",
  "",
  "1. A random number is generated from 1 to 100.",
  "2. If the number is lower than the dropoff percentage, the first choice is picked.",
  "3. If not, the generator moves the first choice to the end of the line, then returns to step 1, generating a new number.",
  "4. This cycle continues until a number is generated that is equal to or greater than the dropoff percentage.",
  "",
  "The remaining options only apply to _Pseudo-texts_.",
  "",
  "**Capitalize sentences** determines if each sentence starts with a capital letter.",
  "",
  "The other options determine what your sentences look like. Three-fourths of all sentences will be _declarative_ (simple statements), one-sixth will be _interrogative_ (questions), and the remaining one-twelfth will be _exclamatory_ (excited utterances). You can put special punctuation before and after these sentences if you wish."
]
```

#### info.overview

This section is only used in the Overview. It displays at the top of the page before any of the tool sections.

Second-level numeric lists, like the "Sounds can be grouped like this:" sublist, will display as lowercase Roman numerals. That is why number 3 in the main list refers to (i), (iv), and the like.

```javascript
[
  "This tool is for attempting to generate new words based on rules you set up.",
  "",
  "WordGen makes two assumptions. First, that he basic unit of a \"word\" is a syllable, and second, that a \"syllable\" can be described as a combination of sounds that are spoken together.",
  "",
  "This is the most basic use case:",
  "",
  "1. Choose what sounds your language will have, and the characters (letters) that will represent these sounds.",
  "2. Separate these characters into groups, such as vowels and consonants.",
  "3. Decide the structure(s) of the syllables these sounds form.",
  "",
  "For example, a (very rough) approximation of Japanese might be:",
  "",
  "1. Uses the sounds k, g, s, z, t, d, n, h, b, p, m, y, r, w, a, i, u, e, and o.",
  "2. Sounds can be grouped like this:",
  "    1. k, g, s, z, t, d, n, h, b, p, m, r",
  "    2. a, i, u, e, o",
  "    3. y",
  "    4. a, u, o",
  "    5. w",
  "    6. a, o",
  "    7. n",
  "3. Syllables can be made from (i)+(ii), (iii)+(iv), (v)+(vi), (ii) by itself, and (vii) by itself.",
  "",
  "With that information, you can proceed into the rest of this tool:",
  "",
  "The **Character Groups** tab is for holding groups of sounds, and the **Syllables** tab describes how they fit together. For more complex words, the **Transformations** tab provides a way to tweak the generated output with search expressions and replacement expressions. The **Output Tab** is where the new words can be found, and the **$t(common:Settings)** tab has other options you can tweak if needed.",
  "",
  "Be sure to check out the _Presets_ over on the Settings tab. The \"Pseudo-Japanese\" preset shows one way to put the above info to use."
]
```

---

## CHECKLIST

If you have a working app with the translation loaded, you can follow these steps to ensure all messages are appearing correctly.

1. Settings
    - Attempt to use the Back Button to exit the app
        - Verify messaging (if any)
    - Get to the Settings page via the Menu
    - Tap on Change Theme, verify all theme names
    - Tap on Export App Info
        - Make sure all toggles are on
        - Copy to clipboard, make sure toast message is correct
    - Go to Import App Info
        - Paste in data from clipboard
            - **If you are working with a non-clean version of the app, save this data elsewhere so you can restore your app state when you are done.**
        - Tap on Analyze
        - Tap on Import, verify the warning messsage
        - Tap Yes, verify the toast message is correct
        - Repeat the process, but only import Stored WordGen Info
            - Verify messaging
        - Repeat the process again, importing Stored WordGen and Stored WordEvolve Info
            - Verify messaging
        - Repeat the process again, selecting only two non-Stored options
            - Verify messaging
    - Go to Sort Settings
        - Verify "WG Presets Sorter" is present
            - Swipe left on WG Presets Sorter and Tap Delete
            - Verify the error message
        - Tap on Sort Sensitivity, verify all four options
        - Tap on New Custom Sort
            1. Attempt to save the blank sort: should say there is no title
            1. Add a title
            1. Attempt to save the sort again: should say there is no information
            1. Toggle the alternate alphabet
                - Tap on Alphabet separator and verify all five options
            1. Attempt to save: should say the alphabet is blank
            1. Tap on Add Relation
                1. Tap on Pre/Post separator and verify all five options
                2. Attempt to save: should give a message saying there is no base character
                3. Add a base character
                4. Attempt to save again: should say you must provide pre or post characters
                5. Add a pre or post character
                6. Save the relation, verify the toast message is correct
            1. Swipe left on the relation, tap the edit button
                - Verify the title of the page, then tap Save and verify the message is correct
            1. Swipe left on the relation, tap the delete button, verify the message is correct
            1. Tap on Add Equality
                1. Add a base character
                2. Attempt to save: should say you must provide "equal" characters
                3. Add an equal character
                4. Save the equality, verify the toast message is correct
            1. Swipe left on the Equality, tap the edit button
                - Verify the title of the page, then tap Save and verify the message is correct
            1. Swipe left on the Equality, tap the delete button, verify the message is correct
            1. Save the Custom Sort, verify the message is correct
            1. Swipe left on the Custom Sort, tap the edit button
                - Verify the title of the page, then tap Save and verify the message is correct
            1. Swipe left on the Custom Sort, tap the delete button, verify the message is correct
2. Morphosyntax
    - **Note:** be sure to notice the "Loading" page when you open MorphoSyntax
        - If you miss it this time, remember to look for it when you move to a new tool
        - The message can be very brief, but it tends to remain longer when you load new tools
    - Go through each page, starting with the Overview, then going through pages 1-10
        - Hit every information button on every page, making sure the info text matches the section it's linked in
    - On the Settings page (Gear icon), hit the Clear Info button to see the popup
    - Tap Load, verify the "no saved docs" message
    - Tap Save, verify the "no title" message
    - Add a title and description, tap Save again, verify save message
    - Tap on Save New, verify save message
    - Tap on Load, tap on a saved document, verify warning message
    - Tap on Delete, tap on a saved document, verify warning message
        - Confirm, verify the toast message
    - Go to page 1
        - Move **every** slider
        - Check at least one checkbox
        - Add text to at least one box
    - Go to page 2 and check at least one checkbox under *2.2.2. Verb Classes*
    - Go to page 3, choose all three options under *3.4. Adpositional Phrases*
    - Go to Settings, tap on Export
        - Leave "Show Unused Sections" on
        - Export three times, once as Text File (plain), once as a Text File (markdown), and finally as a Word Document (docx)
            - Verify each toast message
        - Leave the app and verify the three exports
            - Check the sliders, checkboxes and text boxes you modified
            - Check the other checkboxes that were not modified and text boxes not filled
3. WordGen
    1. Check the overview, verify all text
    2. Go to Character Groups
        - Tap on Help button, verify all text
        - Tap on the Add button
        - Attempt to save, verify the error message
        - Tap the Suggest button, verify the error message
        - Add title, label and characters, then tap Add Character Group
        - Save another character group
            - Use the same Label as the previous Character Group, Tap Save, verify error message
            - Use a question mark as Label, Tap Save, verify error message
            - Finish saving the group correctly
        - Swipe left and Tap Edit
            - Verify the title
            - Tap the Delete button, verify the messaging
            - Close modal
        - Swipe left and Tap Delete
            - Verify the text
            - Tap Yes, verify the toast message
        - Tap the Clear Everything button
            - Verify the text
            - Tap Yes, verify the toast message
    3. Go to Syllables
        - Tap on Help button, verify all text
        - Toggle the multiple syllable types **on**
        - Edit the main syllables box only
        - Tap the Clear Everything button
            - Verify the text
            - Tap Yes, verify the toast message
        - Add main syllables again
    4. Go to Transformations
        - Tap on Add button
        - Attempt to save, verify the error message
        - Add a search expression
        - Save two Transformations
        - Swipe left and Tap Edit
            - Verify the title
            - Tap the Delete button, verify the messaging
            - Close modal
        - Swipe left and Tap Delete
            - Verify the text
            - Tap Yes, verify the toast message
        - Tap the Clear Everything button
            - Verify the text
            - Tap Yes, verify the toast message
    5. Go to Output
        - Tap Generate, verify error message
        - Tap Copy button, verify error message
        - Tap the Gear icon
            - Verify text
            - Change to Wordlist, verify new text that appears
    6. Go to Settings
        - Tap Save/Load info
            - Verify title, "no saved info" message
            - Add a title, tap Save, verify toast message
            - Tap Load/Save again
                - Tap "Load" next to the saved info
                    - Verify warning
                    - Tap Yes, verify toast message
            - Tap Load/Save again
                - Tap Delete button
                - Confirm, verify toast message
            - Close Modal
        - Tap "Load Preset"
            - Verify all names
            - Tap on Simple
                - Verify warning message
                - Confirm, and verify toast message
                - Go back to Character Groups, verify titles of all groups
            - Return to Settings, Load the Medium preset
                - Go back to Character Groups, verify titles of all groups
            - Return to Settings, Load the Complex preset
                - Go back to Character Groups, verify titles of all groups
                - Go to Transformations, verify descriptions of all transforms
            - Return to Settings, Load the Pseudo-Latin preset
                - Go back to Character Groups, verify titles of all groups
            - Return to Settings, Load the Pseudo-Chinese preset
                - Go back to Character Groups, verify titles of all groups
            - Return to Settings, Load the Pseudo-English preset
                - Go back to Character Groups, verify titles of all groups
                - Go to Transformations, verify descriptions of all transforms
            - Return to Settings, Load the Pseudo-Japanese preset
                - Go to Transformations, verify descriptions of all transforms
    7. Go back to Output
        - Tap "Generate"
        - Tap Copy button, verify toast message
        - Tap the Lexicon button, verify toast message
            - Tap any number of words
            - Tap the Save icon
                - Verify messaging
    8. Generate the `unableToCreateXWords` message
        - Make a Character Group with no more than five characters
            - e.g. *C=tkp*
        - Add one or two Syllables using that Character Group
            - e.g. *C* and *Co*
        - Go to the Settings page, set *Rate of monosyllable words* to *Always*
        - Go to the Output page, tap on the Gear icon
            - Set the option to generate a wordlist
            - Set the 'number of words' slider to *1000*
        - Tap Generate
            - If a list is generated successfully, delete characters or syllables and a
4. WordEvolve
    1. Start with Overview
    2. Go to Input
        - Add a few words
        - Tap the Clear button
            - Verify warning message
        - Add a few words again
    3. Go to Character Groups
        - Tap on the Import button
            - Confirm, verify the toast message
        - Tap on the Clear All button
            - Confirm, verify the toast message
    4. Go to Transformations
        - Tap the Add button, verify the Direction options
    5. Go to Sound Changes
        - Tap the Add button
        - Tap Save, verify error messages
        - Add a search expression and a context expression
        - Tap Save, verify toast message
        - Swipe left on the Change
            - Verify the title
            - Tap the Delete button, verify the messaging
            - Close modal
        - Swipe left and Tap Delete
            - Verify the text
            - Tap Yes, verify the toast message
        - Tap the Clear Everything button
            - Verify the text
            - Tap Yes, verify the toast message
        - Attempt to create error messages
            - Create a Sound Change with the following problems:
                - No underscore in context and exception
                - Multiple underscores in context and exception
                - Word-boundary in the middle of a word in context and exception
    6. Go to Output
        - Tap on the Gear icon
            - Verify all text, close modal
        - Tap Copy, verify the error message
        - Tap Evolve, verify the error message
        - Tap Load Preset
            - Tap on Dahl's Law
            - Tap Yes, and verify the toast message
            - Go to Character Groups and verify titles/descriptions of the groups
        - Tap Load Preset
            - Tap on Ingvaeonic Nasal Spirant Law, then Yes
            - Go to Character Groups and verify titles/descriptions of the groups
    7. Go back to **WordGen** and tap on Character Groups
        - Tap on the Import button
            - Confirm, verify the toast message
5. Extra Characters
    1. Tap on the Extra Characters icon in WG/Syllables
    2. Tap on Copy icon, verify toast
        - Tap on any character, verify toast
    3. Tap on Copy again, verify toast
    4. Tap twice on the Favorites icon, verifying the toasts
    5. Tap on the Character Name icon
        - Go through each Display set and verify all characters and character names
    6. Tap the help icon, verify new text
6. Declenjugator
    1. Visit Overview
    2. Go to Input
        - Add a couple of words
        - Tap the Clear button
            - Verify warning message
        - Add a couple of words again
    3. Go to Groups
        - Tap Add
            - Tap Save, verify error message
            - Tap on Type, verify all three types are present
            - Type in a title, tap Save, verify error message
            - Type some text into the "Type(s) this applies to" text box
            - Tap Use Advanced Method
                - Tap save, verify error message
                - Put a Question Mark by itself in the Match Expression
                - Put anything in the Replacement
                - Hit Save, verify error message
            - Toggle Use Advanced Method off
            - Type something into either text box
            - Tap "Separate Multiple Conditions With" and verify all four options
            - Tap "Add New" at the bottom
                - Tap Save, verify error message
                - Tap on the (+) button
                    - Verify all messaging
                    - Be sure to tap on all Show More buttons
                    - Tap Save, verify error message
                    - Tap (+) again, tap on a word, tap Save again, verify success message
                - Tap on Use Advanced Method, verify alternate messaging
                - Tap Save, verify error message
                - Toggle off Use Advanced Method
                - Tap Save, verify save message
            - Swipe left on the new Declension, Tap Edit
                - Verify the title
                - Tap the Delete button, verify the messaging
                - Close modal
            - Swipe left and Tap Delete
                - Verify the text
                - Tap Yes, verify the toast message
            - Change Type to a different type
                - Use "Add New" to create a new subgroup
                - Swipe left and delete it
                - Verify that the saving and deleting messaging has changed
            - Change to the third Type and repeat the above process
            - Tap Save
        - Tap on the Save icon in the title bar
            - Save as a new Custom Info
            - Attempt to save again using the same name
                - Verify error message
                - Tap on Yes, Overwrite It
                    - Verify toast message
        - Swipe left on the new Group and Tap Edit
            - Verify the title
            - Tap the Delete button, verify the messaging
            - Close modal
        - Swipe left and Tap Delete
            - Verify the text
            - Tap Yes, verify the toast message
        - Add another new Group
        - Tap the Clear Everything button
            - Verify the text
            - Tap Yes, verify the toast message
        - Go back to the Groups tab
            - Add at least three Groups
                - One should be Declensions, one Conjugations, and the last Other
    4. Go to Output
        - Tap Display as, verify all three modes
        - Tap on Groups, verify text, uncheck all Groups
        - Tap Generate, verify error message
        - Toggle Use Input, verify the new options that appear
        - Toggle Show Unmatched Words
        - Make sure Show Group Info and Show Examples are toggled
        - Tap on Groups, select all Groups
        - Tap on Generate
            - Verify all generated text
                - If all three Groups and Unmatched Words haven't appeared, adjust the Input words until they all show up
            - Tap Copy to Clipboard button, verify message
        - Tap on Export, verify text and all three options
            - If only two options appear, Tap Display As and change it to a Chart, then Tap on Export again
            - Export as `docx`, verify the document's metadata
7. Lexicon
    1. Verify main text
    1. Tap Help button, verify text
    1. Tap (+) button, verify error message
    1. Add at least one item into the Lexicon
        - Swipe left on the item, tap Edit
            - Verify text
            - Tap Delete, verify message, cancel
            - Change anything, then Tap on the (x)
                - Verify error message
            - Tap Save, verify toast message
        - Swipe left on the item, tap Delete
            - Verify text,
            - Tap Yes
    1. Tap Save button, verify "Please wait" and modal text
        - Tap "Save", verify error message (no title)
        - Tap "Export", verify error message (no title)
        - Tap "Load", verify the no-lexicons-saved message
    1. Tap on the "Sort" button
        - Verify all text, close modal
    1. Add a title, Tap Save button again
        - Tap "Export", verify error message (no items)
        - Tap "Save", verify toast message
        - Tap "Save as New", verify toast message
        - Tap "Clear", verify text, Tap Yes, verify toast message
            - Verify all three default column labels
        - Tap "Load", choose a saved Lex, verify toast message
        - Tap "Delete", choose a saved Lex, confirm, verify toast message
    1. Tap the Tools button, then Tap on the Add button
        - Verify all text
        - Finish adding an item to the Lexicon
        - Tap Tools again, Tap on the Trash button, verify toast messages
            - Select an item
            - Tap the final Delete button, verify popup
            - Confirm, verify toast message
    1. Tap Save button again
        - Tap "Export", verify all text
    1. Tap the Gear icon
        - Tap on "Sort blank columns", verify all four options
        - Tap "Add Column"
            - Verify toast message
            - Verify the default column name
        - Tap Delete button on a column, verify text
        - Delete all columns
            - Verify error message when trying to delete the last column
        - Cancel the modal
    1. Add item(s) until there are at least two Lexicon items
        - Swipe right on two or more items and tap the Link buttons underneath
        - Tap the Link button
        - Verify all text
        - Tap on a column under "How to Merge", verify all seven options
        - Save or Cancel
    1. Ensure there are items in the Lexicon, and that ALL items are BLANK in at least one column
    1. Go to WordEvolve (or Declenjugator), Input tab
        - Tap on Import From Lexicon, verify all text
        - Tap on Import without selecting a column, verify toast message
        - Select a BLANK column, Tap Import, verify toast message
        - Select a filled column, Tap Import, verify toast message
        - Create conditions ("column contains" **and** "column matches")
            - Verify how they appear on screen when done
8. Concepts
    1. Verify Display buttons
    1. Tap the help icon, verify all text
    1. Tap on all Display buttons
        - Verify ALL words on screen
    1. Tap the Lexicon button
        - Verify toast message and button texts
        - Tap on at least one word
        - Tap on Save Selected Meanings
            - Verify dialog text
            - Tap Save, verify toast message
    1. Tap the Link button
        - Verify the toast message
        - Verify "Current Combination" text
        - Select at least two words
        - Tap the Link Button again, verify the messages, Cancel
        - Tap Save, verify toast message
    1. Tap the Unlink button
        - Verify toast message
        - Tap on the combination you created
        - Tap Unlink again
            - Verify dialog text
9. App Info
    1. Verify all text
    2. Tap on Get Error Logs, verify the text
        - Tap on Clear Logs, verify text
    3. Tap on Show Older Changes
        - Verify the new "Hide Other Changes" button
        - Verify all new text

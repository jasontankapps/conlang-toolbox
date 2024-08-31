# MorphoSyntax

This is where you'll find the jargon-heavy explanation of
linguistics that is the essence of MorphoSyntax. **Please be sure
to use the proper linguistic terms of your localization!**

## Section Headers

Header keys start with numbers and dashes. The value should be
plain text, no Markdown.

```javascript
"1-2-Name of Header": "1.2. Name of Header"
```

## Range Sliders

Keys for ranges come in groups of six: two main keys, each with two
contexts. The first set of three represents one end of a range slider,
and the second set represents the other end.

```javascript
Key: "Screen Label",
Key_percentage: "{{number}}% Label",
Key_percentageMarkdown: "**{{number}}%** Label",
```

The screen label should be kept *very* short.

The `_percentage` context is used in `docx` and `text` exports only.

The `_percentageMarkdown` context is used in `Markdown text` exports,
and may use Markdown formatting.

## Text Input

Keys that begin with `text` are prompts that appear before open text
boxes the user can write in.

## Information Pop-Ups

Keys that begin with `title`, `label` and `info` are linked. They are
used to create the information pop-ups that appear throughout
MorphoSyntax.

Keys that begin with `title` will be used as the header of the
pop-up.

Keys that begin with `label` will be used as the text of the buttons
that launch the pop-ups. These keys are **OPTIONAL**: If a `title` and
`info` are missing a corresponding `label` key, then the button will
use the text provided in the `genericInfoButtonText` key.

Keys that begin with `label` do not need be translated word-for-word. You
can change them to whatever you think works best for your localization,
or omit them entirely. *(Many of the `label` keys are English puns or
other quirky phrases that will not translate well!)*

Keys that begin with `info` are arrays of strings that use Markdown
formatting. They should be kept in a nested-list format. Please translate
the basic information as carefully as you can. They will often contain
examples from English or other languages. You may omit the examples,
or change them to an example that is better understood by your
target audience.

### Translation Tables

`Info` keys may also contain `Translation Tables`, which are a special
format used by the app. They will be in a format like the following:

```plain
`[translationTable] Le | cortó | el | pelo. || 3.DAT | cut.3s.PST | DEF.M.s | hair ||| Optional final line.`
```

It is important to maintain the following conditions:

1) The indentation of the line (it should match the list item
   it is a part of)
2) The surrounding &#96;backticks&#96;
3) The exact text `[translationTable]` at the beginning
4) The entire table **MUST** remain in a single string, not spread
   among multiple strings

The format follows this pattern:

1) table cells in a row are separated by single pipes: |
2) table rows are separated by double pipes: ||
3) an optional final row, not broken into cells, is separated from
   the others by three pipes: |||
4) pipes must have at least one space on either side, e.g.
   `this is || ok`, but `these| are||not |||ok`

Except for the optional final row, table rows should have an equal
number of cells. Rows should come in pairs. The odd rows will be an
example, while the even rows will be the cell-by-cell translation
of the given example. These translations use **Leipzig Glossing rules.**
I am unsure how universal these rules are, or if they have localized
forms in other languages. [You can learn about these rules
here.](https://www.eva.mpg.de/lingua/resources/glossing-rules.php) If
the link doesn't work, it's archived on [the Wayback Machine Archive:
2019-Feb-10.](https://web.archive.org/web/20190210105443/https://www.eva.mpg.de/lingua/resources/glossing-rules.php)

The cells and rows may contain simple Markdown formatting, but **NOT**
table formatting.

## Checkboxes

Keys that begin with `checkbox` will have other properties. **Only**
translate the *plain text* within them. **DO NOT** change the format
of the information. E.g, if a property is an array of three strings,
the translated property **MUST** also be an array of three strings.

Keys that begin with `checkbox` and **DO NOT** end with `Export` will
have a `labels` property, and may have `header` and/or `columnHeaders`
properties. The `labels` property will be an array of strings, or an
array of arrays of strings. The `columnHeaders` property will be an
array of strings. The `header` property will be a single string. Each
individual string in these properties can use Markdown formatting.

Keys that begin with `checkbox` and **DO** end with `Export` also have
`labels` and `header` properties, but are *PLAIN TEXT*, not Markdown.

### Other Information

HTML in Markdown is **DISABLED** and should not be used.

In MorphoSyntax **ONLY**, *GitHub Flavored Markdown* is supported. This
allows for things like tables and strike-throughs. [You can learn more
about *GFM* here.](https://github.github.com/gfm/)

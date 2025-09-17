# Pandoc Cheat Sheet

## Egyszerű Pandoc-parancs, azonos mappa, nem kell útvonalat írni:

> pandoc darklab_humor.md -o darklab_humor.html --css darklab_dark.css --standalone

## Projektstrukturált mappa, ha sok .md fájl van:

```ini
darklab/
├── css/
│   ├── darklab_dark.css
│   └── darklab_print.css
├── humor/
│   └── darklab_humor.md
├── images/
└── index.md
```

## Ilyenkor Pandoc-ban így:

> pandoc humor/darklab_humor.md -o humor/darklab_humor.html --css ../css/darklab_dark.css --standalone

## GitHub repóban (publikálás esetén):

Ha később GitHub Pages-en vagy más webes felületen is megjeleníted, akkor a css/ mappába érdemes rakni, és a HTML-ek <head> szakaszában relatív linkként hivatkozni rájuk:

```ini
<link rel="stylesheet" href="css/darklab_dark.css">
```

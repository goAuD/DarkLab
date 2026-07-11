# Pandoc Cheat Sheet

## Simple Pandoc command, same folder, no path needed:

> pandoc darklab_humor.md -o darklab_humor.html --css darklab_dark.css --standalone

## Structured project folder, if there are many .md files:

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

## In that case, Pandoc looks like this:

> pandoc humor/darklab_humor.md -o humor/darklab_humor.html --css ../css/darklab_dark.css --standalone

## In a GitHub repo (when publishing):

If you're later rendering this on GitHub Pages or another web frontend, it's worth putting the stylesheets in a `css/` folder and referencing them as a relative link in the HTML `<head>` section:

```ini
<link rel="stylesheet" href="css/darklab_dark.css">
```

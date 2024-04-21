## Install

  * Press <kbd>F1</kbd> and select `Extensions: Install Extensions`.
  * Search for and select `css sorting`.

See the [extension installation guide](https://code.visualstudio.com/docs/editor/extension-gallery) for details.

## Usage

![example](example.gif)

- Autosave trigger.
- Full text mode: Press <kbd>F1</kbd> and run the command named `CSS Sorting: Run`.
- Range mode: Select `full` css class and open context menu to `CSS Sorting: Format`.
- File mode: in vscode left file tree, select styles folder or css/less/scss file, then open context menu to `CSS Sorting: Files/File`.

## Supported languages

* CSS
* Less
* SCSS

## Options

You can override the default and user settings for individual projects. Just add an `CSSSorting` object to the `settings.json` file.

For example:

```json
{
  "CSSSorting.config": {
    "order": [
      "custom-properties",
      "dollar-variables",
      "declarations",
      "at-rules",
      "rules"
    ],
    "properties-order": ["display", "position", "top", "right", "bottom", "left"]
  }
}
```

## Publish Tips

Use `npm` with vsce, don't use pnpm that will be cause error in build.


## License

This software is released under the terms of the MIT license.

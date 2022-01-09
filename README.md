# swift-add-documentation README

This extension inserts document templates for the swift language inside your code. This code is very
similar to `Add Documentation` as can be found in `Xcode`.

## Features

Documentation can be added to the types:

- variables
- methods
- enums
- struct/class

The default keybinding for swift-add-documentation is the key combination CMD+Alt+/.

![demo.gif](https://raw.githubusercontent.com/fappelman/swift-add-documentation/master/images/swift-add-documentation.gif)

Use tab to move from field to field.

Alternatively the template can be inserted by typing the
prefix `///`:

![demo2.gif](https://raw.githubusercontent.com/fappelman/swift-add-documentation/master/images/swift-add-documentation2.gif))

Adding documentation lines can be done using `shift+enter`:

![demo3.gif](https://raw.githubusercontent.com/fappelman/swift-add-documentation/master/images/swift-add-documentation3.gif))

Using `shift+alt+enter` allows to open a new comment line
from the middle of the sentence.

![demo4.gif](https://raw.githubusercontent.com/fappelman/swift-add-documentation/master/images/swift-add-documentation4.gif))

Additionally it will indent to match the previous line.

![demo5.gif](https://raw.githubusercontent.com/fappelman/swift-add-documentation/master/images/swift-add-documentation5.gif))

Finally this will also work for regular comments

![demo6.gif](https://raw.githubusercontent.com/fappelman/swift-add-documentation/master/images/swift-add-documentation6.gif))

## Requirements

This extension has no requirements
although without the `swift` module it will not have much use.

## Extension Settings

No settings.

## Known Issues

No known issues. Given that this is a first release it should
be expected that bugs will reveal itself.

## Release Notes

### 0.0.2

- Fixed default hotkeys. They were in the wrong place in the `package.json` file.
- Added functionality to insert the template after typing `///`.
- Added functionality to start a new comment line  when using typing `enter+return`.
- Added functionality to insert a new comment line when using typing `enter+opt+return` that can be used in the middle of the current line and does not break up the existing line.

## 0.0.1

- Initial release

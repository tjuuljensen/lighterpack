# Changelog

## 2.1.0

LighterPack 2.1.0 focuses on making lists easier to share, preview, read, and customize while keeping the original list-building workflow recognizable.

### Better Previewing Before Sharing

The app now has a Preview/Edit control in the top menu. Preview mode lets signed-in users see a read-only version of the active list that is much closer to the public shared page. This makes it easier to check how a list will look before sending a shared link.

In preview mode:

- The list contents are shown as read-only.
- The List Description field renders as Markdown.


### More Complete Copying and Exporting

Copying a list now brings over more of the original list's presentation and notes:

- List Description is included in copied lists.
- Category colors are included in copied lists.


### Category Color Improvements

The category color picker now accepts an HTML color code below the selector wheel. This makes it easier to reuse a specific color across categories or from another design tool.

### Updates to the UI

- The edit-mode List Description textarea grows automatically for longer text.
- A new setting "Hide zero qty items" will now hide items with a quantity of "0".
- Version information is now shown in the pae footer.

### Dark Mode

LighterPack now has theme controls in the page footer for system, light, and dark modes.

### DB driver rewritten

To accommodate newer MongoDB versions, the database driver has been completely rewritten. The previous implementation relied on the mongojs library, which uses an older version of the MongoDB driver and lacks support for recent MongoDB features and security updates. The new driver uses the official MongoDB Node.js driver (v6.21.0) directly, providing:

- Improved compatibility with MongoDB 4.0+ and Atlas clusters
- Better connection pooling and performance
- Enhanced error handling and logging
- Support for modern MongoDB connection strings (including SRV records)
- Simplified API with methods for find, findOne, save (insert/update), and remove operations
- Proper connection lifecycle management with lazy initialization and cleanup

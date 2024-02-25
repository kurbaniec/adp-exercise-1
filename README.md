# adp-exercise-1

## 🚀 Installation and Run

To get started, follow these steps:

1. Install dependencies:
    ```bash
    npm install
    ```

2. Run the application:
    ```bash
    npm run dev
    ```

Once the application is running, you can access the Markdown editor in your browser.

![Markdown Editor](.img/editor.png)

****

### How We Came to the Idea:

In today's digital world, simplicity is key. That's why we decided to develop a Markdown editor. This tool is user-friendly, making it accessible even for those with limited technical knowledge. Markdown simplifies the content creation process by removing the need for complex formatting. Instead, it offers a straightforward environment similar to plain text, with only a few symbols for emphasis. This makes it easy for anyone to write and share content, regardless of their familiarity with coding languages. By creating a Markdown editor, we aim to help people express their ideas more efficiently, thereby enhancing productivity and communication across various fields.

### Core Functionalities:

- **Text Editing:** Users can edit text within the editor, allowing for the creation and modification of content.
- **Formatting Buttons:** The system provides buttons for various Markdown formatting options, simplifying text formatting for users.
- **Undo/Redo:** Users can undo or redo their actions, providing flexibility and allowing for correction of mistakes.

### Design Patterns Integration:

- **Command Pattern:** Separates user actions from formatting execution, enhancing flexibility.
- **Memento Pattern:** Saves text state to enable undo functionality, ensuring users can revert changes easily.
- **Facade Pattern:** Simplifies user interactions by providing an intuitive interface with text area and buttons.

### Basic Design Sketch:

A user interface displays a text area and buttons for formatting options. Clicking a button applies the chosen formatting to the text. Behind the scenes, design patterns ensure smooth interaction and undo capability.

![System Architecture](/.img/uml-diagram.png)

In this system, the *Invoker* is responsible for receiving and executing user inputs by creating and executing *Commands*. Before executing each *Command*, the *Invoker* saves the current state of the *TextEditor* as an *EditorContent* using the Memento pattern. This allows for undo and redo functionality, as the system can revert to previous states of the *TextEditor*.

The *TextEditor* stores both the current content and cursor position, ensuring accurate representation of user interactions.

### Conclusion:

In conclusion, the implementation of our Markdown editor benefited greatly from using different design patterns. The Command pattern helped decouple user actions from formatting execution, making our code more flexible. Meanwhile, the Memento pattern proved useful for implementing the undo feature, allowing users to revert changes easily. Additionally, the Facade pattern simplified user interactions, making the editor more intuitive to use.

****

**Group 5:**
- Ezequiel Bellver
- Kacper Urbaniec
- Rene Sorger

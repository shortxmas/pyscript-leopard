import React, { useState, useEffect, useRef } from "react";
import { EditorView } from "codemirror";
import { EditorState } from "@codemirror/state";
import { languageServer } from "codemirror-languageserver";
import { basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import { lintGutter } from "@codemirror/lint";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";

function App() {
  const editor = useRef(null);
  const viewRef = useRef(null);
  const [functionsDeclared, setFunctionsDeclared] = useState(false);

  useEffect(() => {
    const serverUri = "ws://localhost:4600";

    const ls = languageServer({
      serverUri,
      rootUri: "file:///",
      documentUri: "file:///index.js",
      languageId: "python",
    });

    const startState = EditorState.create({
      doc: "# Write your Python code here",
      extensions: [
        basicSetup,
        // ls,
        python(),
        lintGutter(),
        indentationMarkers(),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editor.current,
    });

    viewRef.current = view;

    // if (!functionsDeclared) {
    //   const functions = `
    //   const mockPatchApiFunction = () => {
    //     window.alert("Mock API function invoked.");
    //   };
    //   `;

    //   document.getElementById("imports").textContent = functions;
    //   setFunctionsDeclared(true);
    // }

    return () => {
      view.destroy();
    };
  }, []);

  const rerunScript = () => {
    const imports = `from pyscript import display\nimport js\nmockPatchApiFunction=js.eval("mockPatchApiFunction")\nmockPatchApiFunctionWithParameter=js.eval("mockPatchApiFunctionWithParameter")\n`;

    const newScript = document.createElement("script");
    newScript.type = "py";
    newScript.text = imports + viewRef.current.state.doc.toString();
    document.getElementById("result").appendChild(newScript);
  };

  return (
    <div className="App">
      <h1>Python Code Editor</h1>
      <div ref={editor}></div>
      <button onClick={rerunScript}>Run Script</button>
      {/* <script id="imports"></script> */}
      <div id="result"></div>
    </div>
  );
}

export default App;

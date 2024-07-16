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
  const [codeState, changeCodeState] = useState()

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

    return () => {
      view.destroy();
    };
  }, []);

  const testFunctionToRun = (name) =>{
    console.log(`My name is ${name}`)
  }

  const logCode = () => {
    if (viewRef.current) {
      console.log(viewRef.current.state.doc.toString());
    }
  };

  const setCode = () => {
    if (viewRef.current) {
      changeCodeState(viewRef.current.state.doc.toString());
    }
  };

  return (
    <div className="App">
      <h1>Python Code Editor</h1>
      <div ref={editor}></div>
      <script type="py">
        {codeState}
      </script>
      <button onClick={()=>{setCode()}}>Test</button>
    </div>
  );
}

export default App;

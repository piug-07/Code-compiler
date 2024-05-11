/* eslint-disable no-unused-vars */
import { useState } from "react";
import "./app.css";

function App() {
  const [code, setCode] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(code)
  }


  
  return (
    <div className=" flex  flex-col items-center justify-center mx-auto">
      <h1 className="text-4xl">Online Code Compiler</h1>
      <div>
        <label>Language:</label>
        <select
          // value={language}
          // onChange={(e) => {
          //   const shouldSwitch = window.confirm(
          //     "Are you sure you want to change language? WARNING: Your current code will be lost."
          //   );
          //   if (shouldSwitch) {
          //     setLanguage(e.target.value);
          //   }
          // }}
        >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
      </div>
      <br />
      <div>
        <button 
        // onClick={setDefaultLanguage}
        >Set Default</button>
      </div>
      <br />
      <textarea
        rows="20"
        cols="75"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
        }}
        className="border-2 border-black"
      ></textarea>
      <br />
      <button 
      onClick={handleSubmit}
      >Submit</button>
      {/* <p>{status}</p> */}
      {/* <p>{jobId ? `Job ID: ${jobId}` : ""}</p>
      <p>{renderTimeDetails()}</p>
      <p>{output}</p> */}
    </div>
  );
}

export default App;

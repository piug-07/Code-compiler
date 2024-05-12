/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import stubs from "../stubs.js";
import moment from "moment";
import axios from "axios";
import "./app.css";
import Navbar from "./navbar.jsx";

function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);
  useEffect(() => {
    console.log(import.meta.env.VITE_BACKEND_URL);
    const defaultLang = localStorage.getItem("default-language") || "cpp";
    setLanguage(defaultLang);
  }, []);

  let pollInterval;

  const handleSubmit = async (e) => {
    const payload = {
      language,
      code,
    };
    try {
      setOutput("");
      setStatus(null);
      setJobId(null);
      setJobDetails(null);
      const { data } = await axios.post("http://localhost:5000/run", payload);
      if (data.jobId) {
        setJobId(data.jobId);
        setStatus("Submitted.");

        // poll here
        pollInterval = setInterval(async () => {
          const { data: statusRes } = await axios.get(
            `http://localhost:5000/status`,
            {
              params: {
                id: data.jobId,
              },
            }
          );
          const { success, job, error } = statusRes;
          console.log(statusRes);
          if (success) {
            const { status: jobStatus, output: jobOutput } = job;
            setStatus(jobStatus);
            setJobDetails(job);
            if (jobStatus === "pending") return;
            setOutput(jobOutput);
            clearInterval(pollInterval);
          } else {
            console.error(error);
            setOutput(error);
            setStatus("Bad request");
            clearInterval(pollInterval);
          }
        }, 1000);
      } else {
        setOutput("Retry again.");
      }
    } catch ({ response }) {
      if (response) {
        const errMsg = response.data.err.stderr;
        setOutput(errMsg);
      } else {
        setOutput("Please retry submitting.");
      }
    }
  };

  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language);
    console.log(`${language} set as default!`);
  };

  const renderTimeDetails = () => {
    if (!jobDetails) {
      return "";
    }
    let { submittedAt, startedAt, completedAt } = jobDetails;
    let result = "";
    submittedAt = moment(submittedAt).toString();
    result += `Code Submitted At: ${submittedAt}  `;
    if (!startedAt || !completedAt) return result;
    const start = moment(startedAt);
    const end = moment(completedAt);
    const diff = end.diff(start, "seconds", true);
    result += `Execution Time: ${diff}s`;
    return result;
  };
  const datas = renderTimeDetails();
  console.log("🚀 ~ App ~ datas:", datas);

  return (
    <div className=" flex  flex-col items-center justify-center mx-auto">
      <Navbar />
      <div className="flex flex-row items-center justify-around bg-white p-4 rounded-md shadow-lg w-full mb-5">
        <div>
          <label className="mr-3 text-lg font-serif font-semibold">
            Language:{" "}
          </label>
          <select
            value={language}
            onChange={(e) => {
              const shouldSwitch = window.confirm(
                "Are you sure you want to change language? WARNING: Your current code will be lost."
              );
              if (shouldSwitch) {
                setLanguage(e.target.value);
              }
            }}
            className="py-2 px-8 inline-flex items-center gap-x-2 text-lg font-medium rounded-lg border border-gray-200 bg-white text-teal-500 shadow-sm  disabled:opacity-50 disabled:pointer-events-none outline-none hover:border-teal-400"
          >
            <option value="cpp">C++</option>
            <option value="py">Python</option>
            <option value="js">Javascript</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="go">Golang</option>
          </select>
        </div>

        <div>
          <button
            onClick={setDefaultLanguage}
            className="py-3 px-4 w-40 text-center inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border text-teal-800 hover:border-teal-400 disabled:opacity-50 disabled:pointer-events-none bg-white translate-x-0 transform hover:bg-teal-200 opacity-90 transition-all duration-300 ease-out group-hover:w-full border-teal-400"
          >
            <span className="inline-block w-full">Set Default</span>
          </button>
        </div>
      </div>
      <br />

      <div className="flex flex-row w-full mx-3">
        <div className="flex flex-col items-center justify-center w-[50%]">
          <textarea
            rows="20"
            cols="75"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
            }}
            className="border-2 border-gray-300 focus:border-teal-400 hover:border-teal-400 transition duration-300 ease-in-out w-11/12 h-full p-4 rounded-md shadow-lg text-lg font-mono bg-white focus:outline-none overflow-auto"
            style={{
              scrollbarWidth: "thin",
              scrollBehavior: "smooth",
            }}
          ></textarea>

          <button
            onClick={handleSubmit}
            className="group mt-8 relative inline-block overflow-hidden rounded-2xl border-4 border-double border-teal-400 px-14 w-2/4 py-3 font-medium text-teal-400 shadow-lg text-center"
          >
            <span className="absolute left-0 top-0 mb-0 flex h-full w-0 translate-x-0 transform bg-teal-400 opacity-90 transition-all duration-300 ease-out group-hover:w-full"></span>
            <span className="relative group-hover:text-white">
              {status ? status : "Submit"}
            </span>
          </button>
        </div>
        <div className="w-[50%] flex flex-col justify-start">
          <div className="flex items-center justify-center mb-8 w-11/12 h-[33%] border-2 border-gray-300 rounded-md shadow-md p-4 text-lg font-mono ">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="border-b-2 border-gray-300 mb-4 p-2 w-full text-center">
                <p className="text-blue-500 text-lg font-medium">
                  {jobId ? `Job ID: ${jobId}` : "No Job ID"}
                </p>
              </div>
              <div className="p-2 text-center ">
                <p className="text-gray-700 font-mono text-lg font-medium">
                  {renderTimeDetails()}
                </p>
              </div>
            </div>
          </div>

          <div className="w-11/12 h-[50%]">
            <div className="w-full h-full overflow-auto border-2 border-gray-300 rounded-md shadow-lg text-lg font-mono bg-white">
              <nav className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b-2 border-gray-300 rounded-t-md">
                <h1 className="text-xl font-bold">Output:</h1>
              </nav>
              <div className="p-4">{output}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

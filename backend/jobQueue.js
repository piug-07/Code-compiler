const Queue = require("bull");
const Job = require("./models/Job");
const { executeCpp } = require("./executeCpp");
const { executeJs } = require("./executeJs");
const { executePy } = require("./executePy");
const { executeC } = require("./executegcc");
const { executeJava } = require("./executeJava");

const jobQueue = new Queue("job-runner-queue");
const NUM_WORKERS = 5;

jobQueue.process(NUM_WORKERS, async ({ data }) => {
  console.log("data:", data);
  const jobId = data.id;

  const job = await Job.findById(jobId);

  if (job === undefined) {
    throw Error(`cannot find Job with id ${jobId}`);
  }
  try {
    let output;
    job["startedAt"] = new Date();
    switch (job.language) {
      case "cpp":
        output = await executeCpp(job.filepath);
        break;
      case "py":
        output = await executePy(job.filepath);
        break;
      case "js":
        output = await executeJs(job.filepath);
        break;
      case "java":
        output = await executeJava(job.filepath);
        break;
      case "c":
        output = await executeC(job.filepath);
        break;
      default:
        throw new Error("Unsupported language");
    }
    job["completedAt"] = new Date();
    job["output"] = output;
    job["status"] = "success";
    await job.save();
    return true;
  } catch (err) {
    job["completedAt"] = new Date();
    job["output"] = JSON.stringify(err);
    job["status"] = "error";
    await job.save();
    throw new Error(JSON.stringify(err));
  }


});


jobQueue.on("failed", (error) => {
  console.error(error.data.id, error.failedReason);
});

const addJobToQueue = async (jobId) => {
  jobQueue.add({
    id: jobId,
  });
};

module.exports = {
  addJobToQueue,
};
// auto-deploy.js
const { execSync } = require("child_process");
const path = require("path");

const REPO_PATH = __dirname;          // uses the folder this script lives in
const BRANCH = "main";                // change if you deploy from a different branch
const CHECK_INTERVAL = 30 * 1000;     // 30 seconds — adjust as you like

function run(cmd) {
  console.log(`\n[${new Date().toLocaleTimeString()}] > ${cmd}`);
  const output = execSync(cmd, { cwd: REPO_PATH, stdio: "pipe" }).toString();
  if (output.trim()) console.log(output);
  return output;
}

function checkAndDeploy() {
  try {
    run(`git fetch origin ${BRANCH}`);

    const local = execSync(`git rev-parse ${BRANCH}`, { cwd: REPO_PATH }).toString().trim();
    const remote = execSync(`git rev-parse origin/${BRANCH}`, { cwd: REPO_PATH }).toString().trim();

    if (local !== remote) {
      console.log(`New commit detected (${local.slice(0,7)} -> ${remote.slice(0,7)}). Deploying...`);

      run(`git pull origin ${BRANCH}`);
      run("npm install");
      run("npm run build");
      run("pm2 reload myapp");

      console.log("✅ Deploy complete.\n");
    } else {
      console.log(`[${new Date().toLocaleTimeString()}] No changes. (${local.slice(0,7)})`);
    }
  } catch (err) {
    console.error("❌ Deploy check failed:", err.message);
  }
}

// run once immediately, then on interval
checkAndDeploy();
setInterval(checkAndDeploy, CHECK_INTERVAL);
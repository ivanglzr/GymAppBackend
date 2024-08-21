import fs from "fs/promises";
import path from "path";

import { blockedIPFile } from "../config.js";

const blockedIPsFile = path.join(process.cwd(), blockedIPFile);

let blockedIPs = new Set();

const loadBlockedIPs = async () => {
  try {
    const data = await fs.readFile(blockedIPsFile, "utf-8");
    const ipArray = JSON.parse(data);
    blockedIPs = new Set(ipArray);
  } catch (_) {}
};

const saveBlockedIPs = async () => {
  try {
    const ipArray = Array.from(blockedIPs);
    await fs.writeFile(
      blockedIPsFile,
      JSON.stringify(ipArray, null, 2),
      "utf-8"
    );
    await loadBlockedIPs();
  } catch (_) {}
};

const blockIPs = async (req, res, next) => {
  const userIP = req.ip;

  console.log(userIP);

  if (blockedIPs.has(userIP)) {
    return res.status(403).send("Forbidden: Access is denied.");
  }

  next();
};

const blockIP = async (ip) => {
  blockedIPs.add(ip);
  await saveBlockedIPs();
};

await loadBlockedIPs();

export { blockIPs, blockIP };

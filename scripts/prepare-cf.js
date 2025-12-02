import fs from "fs";
import path from "path";

const dist = "dist"; // change if your build output folder is different

// copy _headers
fs.copyFileSync(path.join(".", "_headers"), path.join(dist, "_headers"));

// copy _redirects
fs.copyFileSync(path.join(".", "_redirects"), path.join(dist, "_redirects"));

console.log("_headers and _redirects copied into", dist);

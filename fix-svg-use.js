main().catch((error) => {
  console.error(error);
});

async function main() {
  await ready();

  console.log("ready");
}

function ready() {
  return new Promise((resolve) => {
    if (document.readyState !== "loading") {
      resolve();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        resolve();
      });
    }
  });
}

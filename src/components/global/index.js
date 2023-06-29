let apiKey = process.env.VITE_API_KEY;

export const getCreateRoomBlock = () => {
  document.getElementById("create-container").classList.toggle("hidden");
  document.getElementById("create-container").classList.toggle("grid");
};
export function randomKey() {
  let str = "QWERTYUIOPASDFGHJKLZXCVBNM",
    nums = "1234567890".split(""),
    symbols = "!@#$%^&*){}[]".split(""),
    upper = str.split(""),
    lower = str.toLowerCase().split("");

  let mix = [...nums, ...symbols, ...upper, ...lower];
  let key = "";
  for (let i = 0; i < 8; i++) {
    key += mix[Math.floor(Math.random() * mix.length)];
  }
  return key;
}

export function copyKey(e) {
  let key = document.querySelector("#Key #privatekey");
  key.select();
  document.execCommand("copy");
}

export function textAreaAutoResize(e) {
  e.target.style.height = "auto";
  e.target.style.height = e.target.scrollHeight + "px";
}
// upload images
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeType = dataURI.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return {
    blob: new Blob([ab], { type: mimeType }),
    mimeType,
  };
}
export async function uploadGetNewUrl(image) {
  // setUploadSpin(true);
  const blob = dataURItoBlob(image.src);
  const newFile = new File([blob.blob], `${new Date().getTime()}`, { type: blob.mimeType });
  let formData = new FormData();
  formData.append("file", newFile);
  console.log(formData);
  let req = await fetch(`${apiKey}/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  let res = await req.json();
  if (res.upload) {
    // setUploadSpin(false);
    return res.imgUrl;
  }
}

// simulate slow connection
export function wait(time) {
  return new Promise((resolve) => {
    setInterval(resolve, time);
  });
}

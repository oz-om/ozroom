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
// simulate slow connection
export function wait(time) {
  return new Promise((resolve) => {
    setInterval(resolve, time);
  });
}

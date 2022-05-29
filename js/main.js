// Customize right-click menu

/* VARIABLES */
const TEXT_OFFSET = 9.59;
const CHAR_SIZE = 9.1503;

const version = "v0.4";

// 20 chars
// 191.5px
// 20 chars * 9.1203 = 182.406
// 182.406 + 10.094
const prefixText = `[t1]you[/t1][t2]@[/t2][t3]woofterm-${version} $ [/t3]`;
/* END OF VARIABLES */

const output = document.getElementById("output");
const input = document.getElementById("terminalInput");
const prefix = document.getElementById("prefix");
const autocomplete = document.querySelector("div#autocomplete");
let lengthOfPrefix = 0;

let availableCommands = [
  "anas",
  "help",
  "colors",
  "colours",
  "clear",
  "wfetch",
  "startup",
  "credits",
  "changelog",
  "history",
  "open",
  "repo",
  "",
]; // Sets the available commands for the red stuff to work.

let advancedAvailableCommands = ["open "];

let commands = [];
let backIndex = 0;

function addRawLine(text) {
  output.innerHTML = output.innerHTML + text;
}
function colorize(text) {
  let colorizedText = text;
  colorizedText = colorizedText
    .replaceAll("[cr]", '<div class="colour red-stuff">')
    .replaceAll("[/cr]", "</div>"); // RED
  colorizedText = colorizedText
    .replaceAll("[cb]", '<div class="colour blue-stuff">')
    .replaceAll("[/cb]", "</div>"); // BLUE
  colorizedText = colorizedText
    .replaceAll("[cy]", '<div class="colour yellow-stuff">')
    .replaceAll("[/cy]", "</div>"); // YELLOW
  colorizedText = colorizedText
    .replaceAll("[cg]", '<div class="colour green-stuff">')
    .replaceAll("[/cg]", "</div>"); // GREEN
  colorizedText = colorizedText
    .replaceAll("[clb]", '<div class="colour lightblue-stuff">')
    .replaceAll("[/clb]", "</div>"); // LIGHT BLUE
  colorizedText = colorizedText
    .replaceAll("[clg]", '<div class="colour lightgreen-stuff">')
    .replaceAll("[/clg]", "</div>"); // LIGHT BLUE
  colorizedText = colorizedText
    .replaceAll("[t1]", '<div class="colour term1-stuff">')
    .replaceAll("[/t1]", "</div>");
  colorizedText = colorizedText
    .replaceAll("[t2]", '<div class="colour term2-stuff">')
    .replaceAll("[/t2]", "</div>");
  colorizedText = colorizedText
    .replaceAll("[t3]", '<div class="colour term3-stuff">')
    .replaceAll("[/t3]", "</div>");

  if (colorizedText.match(/\[click-\w+\]/g)) {
    // console.log("clicky");
    // console.log(
    //   colorizedText
    //     .match(/\[click-\w+\]/g)[0]
    //     .replace("[click-", "")
    //     .replace("]", "")
    // );
    const cmdName = colorizedText
      .match(/\[click-\w+\]/g)[0]
      .replace("[click-", "")
      .replace("]", "");
    // console.log(cmdName);
    colorizedText = colorizedText.replaceAll(
      `[click-${cmdName}]`,
      `<div class='inline click' woofclick='${cmdName}'>`
    );
  }
  if (
    colorizedText.match(
      /\[link-https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)\]/g
    )
  ) {
    // console.log("clicky");
    // console.log(
    //   colorizedText
    //     .match(/\[click-\w+\]/g)[0]
    //     .replace("[click-", "")
    //     .replace("]", "")
    // );
    colorizedText
      .match(
        /\[link-https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)\]/g
      )
      .forEach((element) => {
        const linkUrl = element.replace("[link-", "").replace("]", "");
        // console.log(cmdName);
        colorizedText = colorizedText.replaceAll(
          `[link-${linkUrl}]`,
          `<a href="${linkUrl}" target=\"_blank">`
        );
      });
  }
  colorizedText = colorizedText.replaceAll("[/link]", "</a>");
  colorizedText = colorizedText.replaceAll("[/click]", "</div>");
  if (colorizedText.match(/\[\d+s\/\]/g)) {
    colorizedText.match(/\[\d+s\/\]/g).forEach((element) => {
      let numOfSpaces = element.replace(/(\[|s|\/|\])/g, "");

      if (numOfSpaces.match(/\d+/g)) {
        let spaces = "";
        for (var i = 0; i < parseInt(numOfSpaces); i++) {
          spaces = spaces + "[s/]";
          //   console.log(spaces);
        }
        colorizedText = colorizedText.replace(
          "[" + numOfSpaces + "s/]",
          spaces
        );
      }
    });
  } // I don't know how to read this, i wrote it btw

  colorizedText = colorizedText.replaceAll("[n/]", "<br/>");
  colorizedText = colorizedText.replaceAll("[s/]", "&nbsp;");
  colorizedText = colorizedText.replaceAll("[&09&]", "");

  return colorizedText;
}
function addLine(text) {
  addRawLine('<div class="line">' + colorize(text) + "</div>");
}
function clearOutput() {
  output.innerHTML = "";
}
function setInput(text) {
  input.value = text;
  var that = input;
  setTimeout(function () {
    that.selectionStart = that.selectionEnd = 10000;
  }, 0);
  const event = new Event("input");
  input.dispatchEvent(event);
}
function refocus() {
  input.focus();
}
function checkIfStringStartsWith(str, substrs) {
  return substrs.some((substr) => str.startsWith(substr));
}

function commandExists(command) {
  return (
    availableCommands.indexOf(command) >= 0 ||
    checkIfStringStartsWith(command, advancedAvailableCommands)
  );
}
commandExists("hello");
function addCommandLine() {
  const doesCommandExists = commandExists(input.value);
  addLine(
    prefixText +
      (doesCommandExists
        ? input.value
        : "<div class='error inline'>" + input.value + "</div>")
  );
}
function openTab(url) {
  window.open(url, "_blank").focus();
}
function helpCommand(cmd, desc) {
  addLine(`[clb][click-${cmd}]${cmd}[/click][/clb][n/][3s/]${desc}`);
}
function stextLength(text) {
  cleanText = colorize(text).replace(/<\/?[^>]+(>|$)/g, "");
  return cleanText.length;
}
input.addEventListener("input", (event) => {
  event.target.setAttribute(
    "size",
    event.target.value.length < 1 ? 1 : event.target.value.length
  );
  event.target.setAttribute(
    "maxlength",
    event.target.value.length < 1 ? 3 : event.target.value.length + 2
  );
  //   console.log(event.target.value);
  if (commandExists(event.target.value)) {
    try {
      event.target.classList.remove("error");
    } catch {}
  } else {
    event.target.classList.add("error");
  }
  let clear = true;

  if (clear) {
    autocomplete.innerHTML = "";
  }

  if (input.value != "") {
    for (var i = 0; i < availableCommands.length; i++) {
      if (
        availableCommands[i].startsWith(input.value) &&
        availableCommands[i] != input.value
      ) {
        // console.log(availableCommands[i]);
        autocomplete.innerHTML = availableCommands[i];
        break;
      }
    }
  } else {
    autocomplete.innerHTML = "";
  }
});

refocus();

clearOutput();

prefix.innerHTML = colorize(prefixText);
function advancedCommands(cmd) {
  let command = cmd.split(" ")[0];
  let args = cmd.split(" ");
  args.shift();

  //   addLine("CMD: " + command);
  //   addLine("Args: " + args);

  switch (command) {
    case "open":
      addLine(
        `[cg]Opening ${
          args.join("%20") == "" ? "nothing??" : args.join("%20")
        }...[/cg]`
      );
      openTab(args.join("%20"));
      break;
    default:
      return false;
  }
  return true;
}
function commandHandler(command, cmdline = true) {
  if (cmdline) addCommandLine();
  backIndex = 0;

  switch (command) {
    case "anas":
      addLine("Hi this is the Anas Khan command.");
      break;
    case "repo":
      addLine(
        "[n/][clb]GitHub Repo: [link-https://github.com/woooferz/terminalweb]Terminal Web[/link][n/][n/]"
      );
      break;
    case "changelog":
      addLine("Changelog:");
      addLine("[2s/]v0.4:");
      addLine("[4s/]Added autocompletion");
      addLine("[n/]");

      addLine("[2s/]v0.3.1:");
      addLine("[4s/]Added the repo command");
      addLine("[4s/]Added repo to the wfetch command");

      addLine("[2s/]v0.3:");
      addLine("[4s/]Updated colours");
      addLine("[4s/]Added support for advanced commands");
      addLine("[n/]");
      addLine("[2s/]v0.2.5:");
      addLine("[4s/]Made it simpler to use links");
      addLine("[2s/]v0.2.4:");
      addLine("[4s/]Added history command");
      addLine("[2s/]v0.2.3:");
      addLine("[4s/]Added changelog command");
      addLine("[2s/]v0.2.2:");
      addLine("[4s/]Added credits command");
      break;
    case "help":
      helpCommand("help", "Outputs help message (AKA [cb]this[/cb])");
      helpCommand("Anas", "Says something about Anas Khan");
      helpCommand("colours", "Displays available colours");
      helpCommand("clear", "Clear the screen");
      helpCommand("wfetch", "Waffle Fetch displays info");
      helpCommand("startup", "Says startup message");
      helpCommand("credits", "Displays credits");
      helpCommand("changelog", "Changelog for Woof Terminal");
      helpCommand("history", "Shows command history of current session");
      helpCommand("open", "Opens a new tab with passed in url");
      helpCommand("repo", "Shows the github repos link");

      break;
    case "history":
      addLine("[cy]History:[/cy]");
      addLine(commands.join("[n/]"));
      break;
    case "startup":
      addLine("Welcome to Woof Terminal " + version + "!");
      addLine(
        "[cy]TIPS:[/cy] Use the [clb][click-help]help[/click][/clb] command to recieve help!"
      );
      break;
    case "credits":
      addLine("Thanks to: ");
      addLine("[3s/][cy]Waffles[/cy] for keeping me alive");
      addLine(
        "[3s/]JetBrains for JetBrains Mono [clb][link-https://www.jetbrains.com/lp/mono/] Link[/link][/clb]"
      );
      addLine(
        "[3s/]Ascii.co.uk for Waffle Ascii Art [clb][link-https://ascii.co.uk/art/waffle] Link[/link][/clb]"
      );
      break;
    case "waffles":
      addLine("Hello!");
      break;
    case "colors":
    case "colours":
      addLine("[cb]BLUE[/cb]");
      addLine("[clb]LIGHT BLUE[/clb]");
      addLine("[cg]GREEN[/cg]");
      addLine("[cr]RED[/cr]");
      addLine("[cy]YELLOW[/cy]");
      break;
    case "wfetch":
      const wfetch = `
    [cy][4s/]_.-------._[/cy][5s/]
    [n/]
    [cy][2s/].' _|_|_|_|_ '.[/cy][3s/]
    [n/]
    [cy][s/]/ _|_|_|_|_|_|_ \\[/cy][2s/] [clb]Terminal:[/clb] [cg]Woof Terminal ${version}[/cg]
    [n/]
    [cy]| |_|_|_|_|_|_|_| |[/cy][s/]     [clb]Theme:[/clb] [cg]Waffle Basic Theme[/cg]
    [n/]
    [cy]|_|_|_|_|_|_|_|_|_|[/cy][s/]     [clb]My Website:[/clb] [cg][link-https://wooferz.dev]wooferz.dev[/link][/cg]
    [n/]
    [cy]| |_|_|_|_|_|_|_| |[/cy][s/]     [clb]Hardware:[/clb] [cg]Browser[/cg]
    [n/]
    [cy]| |_|_|_|_|_|_|_| |[/cy][s/]     [clb]Repo:[/clb] [cg][link-https://github.com/woooferz/terminalweb]Github[/link][/cg]
    [n/]
    [cy][s/]\\ -|_|_|_|_|_|- /[/cy][2s/]
    [n/]
    [cy][2s/]'. -|_|_|_|- .'[/cy][3s/]
    [n/]
    [cy][4s/]\`---------\`[/cy][5s/]
    [n/]
      `;
      addLine(wfetch);
      break;
    case "clear":
      clearOutput();
      break;
    case "":
      break;
    default:
      if (!advancedCommands(command))
        addLine(
          "[cr]Unknown Command! Use [click-help]help[/click] for help![/cr]"
        );
      break;
  }
  window.scrollTo(0, document.body.scrollHeight);
}

input.onkeydown = function (e) {
  if (e.key == "Enter") {
    commandHandler(input.value);
    if (input.value != "") {
      commands.push(input.value);
    }
    setInput("");
    refocus();
  } else if (e.key == "ArrowUp") {
    backIndex = backIndex >= commands.length ? backIndex : backIndex + 1;
    setInput(backIndex <= 0 ? "" : commands[commands.length - backIndex]);
    refocus();
  } else if (e.key == "ArrowDown") {
    backIndex = backIndex <= 0 ? 0 : backIndex - 1;

    setInput(backIndex <= 0 ? "" : commands[commands.length - backIndex]);
    refocus();
  } else if (e.key == "Tab") {
    if (input.value != "") {
      for (var i = 0; i < availableCommands.length; i++) {
        if (
          availableCommands[i].startsWith(input.value) &&
          availableCommands[i] != input.value
        ) {
          // console.log(availableCommands[i]);
          setInput(availableCommands[i]);
          break;
        }
      }
    }
    e.preventDefault();
  }
  // console.log(e.key);
  // e.preventDefault();
  //   addLine(backIndex);
};

commandHandler("startup", false);

// document.getElementsByTagName("body")[0].addEventListener("change", (event) => {
//   const woofclicks = document.querySelectorAll(".click");
//   console.log(woofclicks);
//   woofclicks.forEach((woofclick) => {
//     woofclick.onclick = function (event) {
//       setInput(this.getAttribute("woofclick"));
//     };
//   });
// });
const woofclicks = document.querySelectorAll(".click");
woofclicks.forEach((woofclick) => {
  woofclick.onclick = function (event) {
    setInput(this.getAttribute("woofclick"));
  };
});
document.addEventListener("DOMSubtreeModified", (e) => {
  const woofclicks = document.querySelectorAll(".click");
  woofclicks.forEach((woofclick) => {
    woofclick.onclick = function (event) {
      setInput(this.getAttribute("woofclick"));
    };
  });
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
lengthOfPrefix = stextLength(prefixText);
marginPrefix = lengthOfPrefix * CHAR_SIZE + TEXT_OFFSET;
autocomplete.style.cssText += "margin-left:" + marginPrefix + "px;";

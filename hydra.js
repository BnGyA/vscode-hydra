const vscode = require("vscode");
const datefns = require("date-fns");
const moment = require("moment");

const placeholder = ["30"];
let timer = null;

var setHydra = function (duration, snooze = false) {
  let reminderMessage = ` I will remind you every ${duration} minutes to drink 💧  Happy coding!`;

  var currentTime = new Date();
  if (!snooze) {
    var newDate = moment(currentTime).add(duration, "m").toDate();
  } else {
    var newDate = moment(currentTime).add(1, "d").toDate();
    reminderMessage = `Have a wonderful day 💧`;
  }

  vscode.window.showInformationMessage(reminderMessage);

  const timePeriod = datefns.differenceInMilliseconds(newDate, currentTime);
  timer = setInterval(function () {
    vscode.window
      .showInformationMessage(
        `It's time to drink some water! 💧`,
        ...["Ok!", "Snooze for the day"]
      )
      .then((selection) => {
        if (selection === "Ok!") {
          return;
        } else if (selection === "Snooze for the day") {
          clearInterval(timer);
          setHydra(0, true);
        }
        //Timeout(timer);
      });
  }, timePeriod);
};

// this method is called when the extension is activated
function activate(context) {
  setHydra(60);

  console.log("Congratulations, Hydra is now activated!");

  let disposable = vscode.commands.registerCommand("hydra.update", function () {
    vscode.window
      .showInputBox({
        ignoreFocusOut: true,
        placeHolder: `${placeholder}`,
        prompt: `Enter the hydration's delay in minuts! 💧`,
      })
      .then((duration) => {
        if (!duration) {
          return;
        }
        clearInterval(timer);
        setHydra(duration);
      });
  });

  context.subscriptions.push(disposable);
}

// this method is called when the extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

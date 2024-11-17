(() => {
    const cloverSkipPercentage = 15, 
          bombSkipPercentage = 99, 
          freezeSkipPercentage = 80, 
          consoleRed = "font-weight: bold; color: red;", 
          consoleOrange = "font-weight: bold; color: orange;", 
          consolePrefix = "[J-AutoBot] ", 
          originalConsoleLog = console.log;
    
    console.log = function () {
      if (arguments[0] && (arguments[0].includes("[J-AutoBot]") || arguments[0].includes("github.com"))) {
        originalConsoleLog.apply(console, arguments);
      }
    };
  
    console.error = console.warn = console.info = console.debug = function () {};
    console.clear();
    console.log("%c" + consolePrefix + "Injecting...", consoleOrange);
  
    try {
      let totalPoints = 0, 
          skippedClovers = 0, 
          skippedBombs = 0, 
          skippedFreezes = 0, 
          gameEnded = false;
      
      const originalPush = Array.prototype.push;
      Array.prototype.push = function (...args) {
        args.forEach((arg) => {
          if (arg && arg.asset) {
            console.log(JSON.stringify(args));
            switch (arg.asset.assetType) {
              case "CLOVER":
                arg.shouldSkip = Math.random() < cloverSkipPercentage / 100;
                arg.shouldSkip ? (skippedClovers++, console.log("%c" + consolePrefix + "Skipping clover(" + skippedClovers + ")", consoleRed)) 
                               : (console.log("%c" + consolePrefix + "Clicking clover(" + totalPoints + ")", consoleOrange), 
                                  totalPoints++, setTimeout(() => { arg.onClick(arg), arg.isExplosion = !0, arg.addedAt = performance.now(); }, 700));
                break;
              case "BOMB":
                arg.shouldSkip = Math.random() < bombSkipPercentage / 100;
                arg.shouldSkip ? (skippedBombs++, console.log("%c" + consolePrefix + "Skipping bomb(" + skippedBombs + ")", consoleRed)) 
                               : (console.log("%c" + consolePrefix + "Clicking bomb", consoleRed), 
                                  totalPoints = 0, arg.onClick(arg), arg.isExplosion = !0, arg.addedAt = performance.now());
                break;
              case "FREEZE":
                arg.shouldSkip = Math.random() < freezeSkipPercentage / 100;
                arg.shouldSkip ? (skippedFreezes++, console.log("%c" + consolePrefix + "Skipping freeze(" + skippedFreezes + ")", consoleRed)) 
                               : (console.log("%c" + consolePrefix + "Clicking freeze", consoleOrange), 
                                  arg.onClick(arg), arg.isExplosion = !0, arg.addedAt = performance.now());
                break;
            }
          }
        });
        return originalPush.apply(this, args);
      };
  
      function checkGameEnd() {
        const rewardElement = document.querySelector("#app > div > div > div.content > div.reward");
        rewardElement && !gameEnded && (gameEnded = !0, console.log("%c" + consolePrefix + "Game Over. Total points earned: " + totalPoints, consoleOrange), 
        totalPoints = skippedClovers = skippedBombs = skippedFreezes = 0, window.NUXT.state.$s$0olocQZxou.playPasses > 0 ? setTimeout(() => {
          const button = document.querySelector("#app > div > div > div.buttons > button:nth-child(2)");
          button && (button.click(), console.log("%c" + consolePrefix + "Starting new game...", consoleOrange)), gameEnded = !1;
        }, Math.random() * (5151.2 - 3137.7) + 3137.7) : console.log("%c" + consolePrefix + "No more play passes left", consoleRed));
      }
  
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) mutation.type === "childList" && checkGameEnd();
      });
  
      const targetNode = document.querySelector("#app");
      targetNode && observer.observe(targetNode, { childList: !0, subtree: !0 });
  
      console.log("%c" + consolePrefix + "Script loaded", consoleOrange);
    } catch (e) {
      console.log("%c" + consolePrefix + "An error occurred!", consoleRed);
      console.log(e);
    }
  })();
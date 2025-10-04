// Wrap in DOMContentLoaded to ensure elements are available
document.addEventListener('DOMContentLoaded', () => {
  // Get references to DOM elements
  const output = document.getElementById('output');
  const input = document.getElementById('input');

  // Video overlay handling (optional)
  const video = document.getElementById('myVideo');
  const overlayBtn = document.getElementById('playOverlay');

  if (video && overlayBtn) {
    overlayBtn.addEventListener('click', () => {
      video.style.display = 'block';
      video.play();
      overlayBtn.style.display = 'none';
    });
    video.addEventListener('pause', () => { overlayBtn.style.display='flex'; });
    video.addEventListener('ended', () => { overlayBtn.style.display='flex'; });
  }

  // Global variables
  let currentTypeInterval = null;
  let awaitingEmail = false;
  let isSignupProcess = false;

  // Define site version
  const siteVersion = '1.14.2'; // Set your current site version here

  // Commands and initial messages
  const accessActions = {
    "/SPOTIFY": { type: 'newtab', value: "https://open.spotify.com/artist/7jQfqwxrxEsaPU2C9BiO9X?si=aJAuUgdRSUqD3lAkzS9z1g" },
    "/INSTAGRAM": { type: 'newtab', value: "https://www.instagram.com/darinkirksauvey/" },
    "/TIKTOK": { type: 'newtab', value: "https://www.tiktok.com/@darinkirksauvey" },
    "/TWITCH": { type: 'newtab', value: "https://www.twitch.tv/darinkirksauvey" },
    "/SOUNDCLOUD": { type: 'newtab', value: "https://soundcloud.com/darinkirksauvey/asitiwfse_041725" },
    "/TRASH": { type: 'redirect', value: "asitiwfse.html" },
    "/TOWER": { type: 'redirect', value: "tower.html" },
    "/FISH": { type: 'redirect', value: "fish.html" },
    "/TOUR": { type: 'showdates', value: [
        { text: ">> UPCOMING TOUR DATES:" },
        { text: ">> REDACTED", link: "https://example.com/tickets/roxy" },
        { text: ">> REDACTED", link: "https://example.com/tickets/fillmore" },
        { text: ">> REDACTED", link: "https://example.com/tickets/houseofblues" }
    ]},
    "/SHOWS": { type: 'showdates', value: [
        { text: ">> UPCOMING SHOW DATES:" },
        { text: ">> REDACTED", link: "https://example.com/tickets/roxy" },
        { text: ">> REDACTED", link: "https://example.com/tickets/fillmore" },
        { text: ">> REDACTED", link: "https://example.com/tickets/houseofblues" }
    ]},
    "/INFO": { type: 'info', value: [
        { text: ">> AVAILABLE COMMANDS:" },
        { text: ">> /SIGNUP"},
        { text: ">> /SHOWS" },           
        { text: ">> /SPOTIFY" },
        { text: ">> /INSTAGRAM" },
        { text: ">> /TIKTOK" },
        { text: ">> /TWITCH" },
        { text: ">> /SOUNDCLOUD" },      
    ]},
    "/MORE": { type: 'showdates', value: [
        { text: ">> ADDITIONAL DATES:" },
        { text: ">> REDACTED", link: "https://example.com/tickets/observatory" },
        { text: ">> REDACTED", link: "https://example.com/tickets/websterhall" },
        { text: ">> REDACTED", link: "https://example.com/tickets/foxtheater" }
    ]},
    "/SIGNUP": { type: 'signup' },
    "/DARTH_FENT": { type: 'redirect', value: 'darth_fent.html' },
    "/KLINGHOFFER": { type: 'redirect', value: 'klinghoffer.html' },
    "/GHANDI": { type: 'redirect', value: 'ghandi.html' },
    "/VERSION": { type: 'version' }
  };

  const startMessages = [
    { text: ">> BOOTING..." },
    { text: ">> PLEASE WAIT..." },
    { text: ">> SIGNAL CONNECTED" },
    { text: ">> ACCESS CODE REQUIRED" },
    { text: ">> PLEASE ENTER ACCESS CODE" },
    { text: ">> OR TYPE /INFO FOR MORE" }
  ];

  const typingSpeed = 75;

  // Function to type out a message preserving your typing style
  function typeMessage(msg, callback) {
    if (currentTypeInterval) {
      clearInterval(currentTypeInterval);
      currentTypeInterval = null;
      output.textContent += '\n'; // start new line if interrupted
    }
    let i = 0;
    currentTypeInterval = setInterval(() => {
      if (i < msg.length) {
        output.textContent += msg[i++];
      } else {
        clearInterval(currentTypeInterval);
        currentTypeInterval = null;
        if (callback) callback();
      }
    }, typingSpeed);
  }

  // Function to type multiple messages
  function typeMessages(msgs, callback) {
    let index = 0;
    function next() {
      if (index < msgs.length) {
        const m = msgs[index];
        typeMessage(m.text, () => {
          if (m.link) {
            const a = document.createElement('a');
            a.href = m.link;
            a.textContent = ' [TICKETS]';
            a.style.color = 'cyan';
            a.style.textDecoration = 'underline';
            a.target = '_blank';
            output.appendChild(a);
          }
          output.textContent += '\n';
          index++;
          next();
        });
      } else if (callback) {
        callback();
      }
    }
    next();
  }

  // Focus input
  function showInput() {
    input.focus();
  }

  // Handle user input
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      // Stop current typing effect if ongoing
      if (currentTypeInterval) {
        clearInterval(currentTypeInterval);
        currentTypeInterval = null;
        output.textContent += '\n';
      }

      const userInput = input.value.trim();

      // Handle email signup
      if (awaitingEmail) {
        const email = userInput;
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          fetch("https://assets.mailerlite.com/jsonp/1523977/forms/154454105005229498/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fields: { email: email } })
          }).then(() => {
            typeMessage(">> ACCESS GRANTED\n", () => {
              typeMessage(">> YOUR EMAIL HAS BEEN ADDED.\n");
            });
          }).catch(() => {
            typeMessage(">> ERROR\n", () => {
              typeMessage(">> ENTER ACCESS CODE\n");
            });
          });
        } else {
          typeMessage(">> INVALID\n", () => {
            typeMessage(">> ENTER ACCESS CODE\n");
          });
        }
        awaitingEmail = false;
        input.value = '';
        showInput();
        return;
      }

      // Handle /SIGNUP command
      if (userInput.toUpperCase() === "/SIGNUP") {
        typeMessage(">> PLEASE ENTER YOUR EMAIL:\n", () => {
          awaitingEmail = true;
          isSignupProcess = true;
          input.value = '';
          showInput();
        });
        return;
      }

      // Show user input in output
      output.textContent += `>> ${userInput}\n`;

      const cmd = userInput.toUpperCase();
      const action = accessActions[cmd];

      if (action) {
        if (action.type === 'newtab') {
          typeMessage(">> " + "ACCESS GRANTED\n", () => {
            setTimeout(() => {
              window.open(action.value, '_blank');
              showInput();
            }, 500);
          });
        } else if (action.type === 'redirect') {
          typeMessage(">> " + "ACCESS GRANTED\n", () => {
            setTimeout(() => {
              if (!isSignupProcess && cmd !== "/SIGNUP") {
                window.location.href = action.value;
              }
              showInput();
              isSignupProcess = false;
            }, 500);
          });
        } else if (action.type === 'showdates') {
          typeMessage(">> " + "ACCESS GRANTED\n", () => {
            typeMessages(action.value, () => {
              if (cmd === "/TOUR" || cmd === "/SHOWS") {
                typeMessage(">> TYPE /MORE TO SEE MORE DATES\n", () => {
                  output.textContent += '\n';
                  showInput();
                });
              } else {
                showInput();
              }
            });
          });
        } else if (action.type === 'info') {
          typeMessage(">> " + "ACCESS GRANTED\n", () => {
            typeMessages(action.value, showInput);
          });
        } else if (action.type === 'version') {
          // Handle /VERSION command
          typeMessage(">> ACCESS GRANTED\n", () => {
            // Type out the version
            typeMessage(`>> SITE VERSION: ${siteVersion}\n`, showInput);
          });
        }
      } else {
        // unknown command
        // Changed here: add a newline for clarity
        typeMessage(">> INCORRECT VALUE\n", () => {
          typeMessage(">> PLEASE ENTER ACCESS CODE\n>> OR TYPE /INFO\n", () => {
            output.textContent += '\n'; // optional, for extra spacing
            showInput();
          });
        });
      }

      input.value = '';
    }
  });

  // Start initial messages
  typeMessages(startMessages, showInput);
});
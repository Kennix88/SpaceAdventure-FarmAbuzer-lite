# How to Get Authorization from Any Telegram Mini App
[EN](../en/getInitData.md) | [RU](getInitData.md)

Now let's figure out how to quickly and easily get authorization for any Telegram mini app, such as Blum, Notcoin, Hamster Kombat, or any other, even if it doesn't run in the browser.

### Explanations
Telegram always sends authorization to the mini app. This authorization works on the principle of "login through Telegram". Of course, the mini app and its developers do not have access to the Telegram account itself!

Developers of the mini app or third-party programs for them only have access to the mini app itself, but not to Telegram.

Now that we've discussed these points, let's get down to business.

---

### 1.1 Web Version of Telegram
To get started, you need to go to the web version of Telegram.

- Go to the website
- Log in to the desired account
- Go to the desired chat with the bot

### 1.2 Using Our Browser Extension
Then you can use our special browser extension with open source code, written by us. The link to the extension is [here](https://chromewebstore.google.com/detail/telegram-mini-app-auth-ex/fjmkmlebpiodjmkpbpblflpgkmojigpm).

It is completely safe, has passed Google's verification before entering their store, and has open source code. The extension does not perform any actions other than its intended purpose.

Install it in your browser, then go to the Telegram tab and refresh the page for the extension to work.

### 2 Run the Mini App
Run the mini app.

This is something like a "Run" button in the chat, or just a side menu button (to the left of the message input area). Here, I think you know what to do.

### 3.1 Getting the Authorization String with the Extension
If you are using the extension, simply open it and click "Check", then copy the authorization string using the "Copy" button.

![Extension Interface](../assets/getInitData1.png)

Extension Interface

![Extension Interface with Obtained Authorization](../assets/getInitData2.png)

Extension Interface with Obtained Authorization

### 3.2 Getting the Authorization String Manually
If you don't want to install the extension, you can get the authorization string manually. To do this:

- Right-click on the opened window and select "View code" (or simply press F12 to go to the developer tools)
- Press Ctrl + F to enable search
- In the search, enter: iframe

As a result, you will get approximately the following picture:

![What the Authorization String Looks Like in Developer Tools](../assets/getInitData3.png)

What the Authorization String Looks Like in Developer Tools

Right-click on the found iframe element and select "Copy link address":

![What the Authorization String Looks Like in Developer Tools](../assets/getInitData4.png)

What the Panel for Copying the Link Looks Like in Developer Tools

---

### Done!
Now you have the authorization link.
# Integrated Terminal
Press Ctrl + @ to open/hide.
Press ctrl+d to kill a process. If all processes are killed, integrated terminal automatically closes.

Visit [Global Settings](https://github.com/0xsuk/agitcms/blob/main/Settings.md#global-settings) for how to disable Ctrl + @ key binding.

Click + button to add an instance.

If you navigate to Home while integrated terminal is open, all instances will be inaccesible, but still be running in the background.

Things to note
- If you are on windows, powershell will be used. If you are unix, default shell (`echo $SHELL`) will be used.  
- Using zsh and annoyed by its auto suggestion? Me too. Just bear with me or use bash. (or open a pull request)  
- You want integrated terminal to go to the directory Agit is currently in? Me too. URL contains `path` parameter, and I copy it every time I want to `cd` to the current directory. I think simple javascript browser extension would do, so not going to work on this for now. Maybe I should let Agit to set `AGIT_CWD` shell variable each time Agit changes directory.

![](https://github.com/0xsuk/agitcms/blob/main/github/localhost_3131_9.png)

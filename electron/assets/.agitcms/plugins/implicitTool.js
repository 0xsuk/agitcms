new ToolbarItem({
  initialChar: "", //set no initialChar to represent Implicit tool
  run: () => {
    alert(
      "Implicit tool is not displayed in the toolbar, but can be invoked by keyAlias. Use this if you are sick of clicking item in the toolbar"
    );
  },
  keyAlias: "Ctrl-n",
});

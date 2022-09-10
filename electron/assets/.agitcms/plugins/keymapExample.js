new TransactionFilter({
  map: new Map([
    ["＃", "#"], //mapping japanese # to english #
    ["　", " "], //mapping japanese space to english space
    ["\n", "  \n"], //mapping \n to space+space+\n
  ]),
});

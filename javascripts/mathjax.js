window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true
  },
  options: {
    ignoreHtmlClass: ".*",
    processHtmlClass: "arithmatex"
  }
};

document$.subscribe(() => {
  MathJax.startup.promise.then(() => {
    MathJax.typesetClear();
    MathJax.texReset();
    MathJax.typesetPromise();
  }).catch((err) => console.log(err));
});

//! our documente and main.css loades before the imported css files so we need to check or wait to get those variables

const rootStyles = window.getComputedStyle(document.documentElement);

if (
  rootStyles.getPropertyValue("--book-cover-width-large") != null &&
  rootStyles.getPropertyValue("--book-cover-width-large") !== ""
) {
  ready();
} else {
  document.getElementById("main-css").addEventListener("load", ready);//! gets the link tag in layout.ejs to check if main-css is loaded
}

function ready() {
  //* getPropertyValue() returns a string
  const coverWidth = parseFloat(rootStyles.getPropertyValue("--book-cover-width-large"));
  const coverAspectRatio = parseFloat(rootStyles.getPropertyValue("--book-cover-aspect-ratio"));
  const coverHeight = coverWidth / coverAspectRatio;
  
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
  );

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / coverAspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight,
  });

  FilePond.parse(document.body);
}

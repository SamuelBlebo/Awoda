// navigation.goBack() throws a dev warning (and does nothing) when the
// current screen has no previous entry to pop back to — e.g. reached via a
// dev reload that reset navigation state, or any future entry point that
// isn't a normal push from Home. Falling back to the main tabs keeps every
// "back"/"done" action safe regardless of how the screen was reached.
export function goBackOrHome(navigation) {
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigation.navigate("MainTabs");
  }
}

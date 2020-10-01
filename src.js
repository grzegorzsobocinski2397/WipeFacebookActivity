console.clear();
console.log("\nStarting...");

// Using a value below 500 usually breaks the requests.
let DELAY_TIME_IN_MS = 500;
// Popup with actions for an activity. 'Remove', 'hide', 'remove your vote' and so on.
let POPUP_BOX_SELECTOR = ".j34wkznp.qp9yad78.pmk7jnqg.kr520xx4";
// Container of the activity.
let ACTIVITY_DIV_SELECTOR = ".aov4n071 > .kvgmc6g5 > .l9j0dhe7";
// Icon inside the container. Opens up a popup with actions.
let ACTIVITY_ICON_SELECTOR = ".l9j0dhe7 .hu5pjgll.lzf7d6o1.sp_fDmBvoTd0yc_1_5x.sx_8f4ba6";
// Icon for 'remove' action.
let TRASH_ICON_SELECTOR = ".hu5pjgll.lzf7d6o1.sp_iAK0KBqKNuh_1_5x.sx_6afae4";
// Icon for 'remove like' action.
let LIKE_ICON_SELECTOR = ".hu5pjgll.lzf7d6o1.sp_qcW4BCmTZXW_1_5x.sx_abe26e";
// Icon for 'hide from timeline' action.
let HIDE_ICON_SELECTOR = ".hu5pjgll.lzf7d6o1.sp_OuY-57YF-w7_1_5x.sx_036ca2";
// Icon for 'remove vote' action.
let REMOVE_VOTE_ICON_SELECTOR = ".hu5pjgll.lzf7d6o1.sp_qcW4BCmTZXW_1_5x.sx_4fcb3d";
// Button inside of the dialog window that shows up when there was a bad request.
let ERROR_BUTTON_SELECTOR =
  ".oajrlxb2.s1i5eluu.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.pq6dq46d.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.cxgpxx05.d1544ag0.sj5x9vvc.tw6a2znq.oqcyycmt.esuyzwwr.f1sip0of.lzcic4wl.l9j0dhe7.abiwlrkh.p8dawk7l.ehryuci6.bp9cbjyn.beltcj47.p86d2i9g.aot14ch1.kzx2olss.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.lrazzd5p.gigivrx4.sf5mxxl7.g0qnabr5.lrwzeq9o.iqfcb0g7.lsqurvkf.id6903cd.jq4qci2q.m5l1wtfr.taijpn5t.sn7ne77z.oqhjfihn.bwm1u5wc";
// Text for 'hide from timeline' or 'show on timeline'.
let ACTION_TEXT_SELECTOR = ".d2edcug0";
// Grandparent of the icon. Used for quick access to action_text_selector.
let GRANDPARENT_ICON_SELECTOR =
  ".q5bimw55.rpm2j7zs.k7i0oixp.gvuykj2m.j83agx80.cbu4d94t.ni8dbmo4.eg9m0zos.l9j0dhe7.du4w35lb.ofs802cu.pohlnb88.dkue75c7.mb9wzai9.l56l04vs.r57mb794.kh7kg01d.c3g1iek1.gs1a9yip.cxgpxx05.rz4wbd8a.sj5x9vvc.a8nywdso.geg40m2u";
// Amount of actions that ended with an error and a dialog window.
let badRequestsCount = 0;

let startTime = Date.now();

startRemoving();

function startRemoving() {
  const iconElements = document.querySelectorAll(ACTIVITY_ICON_SELECTOR);
  iconElements.length === 0 ? finishRemoving() : continueRemoving(iconElements);
}

function finishRemoving() {
  logMessage(`Finished. There were ${badRequestsCount} bad requests.`);
  console.log(`Time: ${(Date.now() - startTime) / 1000}s`);
}

function continueRemoving(iconElements) {
  checkErrorButton();
  removeActivity(iconElements);
}

/**
 * Sometimes there is a bad request and a dialog window is displayed. This will close the dialog window and count it as a bad request.
 */
function checkErrorButton() {
  const errorButton = document.querySelector(ERROR_BUTTON_SELECTOR);
  if (errorButton !== null) {
    logMessage("Bad request. Skipping.");
    errorButton.click();
    badRequestsCount += 1;
  }
}

function removeActivity(iconElements) {
  if (iconElements[0] !== undefined) {
    iconElements[0].click();
    delay(DELAY_TIME_IN_MS)
      .then(() => handleAction())
      .then(() => startRemoving());
  }
}

/**
 * Handle action based on the icon.
 */
function handleAction() {
  const trashIconElement = document.querySelector(TRASH_ICON_SELECTOR);
  const likeIconElement = document.querySelector(LIKE_ICON_SELECTOR);
  const hideIconElement = document.querySelector(HIDE_ICON_SELECTOR);
  const removeVoteIconElement = document.querySelector(REMOVE_VOTE_ICON_SELECTOR);

  if (trashIconElement !== null) {
    clickRemoveIcon(trashIconElement);
  } else if (likeIconElement !== null) {
    clickRemoveIcon(likeIconElement);
  } else if (hideIconElement !== null) {
    clickHideIcon(hideIconElement);
  } else if (removeVoteIconElement !== null) {
    clickRemoveIcon(removeVoteIconElement);
  } else {
    removeActivityContainer();
    logMessage("Unknown action. Skipping.");
  }
}

/**
 * Click trash icon, which removes activity.
 */
function clickRemoveIcon(trashIconElement) {
  trashIconElement.click();
  logMessage(`Removed activity.`);
  removePopup(trashIconElement);
}

/**
 * Click hide icon, which is a toggle. Remove the container box.
 */
function clickHideIcon(hideIconElement) {
  const isVisible = hideIconElement.closest(GRANDPARENT_ICON_SELECTOR).querySelector(ACTION_TEXT_SELECTOR).innerText === "Hide from Timeline";
  if (isVisible) {
    hideIconElement.click();
  }

  const message = isVisible ? "Activity hidden." : "Activity already hidden. Skipping.";
  logMessage(message);
  removeActivityContainer();
  removePopup(hideIconElement);
}

/**
 * Remove popup with the icon. This will allow us to execute faster, because we are removing duplicates.
 */
function removePopup(iconElement) {
  const boxElement = iconElement.closest(POPUP_BOX_SELECTOR);
  if (boxElement !== null) {
    boxElement.remove();
  }
}

/**
 * Removes the activity <div> container, so another one can be handled.
 */
function removeActivityContainer() {
  const activityContainer = document.querySelector(ACTIVITY_DIV_SELECTOR);
  if (activityContainer !== null) {
    activityContainer.remove();
  }
}

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function logMessage(message) {
  console.log(`${(Date.now() - startTime) / 1000}s: ${message}`);
}

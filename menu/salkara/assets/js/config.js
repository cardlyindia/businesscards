/*
 * SALKARA site settings. Change values here; no other file needs editing.
 */

/* Cardly promotion popup: "Y" = show it, "N" = never show it */
var SHOW_ADD = "Y";

var SALKARA_CONFIG = {
  ad: {
    url: "https://cardly.in/starvithura/",
    firstDelaySec: [12, 25],   // first popup appears at a random time in this range after the page opens
    intervalSec: [90, 180],    // later popups: random gap between these values
    maxPerVisit: 3             // never more than this many popups per browsing session
  }
};

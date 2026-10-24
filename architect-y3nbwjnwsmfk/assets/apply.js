// The Apply controls' date guard. Applications land in a Tally form (JI-565.3), so this site holds no form and sends
// nothing: each Apply control on the offer page is a link to the form's address once he creates it, and a disabled
// button until then. Copy build condition 2: with a start date (data-closes, YYYY-MM-DD) the controls close on that
// day, by the reader's own calendar. Round 3's fix of the page-2 codex review's finding 1 carries over to the link: the
// date is read at load, when the page comes back into view, once a minute while it stays open, and again at the moment
// of the click, before the browser leaves the page, so a page opened before the start date cannot open the form after
// it. Each check runs only where the browser offers it. The Tally form keeps its own close (APPLY.md section 6).
(function () {
  var ids = ["apply-hero", "apply-places"];
  var controls = [];
  for (var i = 0; i < ids.length; i++) {
    var c = document.getElementById(ids[i]);
    if (c) controls.push(c);
  }
  if (!controls.length) return;
  var closes = controls[0].getAttribute("data-closes") || "";
  var closed = document.getElementById("closed");

  function today() {
    var d = new Date();
    var two = function (n) { return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + two(d.getMonth() + 1) + "-" + two(d.getDate());
  }

  function isShut() { return !!closes && today() >= closes; }

  function shutNow() {
    for (var j = 0; j < controls.length; j++) controls[j].hidden = true;
    if (closed) closed.hidden = false;
  }

  function recheck() { if (isShut()) shutNow(); }

  if (isShut()) shutNow();
  if (closes) {
    if (typeof document.addEventListener === "function") document.addEventListener("visibilitychange", recheck);
    if (typeof setInterval === "function") setInterval(recheck, 60000);
  }
  for (var k = 0; k < controls.length; k++) {
    controls[k].addEventListener("click", function (e) {
      if (isShut()) { e.preventDefault(); shutNow(); }
    });
  }
})();

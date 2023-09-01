import "./utils/navigo_Edited.js"
import { setActiveLink, 
    adjustForMissingHash, 
    renderTemplate, 
    loadHtml } from "./utils/utils.js"
import { initHome } from "./pages/home/index.js"
import { initFaq } from "./pages/faq/index.js"
import { initTeam } from "./pages/team/index.js"

window.addEventListener("load", async () => {

    const templateHome = await loadHtml("./pages/home/index.html")
    const templateFaq = await loadHtml("./pages/faq/index.html")
    const templateTeam = await loadHtml("./pages/team/index.html")
    const templateNotFound = await loadHtml("./pages/error/index.html")
  
    adjustForMissingHash()
  
    const router = new Navigo("/", { hash: true });
    window.router = router
  
    router
      .hooks({
        before(done, match) {
          setActiveLink("topnav", match.url);
          done();
        }
      })
      .on({
        "/": () => {
          renderTemplate(templateHome, "content");
          initHome();
        },
        "/faq": () => {
          renderTemplate(templateFaq, "content");
          initFaq();
        },
        "/team": (match) => {
          renderTemplate(templateTeam, "content");
          initTeam();
        }
      })
      .notFound(() => {
        renderTemplate(templateNotFound, "content")
      })
      .resolve()
  });
  window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
    alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
      + ' Column: ' + column + ' StackTrace: ' + errorObj);
  }
  
  
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function crawlPage(currentURL) {
  console.log(`actively crawling: ${currentURL}`);
  try {
    const response = await fetch(currentURL);

    if (response.status > 399) {
      console.log(
        `Error in fetch with status code: ${response.status} on page ${currentURL}  `
      );
      return;
    }

    const contentType = response.headers.get("content-type");

    if (!contentType.includes("text/html")) {
      console.log(
        `Non html response, content type : ${contentType}, on page: ${currentURL}`
      );
      return;
    }
    // We are expacting response body to be html not json, that's why we will parse it as text !
    console.log(await response.text());
  } catch (error) {
    console.log(`Error in fetch:${error.message}, on page ${currentURL} `);
  }
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      // relative
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);

        urls.push(urlObj.href);
      } catch (error) {
        console.log(`error with relative url: ${error.message}`);
      }
    } else {
      // absolute
      try {
        const urlObj = new URL(`${linkElement.href}`);

        urls.push(urlObj.href);
      } catch (error) {
        console.log(`error with absolute url: ${error.message}`);
      }
    }
  }

  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.endsWith("/")) {
    return hostPath.slice(0, -1);
  }

  return hostPath;
}

normalizeURL("https://google.com/hello");

module.exports = { normalizeURL, getURLsFromHTML, crawlPage };

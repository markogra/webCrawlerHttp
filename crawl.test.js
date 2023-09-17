const { normalizeURL, getURLsFromHTML } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("normalizeUrl strip protocol", function () {
  const input = "https://blog.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeUrl strip trailing /", function () {
  const input = "https://blog.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeUrl capitalize", function () {
  const input = "https://BLOG.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeUrl strip http", function () {
  const input = "http://blog.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML absolute", function () {
  const inputHTMLBody = `
    <html>
      <body>
        <a href="https://blog.boot.dev/path/">
          Boot.dev Blog
        </a>
        
      </body
    </html>
  `;
  const inputBaseURL = "https://blog.boot.dev/path/";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative", function () {
  const inputHTMLBody = `
    <html>
      <body>
        <a href="/path/">
          Boot.dev Blog
        </a>
        
      </body
    </html>
  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML both", function () {
  const inputHTMLBody = `
    <html>
      <body>
        <a href="https://blog.boot.dev/path1/">
          Boot.dev Blog Path 1
        </a>
        <a href="/path2/">
          Boot.dev Blog Path 2
        </a>
      </body
    </html>
  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [
    "https://blog.boot.dev/path1/",
    "https://blog.boot.dev/path2/",
  ];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML both", function () {
  const inputHTMLBody = `
    <html>
      <body>      
        <a href="invalid">
          Invalid URL 
        </a>
      </body
    </html>
  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});

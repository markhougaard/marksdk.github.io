const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const embedYouTube = require("eleventy-plugin-youtube-embed");
const fs = require("fs");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {

  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addWatchTarget("./src/_sass/");
  eleventyConfig.addWatchTarget("./src/assets/");
  eleventyConfig.addWatchTarget("./src/style/");
  eleventyConfig.addPassthroughCopy({ "src/assets" : "assets" });
  eleventyConfig.addPassthroughCopy({ "src/style" : "style" });
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(embedYouTube);
  // Provides syntax highlighting
  eleventyConfig.addPlugin(syntaxHighlight, {
    templateFormats: ["md"],
    alwaysWrapLineHighlights: false,
  });
  eleventyConfig.setBrowserSyncConfig({
    ui: false,
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync("site/404.html");
          // Provides the 404 content without redirect.
          res.write(content_404);
          // Add 404 http status code in request header.
          // res.writeHead(404, { "Content-Type": "text/html" });
          res.writeHead(404);
          res.end();
        });
      },
    },
  });
  // Populates all headings with an id attribute
  const markdownIt = require("markdown-it");
  const markdownItAnchor = require("markdown-it-anchor");
  const markdownLib = markdownIt({ html: true }).use(markdownItAnchor);
  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.addCollection("published", function (collectionApi) {
    return [...collectionApi.getFilteredByGlob("./src/**/*.md")].filter(
      (post) => !post.data.draft
    );
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "site",
      data: "_data"
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};

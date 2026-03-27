var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-personal-homepage.js
  var import_personal_homepage_exports = {};
  __export(import_personal_homepage_exports, {
    default: () => import_personal_homepage_default
  });

  // tools/importer/parsers/carousel.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".hero.textimage.parbase");
    const slideElements = slides.length > 0 ? Array.from(slides) : [element];
    const cells = [];
    slideElements.forEach((slide) => {
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      const image = slide.querySelector(".focuspoint img, .hero-frame img, img");
      if (image) {
        const pic = document.createElement("picture");
        const img = document.createElement("img");
        img.src = image.src || image.getAttribute("src") || "";
        img.alt = image.alt || image.getAttribute("alt") || "";
        pic.appendChild(img);
        imageCell.appendChild(pic);
      }
      const contentCell = document.createDocumentFragment();
      contentCell.appendChild(document.createComment(" field:content_text "));
      const textContainer = slide.querySelector(".hero__default.hero__info, .hero__info");
      if (textContainer) {
        const heading = textContainer.querySelector("h1, h2, h3");
        if (heading) {
          const h = document.createElement(heading.tagName.toLowerCase());
          h.textContent = heading.textContent.trim();
          contentCell.appendChild(h);
        }
        const textBlocks = textContainer.querySelectorAll(".text.parbase");
        textBlocks.forEach((textBlock) => {
          const paras = textBlock.querySelectorAll("p");
          paras.forEach((p) => {
            const text = p.textContent.trim();
            if (!text || text === "\xA0") return;
            if (p.querySelector("a.btn, a.btn--white, a.btn--blue")) return;
            const newP = document.createElement("p");
            newP.textContent = text;
            contentCell.appendChild(newP);
          });
        });
        const ctas = textContainer.querySelectorAll("a.btn, a.btn--white, a.btn--blue");
        ctas.forEach((cta) => {
          const href = cta.href || cta.getAttribute("href") || "";
          const a = document.createElement("a");
          a.href = href;
          a.textContent = cta.textContent.trim();
          const ctaP = document.createElement("p");
          ctaP.appendChild(a);
          contentCell.appendChild(ctaP);
        });
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
    const items = element.querySelectorAll("li.inpage-nav__link");
    const cells = [];
    items.forEach((item) => {
      const link = item.querySelector("a");
      if (!link) return;
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      const icon = item.querySelector(".inpage-nav__svg-icon img, .inpage-nav__link-icon img");
      if (icon) {
        const pic = document.createElement("picture");
        const img = document.createElement("img");
        img.src = icon.src || icon.getAttribute("src") || "";
        img.alt = icon.alt || icon.getAttribute("alt") || "";
        pic.appendChild(img);
        imageCell.appendChild(pic);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      const linkText = item.querySelector(".inpage-nav__link-text");
      const a = document.createElement("a");
      a.href = link.href || link.getAttribute("href") || "";
      a.textContent = linkText ? linkText.textContent.trim() : link.textContent.trim();
      const p = document.createElement("p");
      p.appendChild(a);
      textCell.appendChild(p);
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse3(element, { document }) {
    const cells = [];
    const mainCol = element.querySelector(".container__items.container__main");
    const asideCol = element.querySelector(".container__items.container__aside");
    if (mainCol && asideCol) {
      const leftCell = extractColumnContent(mainCol, document);
      const rightCell = extractColumnContent(asideCol, document);
      cells.push([leftCell, rightCell]);
    } else if (mainCol) {
      const colItems = mainCol.querySelectorAll(":scope .container__item.container__main__element");
      if (colItems.length > 1) {
        const row = [];
        colItems.forEach((col) => {
          row.push(extractColumnContent(col, document));
        });
        cells.push(row);
      } else {
        cells.push([extractColumnContent(mainCol, document)]);
      }
    } else {
      cells.push([extractColumnContent(element, document)]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }
  function extractColumnContent(container, document) {
    const frag = document.createDocumentFragment();
    const images = container.querySelectorAll("img");
    images.forEach((img) => {
      const src = img.src || img.getAttribute("src") || "";
      if (!src || src.includes("spacer") || src.includes("1x1")) return;
      const pic = document.createElement("picture");
      const newImg = document.createElement("img");
      newImg.src = src;
      newImg.alt = img.alt || img.getAttribute("alt") || "";
      pic.appendChild(newImg);
      frag.appendChild(pic);
    });
    const textBlocks = container.querySelectorAll(".text.parbase, .text");
    textBlocks.forEach((textBlock) => {
      const headings = textBlock.querySelectorAll("h1, h2, h3, h4, h5, h6");
      headings.forEach((h) => {
        const newH = document.createElement(h.tagName.toLowerCase());
        newH.textContent = h.textContent.trim();
        if (newH.textContent) frag.appendChild(newH);
      });
      const paras = textBlock.querySelectorAll("p");
      paras.forEach((p) => {
        const text = p.textContent.trim();
        if (!text || text === "\xA0") return;
        const newP = document.createElement("p");
        const badge = p.querySelector(".pill--text--dark, .pill--text");
        if (badge) {
          const strong = document.createElement("strong");
          strong.textContent = badge.textContent.trim();
          newP.appendChild(strong);
          frag.appendChild(newP);
          return;
        }
        const btn = p.querySelector("a.btn, a.btn--blue, a.btn--transparent");
        if (btn) {
          const a = document.createElement("a");
          a.href = btn.href || btn.getAttribute("href") || "";
          a.textContent = btn.textContent.trim();
          newP.appendChild(a);
          frag.appendChild(newP);
          return;
        }
        const links = p.querySelectorAll("a");
        if (links.length > 0) {
          const linkText = Array.from(links).map((l) => l.textContent.trim()).join("");
          const fullText = text.replace(/\s+/g, " ");
          const isLinkOnly = fullText === linkText.replace(/\s+/g, " ");
          if (isLinkOnly) {
            const link = links[0];
            const a = document.createElement("a");
            a.href = link.href || link.getAttribute("href") || "";
            a.textContent = link.textContent.trim();
            newP.appendChild(a);
          } else {
            newP.innerHTML = p.innerHTML;
          }
          frag.appendChild(newP);
          return;
        }
        newP.textContent = text;
        frag.appendChild(newP);
      });
      const lists = textBlock.querySelectorAll("ul");
      lists.forEach((ul) => {
        const newUl = document.createElement("ul");
        const items = ul.querySelectorAll("li");
        items.forEach((li) => {
          const text = li.textContent.trim();
          if (text) {
            const newLi = document.createElement("li");
            newLi.textContent = text;
            newUl.appendChild(newLi);
          }
        });
        if (newUl.hasChildNodes()) frag.appendChild(newUl);
      });
    });
    if (!frag.hasChildNodes()) {
      const text = container.textContent.trim();
      if (text) {
        const p = document.createElement("p");
        p.textContent = text;
        frag.appendChild(p);
      }
    }
    return frag;
  }

  // tools/importer/parsers/accordion.js
  function parse4(element, { document }) {
    const cells = [];
    const headingEl = element.querySelector(".accordion__heading .accordion__span, .accordion__heading");
    const mainHeading = headingEl ? headingEl.textContent.trim() : "Important information";
    const content = element.querySelector(".accordion__content");
    if (!content) {
      const summaryCell = document.createDocumentFragment();
      summaryCell.appendChild(document.createComment(" field:summary "));
      summaryCell.appendChild(document.createTextNode(mainHeading));
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      cells.push([summaryCell, textCell]);
      const block2 = WebImporter.Blocks.createBlock(document, { name: "accordion", cells });
      element.replaceWith(block2);
      return;
    }
    const generalContent = document.createDocumentFragment();
    const childNodes = Array.from(content.children);
    const disclaimerDiv = content.querySelector("#disclaimer");
    for (const child of childNodes) {
      if (child.id === "disclaimer") break;
      if (child.tagName === "P" || child.tagName === "DIV") {
        const text = child.textContent.trim();
        if (text && text !== "\xA0") {
          const p = document.createElement("p");
          const links = child.querySelectorAll("a");
          if (links.length > 0) {
            p.innerHTML = child.innerHTML;
          } else {
            p.textContent = text;
          }
          generalContent.appendChild(p);
        }
      }
    }
    if (generalContent.hasChildNodes()) {
      const summaryCell = document.createDocumentFragment();
      summaryCell.appendChild(document.createComment(" field:summary "));
      summaryCell.appendChild(document.createTextNode(mainHeading));
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      textCell.appendChild(generalContent);
      cells.push([summaryCell, textCell]);
    }
    if (disclaimerDiv) {
      const disclaimerItems = disclaimerDiv.querySelectorAll(":scope > div[id]");
      disclaimerItems.forEach((item) => {
        const disclaimerId = item.id;
        const summaryText = disclaimerId.replace(/_content_anzcomau_en_reusable_/g, "").replace(/_/g, " ").replace(/^personal\s+/, "").replace(/^waystobank\s+/, "").replace(/disclaimers?\s*/g, "").trim();
        const summaryCell = document.createDocumentFragment();
        summaryCell.appendChild(document.createComment(" field:summary "));
        summaryCell.appendChild(document.createTextNode(summaryText || disclaimerId));
        const textCell = document.createDocumentFragment();
        textCell.appendChild(document.createComment(" field:text "));
        const contentDiv = document.createElement("div");
        contentDiv.id = disclaimerId;
        const paras = item.querySelectorAll("p");
        paras.forEach((p) => {
          const text = p.textContent.trim();
          if (!text || text === "\xA0") return;
          const newP = document.createElement("p");
          const links = p.querySelectorAll("a");
          if (links.length > 0) {
            newP.innerHTML = p.innerHTML;
          } else {
            newP.textContent = text;
          }
          contentDiv.appendChild(newP);
        });
        const returnLink = item.querySelector("a.back-to-origin");
        if (returnLink) {
          const a = document.createElement("a");
          a.href = returnLink.href || "#";
          a.className = "back-to-origin";
          a.textContent = "Return";
          const returnP = document.createElement("p");
          returnP.appendChild(a);
          contentDiv.appendChild(returnP);
        }
        textCell.appendChild(contentDiv);
        cells.push([summaryCell, textCell]);
      });
    }
    if (cells.length === 0) {
      const summaryCell = document.createDocumentFragment();
      summaryCell.appendChild(document.createComment(" field:summary "));
      summaryCell.appendChild(document.createTextNode(mainHeading));
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      textCell.appendChild(content);
      cells.push([summaryCell, textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/fragment.js
  function parse5(element, { document }) {
    let fragmentPath = "";
    if (element.classList.contains("butter-bar") || element.closest(".butter-bar")) {
      fragmentPath = "/content/fragments/alert-banner";
    } else if (element.classList.contains("box--pale-blue") || element.closest(".box--pale-blue")) {
      fragmentPath = "/content/fragments/court-notice";
    } else {
      fragmentPath = "/content/fragments/unknown-fragment";
    }
    const cells = [];
    const refCell = document.createDocumentFragment();
    refCell.appendChild(document.createComment(" field:reference "));
    const a = document.createElement("a");
    a.href = fragmentPath;
    a.textContent = fragmentPath;
    refCell.appendChild(a);
    cells.push([refCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "fragment", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/anz-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#CybotCookiebotDialog",
        ".lpSS_18942001799",
        "#lpButtonDiv",
        'iframe[title="Adobe ID Syncing iFrame"]',
        'iframe[title="Intentionally blank"]',
        ".overlay"
      ]);
      element.querySelectorAll('a[href^="/"]').forEach((a) => {
        const href = a.getAttribute("href");
        if (href && href.startsWith("/") && !href.startsWith("//")) {
          a.setAttribute("href", `https://www.anz.com.au${href}`);
        }
      });
      element.querySelectorAll('img[src^="/content/"]').forEach((img) => {
        const src = img.getAttribute("src");
        if (src) {
          img.setAttribute("src", `https://www.anz.com.au${src}`);
        }
      });
      element.querySelectorAll(".invisibleMbox").forEach((el) => {
        while (el.firstChild) {
          el.parentNode.insertBefore(el.firstChild, el);
        }
        el.remove();
      });
      WebImporter.DOMUtils.remove(element, [
        "header",
        "nav",
        "footer",
        ".header",
        ".navigation",
        ".desktop-menu",
        ".mobile-menu",
        ".mobile",
        ".primary__nav",
        ".secondary__nav",
        ".subNav",
        ".logonbox",
        ".siteSearch",
        ".backtotop",
        "#skiplinks",
        "#skiptocontent"
      ]);
      element.querySelectorAll('a[href="#skip_logon"], a[href="#main_skip"]').forEach((a) => {
        const parent = a.parentElement;
        a.remove();
        if (parent && parent.tagName === "P" && !parent.textContent.trim()) {
          parent.remove();
        }
      });
      const main = element.querySelector("main");
      if (main) {
        const mainChildren = [];
        while (main.firstChild) {
          mainChildren.push(main.removeChild(main.firstChild));
        }
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        mainChildren.forEach((child) => element.appendChild(child));
      }
      const mainSkip = element.querySelector("#main_skip");
      if (mainSkip) {
        while (mainSkip.firstChild) {
          mainSkip.parentNode.insertBefore(mainSkip.firstChild, mainSkip);
        }
        mainSkip.remove();
      }
      const mainContainer = element.querySelector("#main-container");
      if (mainContainer) {
        while (mainContainer.firstChild) {
          mainContainer.parentNode.insertBefore(mainContainer.firstChild, mainContainer);
        }
        mainContainer.remove();
      }
      element.querySelectorAll(".at-element-marker").forEach((el) => {
        while (el.firstChild) {
          el.parentNode.insertBefore(el.firstChild, el);
        }
        el.remove();
      });
      WebImporter.DOMUtils.remove(element, [
        ".newpar",
        ".iparys_inherited",
        ".end",
        "noscript"
      ]);
      element.querySelectorAll("script").forEach((s) => s.remove());
      element.querySelectorAll("*").forEach((el) => {
        const text = el.textContent.trim();
        if (text === "End of mobile menu. Close mobile menu" || text === "End of mobile menu") {
          el.remove();
        }
      });
      element.querySelectorAll(".text.parbase").forEach((tp) => {
        const imgs = tp.querySelectorAll("img");
        const hasLineImg = Array.from(imgs).some((img) => {
          const src = (img.getAttribute("src") || "").toLowerCase();
          return src.includes("line");
        });
        const textContent = tp.textContent.trim().replace(/\u00a0/g, "");
        if (hasLineImg && !textContent) {
          tp.remove();
        }
      });
      element.querySelectorAll("img").forEach((img) => {
        const src = (img.getAttribute("src") || "").toLowerCase();
        if (src.includes("line") && (src.includes("divider") || src.includes("/line"))) {
          if (!img.closest(".hero") && !img.closest(".textimage")) {
            const parent = img.parentElement;
            if (parent && parent.tagName === "P" && parent.children.length === 1) {
              parent.remove();
            } else {
              img.remove();
            }
          }
        }
      });
      element.querySelectorAll("p").forEach((p) => {
        if (!p.textContent.trim() && !p.querySelector("img, a, picture")) {
          p.remove();
        }
      });
      element.querySelectorAll(".columns, .text.parbase").forEach((div) => {
        if (!div.textContent.trim() && !div.querySelector("img, a, picture, table")) {
          div.remove();
        }
      });
    }
    if (hookName === TransformHook.afterTransform) {
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("data-track-category");
        el.removeAttribute("data-track-action");
        el.removeAttribute("data-track-label");
        el.removeAttribute("onclick");
        el.removeAttribute("data-sly-test");
        el.removeAttribute("data-sly-include");
        el.removeAttribute("data-sly-unwrap");
      });
      element.querySelectorAll('a[href*="mboxid="], a[href*="adobe_mc="]').forEach((a) => {
        const href = a.getAttribute("href");
        if (href && !href.includes("pid=")) {
          try {
            const url = new URL(href, "https://www.anz.com.au");
            url.searchParams.delete("mboxid");
            url.searchParams.delete("adobe_mc");
            a.setAttribute("href", url.toString());
          } catch (e) {
          }
        }
      });
      WebImporter.DOMUtils.remove(element, [
        ".hero__breadcrumb",
        ".extra",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/anz-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.beforeTransform) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      const processedElements = /* @__PURE__ */ new Set();
      let firstSectionFound = false;
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          try {
            const matches = element.querySelectorAll(sel);
            for (const match of matches) {
              if (!processedElements.has(match)) {
                sectionEl = match;
                break;
              }
            }
          } catch (e) {
          }
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        processedElements.add(sectionEl);
        let topLevel = sectionEl;
        while (topLevel.parentElement && topLevel.parentElement !== element) {
          topLevel = topLevel.parentElement;
        }
        if (topLevel.parentElement !== element) continue;
        if (firstSectionFound) {
          const hr = document.createElement("hr");
          element.insertBefore(hr, topLevel);
        }
        firstSectionFound = true;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (topLevel.nextSibling) {
            element.insertBefore(metaBlock, topLevel.nextSibling);
          } else {
            element.appendChild(metaBlock);
          }
        }
      }
    }
  }

  // tools/importer/import-personal-homepage.js
  var parsers = {
    "carousel": parse,
    "cards": parse2,
    "columns": parse3,
    "accordion": parse4,
    "fragment": parse5
  };
  var PAGE_TEMPLATE = {
    name: "personal-homepage",
    description: "ANZ Personal Banking homepage - consumer-facing entry point with hero carousel, product links, financial tools, app promotion, support resources, and regulatory disclaimers",
    urls: [
      "https://www.anz.com.au/personal/"
    ],
    blocks: [
      {
        name: "carousel",
        instances: [".hero--container", ".herocontainer"]
      },
      {
        name: "cards",
        instances: [".container--four-columns .inpage-nav__links", ".inpage-nav--calcs"]
      },
      {
        name: "columns",
        instances: [
          ".container--four.box--white.container--three-columns",
          ".container--matchheight.container--eightfour",
          ".container--matchheight.container--four.container--three-columns"
        ]
      },
      {
        name: "accordion",
        instances: [".accordion.accordion--open"]
      },
      {
        name: "fragment",
        instances: [".butter-bar", ".box--pale-blue"]
      }
    ],
    sections: [
      {
        id: "section-alert-banner",
        name: "Alert Banner",
        selector: ".butter-bar",
        style: "grey",
        blocks: ["fragment"],
        defaultContent: [".butter-bar__content"]
      },
      {
        id: "section-header",
        name: "Global Header",
        selector: "header.header",
        style: null,
        blocks: ["header"],
        defaultContent: []
      },
      {
        id: "section-hero-carousel",
        name: "Hero Carousel",
        selector: ".hero--container",
        style: null,
        blocks: ["carousel"],
        defaultContent: []
      },
      {
        id: "section-banking-with-anz",
        name: "Banking with ANZ",
        selector: ".container--four-columns",
        style: null,
        blocks: ["cards"],
        defaultContent: ["h2"]
      },
      {
        id: "section-court-notice",
        name: "Federal Court Notice",
        selector: ".box--pale-blue",
        style: "pale-blue",
        blocks: ["fragment"],
        defaultContent: []
      },
      {
        id: "section-your-money-matters",
        name: "Your Money Matters",
        selector: [".container--four.box--white.container--three-columns", ".container--three-columns"],
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-cost-of-living",
        name: "Cost of Living",
        selector: ".container--matchheight.container--eightfour",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-calculators",
        name: "Calculators and Tools",
        selector: [".container--foureight .inpage-nav--calcs", ".inpage-nav--calcs"],
        style: null,
        blocks: ["cards"],
        defaultContent: ["h2"]
      },
      {
        id: "section-anz-plus",
        name: "ANZ Plus App Promotion",
        selector: ".container--matchheight.container--four.container--three-columns",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-need-help",
        name: "Need Help / Support",
        selector: ".container--matchheight.container--eightfour",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-disclaimers",
        name: "Important Information",
        selector: ".accordion.accordion--open",
        style: null,
        blocks: ["accordion"],
        defaultContent: []
      },
      {
        id: "section-footer",
        name: "Global Footer",
        selector: "footer.footer",
        style: null,
        blocks: ["footer"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_personal_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_personal_homepage_exports);
})();

var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // tools/importer/import-marketing-hub.js
  var import_marketing_hub_exports = {};
  __export(import_marketing_hub_exports, {
    default: () => import_marketing_hub_default
  });

  // tools/importer/parsers/announcement-banner.js
  function parse(element, { document }) {
    const textEl = element.querySelector(".toast-para p, .toast-para");
    const ctaLink = element.querySelector("a.toast-round-button, .toast-button-wrapper a:not(.toast-dismiss-button)");
    const contentCell = [];
    if (textEl) {
      const p = document.createElement("p");
      p.innerHTML = textEl.innerHTML;
      contentCell.push(p);
    }
    if (ctaLink) {
      const a = document.createElement("a");
      a.href = ctaLink.getAttribute("href");
      a.textContent = ctaLink.textContent.trim();
      contentCell.push(a);
    }
    const cells = [contentCell];
    const block = WebImporter.Blocks.createBlock(document, { name: "announcement-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero.js
  function parse2(element, { document }) {
    const bgImg = element.querySelector(".banner-image img, img[data-image-desktop-src]");
    const heading = element.querySelector(".banner-content h2, .banner-content h1:not(.sr-only), h2");
    const description = element.querySelector(".banner-content div > p, .banner-content p");
    const ctaLink = element.querySelector(".cta a, .banner-content a.button_primary, .banner-content a.button_secondary");
    const cells = [];
    if (bgImg) {
      const img = document.createElement("img");
      img.src = bgImg.getAttribute("src") || bgImg.getAttribute("data-image-desktop-src");
      img.alt = bgImg.getAttribute("alt") || "";
      cells.push([img]);
    }
    const contentWrapper = document.createElement("div");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      contentWrapper.append(h2);
    }
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      contentWrapper.append(p);
    }
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaLink.getAttribute("href");
      a.textContent = ctaLink.textContent.trim();
      p.append(a);
      contentWrapper.append(p);
    }
    if (contentWrapper.children.length > 0) {
      cells.push([contentWrapper]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/anchor-tile-nav.js
  function parse3(element, { document }) {
    const cells = [];
    const isHomepageSixPack = element.querySelector(".six-pack-links");
    const isSectionNav = element.querySelector(".section-navigation-module, ul.hyperlink-list");
    if (isHomepageSixPack) {
      const tiles = element.querySelectorAll(".six-pack-links");
      tiles.forEach((tile) => {
        const icon = tile.querySelector(".items-head img");
        const headingLink = tile.querySelector(".items-head h3 > a");
        const subLinks = tile.querySelectorAll(".items-list ul li a");
        const iconCell = document.createElement("div");
        if (icon) {
          const img = document.createElement("img");
          img.src = icon.getAttribute("src");
          img.alt = icon.getAttribute("alt") || "";
          iconCell.append(img);
        }
        const contentCell = document.createElement("div");
        if (headingLink) {
          const h3 = document.createElement("h3");
          const a = document.createElement("a");
          a.href = headingLink.getAttribute("href");
          let headingText = "";
          const textSpan = tile.querySelector(".items-head h3 a div span:first-child") || tile.querySelector(".items-head h3 a div") || tile.querySelector(".items-head h3 a span:not(.icon)");
          if (textSpan) {
            headingText = textSpan.textContent.trim();
          }
          if (!headingText) {
            const clone = headingLink.cloneNode(true);
            clone.querySelectorAll("img, .icon, svg").forEach((el) => el.remove());
            headingText = clone.textContent.trim();
          }
          a.textContent = headingText;
          h3.append(a);
          contentCell.append(h3);
        }
        if (subLinks.length > 0) {
          const ul = document.createElement("ul");
          subLinks.forEach((link) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = link.getAttribute("href");
            a.textContent = link.textContent.trim();
            li.append(a);
            ul.append(li);
          });
          contentCell.append(ul);
        }
        cells.push([iconCell, contentCell]);
      });
    } else if (isSectionNav) {
      const navLinks = element.querySelectorAll("ul.hyperlink-list > li > a");
      navLinks.forEach((link) => {
        const icon = link.querySelector("img");
        const labelSpan = link.querySelector("span");
        const iconCell = document.createElement("div");
        if (icon) {
          const img = document.createElement("img");
          img.src = icon.getAttribute("src");
          img.alt = "";
          iconCell.append(img);
        }
        const contentCell = document.createElement("div");
        const a = document.createElement("a");
        a.href = link.getAttribute("href");
        a.textContent = labelSpan ? labelSpan.textContent.trim() : link.textContent.trim();
        contentCell.append(a);
        cells.push([iconCell, contentCell]);
      });
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "anchor-tile-nav", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/promo-offer-banner.js
  function parse4(element, { document }) {
    const heading = element.querySelector(".content-wrapper h2, h2");
    const descParagraphs = element.querySelectorAll(".content-wrapper .item > p:not(:has(a.button_primary)):not(:has(a.button_secondary))");
    const ctaLink = element.querySelector(".content-wrapper a.button_primary, .content-wrapper a.button_secondary, .content-wrapper .item a");
    const promoImg = element.querySelector(".image-wrapper img, .row.image img");
    const contentCell = document.createElement("div");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      contentCell.append(h2);
    }
    descParagraphs.forEach((p) => {
      const text = p.textContent.trim();
      if (text && text !== "\xA0" && !p.querySelector("a.button_primary, a.button_secondary")) {
        const newP = document.createElement("p");
        newP.textContent = text;
        contentCell.append(newP);
      }
    });
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaLink.getAttribute("href");
      a.textContent = ctaLink.textContent.trim();
      p.append(a);
      contentCell.append(p);
    }
    const imageCell = document.createElement("div");
    if (promoImg) {
      const img = document.createElement("img");
      img.src = promoImg.getAttribute("src") || promoImg.getAttribute("data-src");
      img.alt = promoImg.getAttribute("alt") || "";
      imageCell.append(img);
    }
    const cells = [[contentCell, imageCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "promo-offer-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/article-cards.js
  function parse5(element, { document }) {
    const cells = [];
    const cardCols = element.querySelectorAll('.col-sm-12.col-md-6.col-lg, [class*="col-lg"]');
    cardCols.forEach((col) => {
      const item = col.querySelector(".item");
      if (!item) return;
      const img = item.querySelector(".image-section img, img");
      const heading = item.querySelector(".item-inner h3");
      const descDiv = item.querySelector(".item-inner > div");
      const descP = descDiv ? descDiv.querySelector("p") : null;
      const readMore = item.querySelector("a.button_tertiary, .item-inner > p > a");
      const imageCell = document.createElement("div");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.getAttribute("src") || img.getAttribute("data-src");
        newImg.alt = img.getAttribute("alt") || "";
        imageCell.append(newImg);
      }
      const contentCell = document.createElement("div");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        contentCell.append(h3);
      }
      if (descP) {
        const p = document.createElement("p");
        p.textContent = descP.textContent.trim();
        contentCell.append(p);
      }
      if (readMore) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = readMore.getAttribute("href");
        a.textContent = readMore.textContent.trim();
        p.append(a);
        contentCell.append(p);
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "article-cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/product-card.js
  function parse6(element, { document }) {
    const cells = [];
    const largeCards = element.querySelectorAll(".card-section > .carditem > .card.promotion");
    largeCards.forEach((card) => {
      const img = card.querySelector(".img-container img");
      const heading = card.querySelector(".card-header h3");
      const description = card.querySelector(".card-content p");
      const ctaLink = card.querySelector(".card-cta a");
      const imageCell = document.createElement("div");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.getAttribute("src") || img.getAttribute("data-src");
        newImg.alt = img.getAttribute("alt") || "";
        imageCell.append(newImg);
      }
      const contentCell = document.createElement("div");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        contentCell.append(h3);
      }
      if (description) {
        const text = description.textContent.trim();
        if (text && text !== "\xA0") {
          const p = document.createElement("p");
          p.textContent = text;
          contentCell.append(p);
        }
      }
      if (ctaLink) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = ctaLink.getAttribute("href");
        a.textContent = ctaLink.textContent.trim();
        p.append(a);
        contentCell.append(p);
      }
      cells.push([imageCell, contentCell]);
    });
    const compareCards = element.querySelectorAll(".card-section > .carditem > .card.compare");
    compareCards.forEach((card) => {
      const img = card.querySelector(".img-container img");
      const heading = card.querySelector(".card-header h3");
      const featureList = card.querySelectorAll(".card-content ul li");
      const ctaLink = card.querySelector(".card-cta a");
      const imageCell = document.createElement("div");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.getAttribute("src") || img.getAttribute("data-src");
        newImg.alt = img.getAttribute("alt") || "";
        imageCell.append(newImg);
      }
      const contentCell = document.createElement("div");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        contentCell.append(h3);
      }
      if (featureList.length > 0) {
        const ul = document.createElement("ul");
        featureList.forEach((li) => {
          const newLi = document.createElement("li");
          newLi.textContent = li.textContent.trim();
          ul.append(newLi);
        });
        contentCell.append(ul);
      }
      if (ctaLink) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = ctaLink.getAttribute("href");
        a.textContent = ctaLink.textContent.trim();
        p.append(a);
        contentCell.append(p);
      }
      cells.push([imageCell, contentCell]);
    });
    const miniCards = element.querySelectorAll(".minicard");
    miniCards.forEach((mini) => {
      const link = mini.querySelector(".card.mini > a");
      const img = mini.querySelector(".img-container img");
      const titleEl = mini.querySelector(".card-header");
      const imageCell = document.createElement("div");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.getAttribute("src") || img.getAttribute("data-src");
        newImg.alt = img.getAttribute("alt") || "";
        imageCell.append(newImg);
      }
      const contentCell = document.createElement("div");
      if (link && titleEl) {
        const a = document.createElement("a");
        a.href = link.getAttribute("href");
        a.textContent = titleEl.textContent.trim();
        contentCell.append(a);
      } else if (titleEl) {
        contentCell.textContent = titleEl.textContent.trim();
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "product-card", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/support-cards.js
  function parse7(element, { document }) {
    const cells = [];
    const supportLinks = element.querySelector(".support-links");
    if (supportLinks) {
      const headLink = supportLinks.querySelector(".items-head h3 a");
      const icon = supportLinks.querySelector(".items-head img");
      const linkList = supportLinks.querySelector(".support-content ul");
      const iconCell = document.createElement("div");
      if (icon) {
        const newImg = document.createElement("img");
        newImg.src = icon.getAttribute("src") || icon.getAttribute("data-src");
        newImg.alt = icon.getAttribute("alt") || "";
        iconCell.append(newImg);
      }
      const contentCell = document.createElement("div");
      if (headLink) {
        const h3 = document.createElement("h3");
        const a = document.createElement("a");
        a.href = headLink.getAttribute("href");
        const textSpan = headLink.querySelector("div > span:first-child");
        const analyticsId = headLink.getAttribute("data-analytics-id");
        if (textSpan && textSpan.textContent.trim()) {
          a.textContent = textSpan.textContent.trim();
        } else if (analyticsId) {
          a.textContent = analyticsId;
        } else {
          const clone = headLink.cloneNode(true);
          clone.querySelectorAll("img, [aria-hidden], .icon-right-arrow").forEach((el) => el.remove());
          a.textContent = clone.textContent.replace(/\s+/g, " ").trim();
        }
        h3.append(a);
        contentCell.append(h3);
      }
      if (linkList) {
        const ul = document.createElement("ul");
        linkList.querySelectorAll("li a").forEach((linkEl) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = linkEl.getAttribute("href");
          a.textContent = linkEl.textContent.replace(/\s+/g, " ").trim();
          li.append(a);
          ul.append(li);
        });
        contentCell.append(ul);
      }
      cells.push([iconCell, contentCell]);
    }
    const contactContent = element.querySelector(".contact-content");
    if (contactContent) {
      const headLink = contactContent.querySelector("h3 a");
      const icon = contactContent.querySelector("img");
      const desc = contactContent.querySelector(".links-title p");
      const iconCell = document.createElement("div");
      if (icon) {
        const newImg = document.createElement("img");
        newImg.src = icon.getAttribute("src") || icon.getAttribute("data-src");
        newImg.alt = icon.getAttribute("alt") || "";
        iconCell.append(newImg);
      }
      const contentCell = document.createElement("div");
      if (headLink) {
        const h3 = document.createElement("h3");
        const a = document.createElement("a");
        a.href = headLink.getAttribute("href");
        const textSpan = headLink.querySelector("div > span:first-child");
        const analyticsId = headLink.getAttribute("data-analytics-id");
        if (textSpan && textSpan.textContent.trim()) {
          a.textContent = textSpan.textContent.trim();
        } else if (analyticsId) {
          a.textContent = analyticsId;
        } else {
          const clone = headLink.cloneNode(true);
          clone.querySelectorAll("img, [aria-hidden], .icon-right-arrow").forEach((el) => el.remove());
          a.textContent = clone.textContent.replace(/\s+/g, " ").trim();
        }
        h3.append(a);
        contentCell.append(h3);
      }
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        contentCell.append(p);
      }
      cells.push([iconCell, contentCell]);
    }
    const locateContent = element.querySelector(".locate-content");
    if (locateContent) {
      const headLink = locateContent.querySelector("h3 a");
      const icon = locateContent.querySelector("img");
      const desc = locateContent.querySelector(".links-title p");
      const iconCell = document.createElement("div");
      if (icon) {
        const newImg = document.createElement("img");
        newImg.src = icon.getAttribute("src") || icon.getAttribute("data-src");
        newImg.alt = icon.getAttribute("alt") || "";
        iconCell.append(newImg);
      }
      const contentCell = document.createElement("div");
      if (headLink) {
        const h3 = document.createElement("h3");
        const a = document.createElement("a");
        a.href = headLink.getAttribute("href");
        const textSpan = headLink.querySelector("div > span:first-child");
        const analyticsId = headLink.getAttribute("data-analytics-id");
        if (textSpan && textSpan.textContent.trim()) {
          a.textContent = textSpan.textContent.trim();
        } else if (analyticsId) {
          a.textContent = analyticsId;
        } else {
          const clone = headLink.cloneNode(true);
          clone.querySelectorAll("img, [aria-hidden], .icon-right-arrow").forEach((el) => el.remove());
          a.textContent = clone.textContent.replace(/\s+/g, " ").trim();
        }
        h3.append(a);
        contentCell.append(h3);
      }
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        contentCell.append(p);
      }
      cells.push([iconCell, contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "support-cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/commbank-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-links-module",
        ".commbank-header",
        ".commbank-footer",
        ".page-lockout"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".gdpr-banner",
        '[class*="cookie"]'
      ]);
      element.querySelectorAll(".mboxDefault").forEach((mbox) => {
        const parent = mbox.parentElement;
        while (mbox.firstChild) {
          parent.insertBefore(mbox.firstChild, mbox);
        }
        mbox.remove();
      });
      element.querySelectorAll(".experiencefragment").forEach((xf) => {
        const parent = xf.parentElement;
        if (parent) {
          while (xf.firstChild) {
            parent.insertBefore(xf.firstChild, xf);
          }
          xf.remove();
        }
      });
      WebImporter.DOMUtils.remove(element, [
        "#ContextHub",
        "#contexthub",
        '[class*="cq-analytics"]',
        '[id*="contexthub"]'
      ]);
      element.querySelectorAll('a[href*="?ei="]').forEach((a) => {
        const url = new URL(a.href, "https://www.commbank.com.au");
        const ei = url.searchParams.get("ei");
        if (ei) {
          a.setAttribute("data-analytics-event", ei);
          url.searchParams.delete("ei");
          a.href = url.pathname + url.search + url.hash;
        }
      });
      element.querySelectorAll('img[src*="assets.commbank.com.au"]').forEach((img) => {
        let src = img.getAttribute("src");
        src = src.replace(/\?\$[^$]+\$.*$/, "");
        src = src.replace(/:[A-Z]+$/, "");
        src = src.replace(/\.transform\/[^/]+\/image\.\w+$/, "");
        img.setAttribute("src", src);
      });
      element.querySelectorAll('img[data-src*="assets.commbank.com.au"]').forEach((img) => {
        let src = img.getAttribute("data-src");
        src = src.replace(/\?\$[^$]+\$.*$/, "");
        src = src.replace(/:[A-Z]+$/, "");
        src = src.replace(/\.transform\/[^/]+\/image\.\w+$/, "");
        img.setAttribute("data-src", src);
      });
      WebImporter.DOMUtils.remove(element, [".common-mobile-accordion-button"]);
      WebImporter.DOMUtils.remove(element, [".mobile-cta"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        ".breadcrumb",
        '[class*="breadcrumb"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "link",
        "iframe",
        "script"
      ]);
      element.querySelectorAll("[data-tracker-type]").forEach((el) => {
        el.removeAttribute("data-tracker-type");
        el.removeAttribute("data-tracker-locationid");
        el.removeAttribute("data-tracker_ei");
        el.removeAttribute("data-tracker-id");
        el.removeAttribute("data-fl-countingmethod");
        el.removeAttribute("data-fl-event");
        el.removeAttribute("dtmtracker");
      });
      WebImporter.DOMUtils.remove(element, [
        ".hc1-icon-arrow-right",
        ".icon-right-arrow",
        '[class*="right-hc-icon"]'
      ]);
      element.querySelectorAll("[style]").forEach((el) => {
        el.removeAttribute("style");
      });
    }
  }

  // tools/importer/transformers/commbank-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    const template = payload && payload.template;
    if (!template || !template.sections) return;
    const doc = element.ownerDocument || element;
    if (hookName === TransformHook2.beforeTransform) {
      template.sections.forEach((section) => {
        if (!section.defaultContent || section.defaultContent.length === 0) return;
        if (!section.blocks || section.blocks.length === 0) return;
        section.defaultContent.forEach((contentSelector) => {
          const contentEl = element.querySelector(contentSelector);
          if (!contentEl) return;
          for (const blockName of section.blocks) {
            const blockDef = template.blocks.find((b) => b.name === blockName);
            if (!blockDef) continue;
            for (const instanceSel of blockDef.instances) {
              const blockEl = element.querySelector(instanceSel);
              if (blockEl && blockEl.contains(contentEl)) {
                blockEl.before(contentEl);
                return;
              }
            }
          }
        });
      });
    }
    if (hookName === TransformHook2.afterTransform) {
      if (template.sections.length < 2) return;
      const sections = template.sections;
      const currentUrl = payload && payload.url ? payload.url : "";
      const isHomepage = currentUrl === "https://www.commbank.com.au/" || currentUrl.endsWith("/index.html") || currentUrl.replace(/\/$/, "") === "https://www.commbank.com.au";
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          if (sel) {
            sectionEl = element.querySelector(sel);
            if (sectionEl) break;
          }
        }
        if (!sectionEl) continue;
        if (section.style && !(section.style === "dark" && !isHomepage)) {
          const metaBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: [["style", section.style]]
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-marketing-hub.js
  var parsers = {
    "announcement-banner": parse,
    "hero": parse2,
    "anchor-tile-nav": parse3,
    "promo-offer-banner": parse4,
    "article-cards": parse5,
    "product-card": parse6,
    "support-cards": parse7
  };
  var PAGE_TEMPLATE = {
    name: "marketing-hub",
    description: "Marketing hub and category landing pages. Features announcement-banner, hero, anchor-tile-nav, product-card grids, promo-offer-banner, support-cards, and article-cards. Serves as entry point for each major product category.",
    urls: [
      "https://www.commbank.com.au/",
      "https://www.commbank.com.au/banking.html",
      "https://www.commbank.com.au/home-buying.html",
      "https://www.commbank.com.au/insurance.html",
      "https://www.commbank.com.au/investing-and-super.html",
      "https://www.commbank.com.au/business.html",
      "https://www.commbank.com.au/digital-banking.html",
      "https://www.commbank.com.au/institutional.html"
    ],
    blocks: [
      {
        name: "announcement-banner",
        instances: [".toast-module .toast-item.announcement"]
      },
      {
        name: "hero",
        instances: [".banner"]
      },
      {
        name: "anchor-tile-nav",
        instances: [".six-packs-module", ".section-navigation"]
      },
      {
        name: "promo-offer-banner",
        instances: [".fifty-split-module"]
      },
      {
        name: "article-cards",
        instances: [".column-control .four-column"]
      },
      {
        name: "product-card",
        instances: [".card-module-alt"]
      },
      {
        name: "support-cards",
        instances: [".helpv2-module"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Announcement Banner",
        selector: ".toast-module",
        style: null,
        blocks: ["announcement-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Hero",
        selector: ".container.hero-container .banner",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Products and Services Navigation",
        selector: [".homepage-six-pack", ".section-navigation"],
        style: "light",
        blocks: ["anchor-tile-nav"],
        defaultContent: [".homepage-six-pack h2"]
      },
      {
        id: "section-4",
        name: "Feature Promo",
        selector: ".fifty-split",
        style: null,
        blocks: ["promo-offer-banner"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "News/Content Cards",
        selector: ".column-control#column-control-0",
        style: null,
        blocks: ["article-cards"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Financial Difficulty CTA",
        selector: ".cta",
        style: null,
        blocks: [],
        defaultContent: [".cta-module"]
      },
      {
        id: "section-7",
        name: "More from CommBank",
        selector: ".cardsV2",
        style: null,
        blocks: ["product-card"],
        defaultContent: [".card-module-alt h2"]
      },
      {
        id: "section-8",
        name: "Support and Help",
        selector: ".helpV2",
        style: "dark",
        blocks: ["support-cards"],
        defaultContent: [".helpv2-heading h2"]
      },
      {
        id: "section-9",
        name: "Things You Should Know",
        selector: ".column-control#column-control-1",
        style: "dark",
        blocks: [],
        defaultContent: ["#column-control-1 .one-by-three-columns"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE
    };
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
  var import_marketing_hub_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
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
        path: path || "/index",
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_marketing_hub_exports);
})();

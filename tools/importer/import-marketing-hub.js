/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import announcementBannerParser from './parsers/announcement-banner.js';
import heroParser from './parsers/hero.js';
import anchorTileNavParser from './parsers/anchor-tile-nav.js';
import promoOfferBannerParser from './parsers/promo-offer-banner.js';
import articleCardsParser from './parsers/article-cards.js';
import productCardParser from './parsers/product-card.js';
import supportCardsParser from './parsers/support-cards.js';

// TRANSFORMER IMPORTS
import commbankCleanupTransformer from './transformers/commbank-cleanup.js';
import commbankSectionsTransformer from './transformers/commbank-sections.js';

// PARSER REGISTRY
const parsers = {
  'announcement-banner': announcementBannerParser,
  'hero': heroParser,
  'anchor-tile-nav': anchorTileNavParser,
  'promo-offer-banner': promoOfferBannerParser,
  'article-cards': articleCardsParser,
  'product-card': productCardParser,
  'support-cards': supportCardsParser,
};

// PAGE TEMPLATE CONFIGURATION (from page-templates.json)
const PAGE_TEMPLATE = {
  name: 'marketing-hub',
  description: 'Marketing hub and category landing pages. Features announcement-banner, hero, anchor-tile-nav, product-card grids, promo-offer-banner, support-cards, and article-cards. Serves as entry point for each major product category.',
  urls: [
    'https://www.commbank.com.au/',
    'https://www.commbank.com.au/banking.html',
    'https://www.commbank.com.au/home-buying.html',
    'https://www.commbank.com.au/insurance.html',
    'https://www.commbank.com.au/investing-and-super.html',
    'https://www.commbank.com.au/business.html',
    'https://www.commbank.com.au/digital-banking.html',
    'https://www.commbank.com.au/institutional.html',
  ],
  blocks: [
    {
      name: 'announcement-banner',
      instances: ['.toast-module .toast-item.announcement'],
    },
    {
      name: 'hero',
      instances: ['.banner'],
    },
    {
      name: 'anchor-tile-nav',
      instances: ['.six-packs-module', '.section-navigation'],
    },
    {
      name: 'promo-offer-banner',
      instances: ['.fifty-split-module'],
    },
    {
      name: 'article-cards',
      instances: ['.column-control .four-column'],
    },
    {
      name: 'product-card',
      instances: ['.card-module-alt'],
    },
    {
      name: 'support-cards',
      instances: ['.helpv2-module'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Announcement Banner',
      selector: '.toast-module',
      style: null,
      blocks: ['announcement-banner'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Hero',
      selector: '.container.hero-container .banner',
      style: null,
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Products and Services Navigation',
      selector: ['.homepage-six-pack', '.section-navigation'],
      style: 'light',
      blocks: ['anchor-tile-nav'],
      defaultContent: ['.homepage-six-pack h2'],
    },
    {
      id: 'section-4',
      name: 'Feature Promo',
      selector: '.fifty-split',
      style: null,
      blocks: ['promo-offer-banner'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'News/Content Cards',
      selector: '.column-control#column-control-0',
      style: null,
      blocks: ['article-cards'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Financial Difficulty CTA',
      selector: '.cta',
      style: null,
      blocks: [],
      defaultContent: ['.cta-module'],
    },
    {
      id: 'section-7',
      name: 'More from CommBank',
      selector: '.cardsV2',
      style: null,
      blocks: ['product-card'],
      defaultContent: ['.card-module-alt h2'],
    },
    {
      id: 'section-8',
      name: 'Support and Help',
      selector: '.helpV2',
      style: 'dark',
      blocks: ['support-cards'],
      defaultContent: ['.helpv2-heading h2'],
    },
    {
      id: 'section-9',
      name: 'Things You Should Know',
      selector: '.column-control#column-control-1',
      style: 'dark',
      blocks: [],
      defaultContent: ['#column-control-1 .one-by-three-columns'],
    },
  ],
};

// TRANSFORMER REGISTRY
// Section transformer runs after cleanup in afterTransform hook
const transformers = [
  commbankCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [commbankSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
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
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial DOM cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname
        .replace(/\/$/, '')
        .replace(/\.html$/, '')
    );

    return [{
      element: main,
      path: path || '/index',
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};

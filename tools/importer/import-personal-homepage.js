/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselParser from './parsers/carousel.js';
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';
import accordionParser from './parsers/accordion.js';
import fragmentParser from './parsers/fragment.js';

// TRANSFORMER IMPORTS
import anzCleanupTransformer from './transformers/anz-cleanup.js';
import anzSectionsTransformer from './transformers/anz-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel': carouselParser,
  'cards': cardsParser,
  'columns': columnsParser,
  'accordion': accordionParser,
  'fragment': fragmentParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'personal-homepage',
  description: 'ANZ Personal Banking homepage - consumer-facing entry point with hero carousel, product links, financial tools, app promotion, support resources, and regulatory disclaimers',
  urls: [
    'https://www.anz.com.au/personal/'
  ],
  blocks: [
    {
      name: 'carousel',
      instances: ['.hero--container', '.herocontainer']
    },
    {
      name: 'cards',
      instances: ['.container--four-columns .inpage-nav__links', '.inpage-nav--calcs']
    },
    {
      name: 'columns',
      instances: [
        '.container--four.box--white.container--three-columns',
        '.container--matchheight.container--eightfour',
        '.container--matchheight.container--four.container--three-columns'
      ]
    },
    {
      name: 'accordion',
      instances: ['.accordion.accordion--open']
    },
    {
      name: 'fragment',
      instances: ['.butter-bar', '.box--pale-blue']
    }
  ],
  sections: [
    {
      id: 'section-alert-banner',
      name: 'Alert Banner',
      selector: '.butter-bar',
      style: 'grey',
      blocks: ['fragment'],
      defaultContent: ['.butter-bar__content']
    },
    {
      id: 'section-header',
      name: 'Global Header',
      selector: 'header.header',
      style: null,
      blocks: ['header'],
      defaultContent: []
    },
    {
      id: 'section-hero-carousel',
      name: 'Hero Carousel',
      selector: '.hero--container',
      style: null,
      blocks: ['carousel'],
      defaultContent: []
    },
    {
      id: 'section-banking-with-anz',
      name: 'Banking with ANZ',
      selector: '.container--four-columns',
      style: null,
      blocks: ['cards'],
      defaultContent: ['h2']
    },
    {
      id: 'section-court-notice',
      name: 'Federal Court Notice',
      selector: '.box--pale-blue',
      style: 'pale-blue',
      blocks: ['fragment'],
      defaultContent: []
    },
    {
      id: 'section-your-money-matters',
      name: 'Your Money Matters',
      selector: ['.container--four.box--white.container--three-columns', '.container--three-columns'],
      style: null,
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-cost-of-living',
      name: 'Cost of Living',
      selector: '.container--matchheight.container--eightfour',
      style: null,
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-calculators',
      name: 'Calculators and Tools',
      selector: ['.container--foureight .inpage-nav--calcs', '.inpage-nav--calcs'],
      style: null,
      blocks: ['cards'],
      defaultContent: ['h2']
    },
    {
      id: 'section-anz-plus',
      name: 'ANZ Plus App Promotion',
      selector: '.container--matchheight.container--four.container--three-columns',
      style: null,
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-need-help',
      name: 'Need Help / Support',
      selector: '.container--matchheight.container--eightfour',
      style: null,
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-disclaimers',
      name: 'Important Information',
      selector: '.accordion.accordion--open',
      style: null,
      blocks: ['accordion'],
      defaultContent: []
    },
    {
      id: 'section-footer',
      name: 'Global Footer',
      selector: 'footer.footer',
      style: null,
      blocks: ['footer'],
      defaultContent: []
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  anzCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [anzSectionsTransformer] : []),
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
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
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
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};

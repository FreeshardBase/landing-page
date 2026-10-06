import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

// All 13 known blog posts and expected metadata
const EXPECTED_POSTS = [
  { slug: 'putting-apps-to-sleep-and-waking-them-in-under-two-seconds', date: '2026-07-25', preRebrand: false },
  { slug: 'unblocking-apps-by-fixing-a-performance-bottleneck', date: '2026-05-29', preRebrand: false, hasMermaid: true },
  { slug: 'rebrand-and-public-source-code', date: '2025-04-29', preRebrand: false },
  { slug: 'going-paperless-with-paperless-on-portal', date: '2024-09-10', preRebrand: true },
  { slug: 'eating-your-own-dog-food', date: '2024-04-07', preRebrand: true },
  { slug: 'app-integration-overhaul', date: '2023-09-16', preRebrand: true },
  { slug: 'smart-home-and-iot', date: '2022-12-08', preRebrand: true },
  { slug: 'peer-2-peer-communication', date: '2022-11-01', preRebrand: true },
  { slug: 'backup-your-portal', date: '2022-07-25', preRebrand: true },
  { slug: 'shared-directories', date: '2022-06-28', preRebrand: true },
  { slug: 'starting-and-stopping-apps', date: '2022-06-10', preRebrand: true },
  { slug: 'new-features-for-the-portal-app-store', date: '2022-03-30', preRebrand: true },
  { slug: 'getting-rid-of-registration-and-login-views', date: '2022-03-02', preRebrand: true },
];

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: [],
  issues: [],
  networkErrors: [],
  consoleErrors: [],
  pageErrors: [],
  mermaidAnalysis: null,
  imagesChecked: 0,
  imagesFailed: 0,
};

function recordPass(suite, name, details = '') {
  results.passed++;
  results.tests.push({ suite, name, status: 'PASS', details });
  console.log(`  ✅ [PASS] ${suite} > ${name}${details ? ` (${details})` : ''}`);
}

function recordFail(suite, name, error) {
  results.failed++;
  const msg = error instanceof Error ? error.message : String(error);
  results.tests.push({ suite, name, status: 'FAIL', error: msg });
  results.issues.push(`[${suite}] ${name}: ${msg}`);
  console.error(`  ❌ [FAIL] ${suite} > ${name}: ${msg}`);
}

function recordWarn(suite, name, warning) {
  results.warnings++;
  results.issues.push(`[WARN][${suite}] ${name}: ${warning}`);
  console.warn(`  ⚠️ [WARN] ${suite} > ${name}: ${warning}`);
}

async function run() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  console.log(`\n======================================================`);
  console.log(`Starting Blog E2E Test Suite on ${BASE_URL}`);
  console.log(`======================================================\n`);

  // Ensure preview server is reachable or spawn it automatically
  let serverProcess = null;
  try {
    const res = await fetch(`${BASE_URL}/de/blog/`, { signal: AbortSignal.timeout(1500) });
    if (!res.ok) throw new Error(`Status ${res.status}`);
  } catch {
    console.log(`Server at ${BASE_URL} not reachable. Spawning 'astro preview --port 4321'...`);
    const { spawn } = await import('child_process');
    serverProcess = spawn('npx', ['astro', 'preview', '--port', '4321'], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'ignore',
      detached: false,
    });

    let ready = false;
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 500));
      try {
        const check = await fetch(`${BASE_URL}/de/blog/`, { signal: AbortSignal.timeout(1000) });
        if (check.ok) {
          ready = true;
          console.log(`Preview server ready on ${BASE_URL}`);
          break;
        }
      } catch {}
    }
    if (!ready) {
      if (serverProcess) serverProcess.kill('SIGTERM');
      throw new Error(`Failed to start or connect to preview server at ${BASE_URL} within 10s.`);
    }
  }

  // Launch browser with fallback if needed
  let browser;
  try {
    browser = await chromium.launch();
  } catch (e) {
    const fallbackPath = '/home/agent-user/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell';
    console.log(`Launching fallback chromium binary: ${fallbackPath}`);
    browser = await chromium.launch({ executablePath: fallbackPath });
  }

  try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: 'de-DE',
  });

  const page = await context.newPage();

  // Attach error listeners
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const entry = `Console Error on ${page.url()}: ${msg.text()}`;
      results.consoleErrors.push(entry);
      console.warn(`     [Browser Console Error] ${msg.text()}`);
    }
  });

  page.on('pageerror', (err) => {
    const entry = `Page Unhandled Error on ${page.url()}: ${err.message}`;
    results.pageErrors.push(entry);
    console.error(`     [Browser Page Error] ${err.message}`);
  });

  page.on('response', (res) => {
    if (res.status() >= 400) {
      const entry = `HTTP ${res.status()} ${res.request().method()} ${res.url()} requested from ${page.url()}`;
      results.networkErrors.push(entry);
      console.error(`     [HTTP Error] ${entry}`);
    }
  });

  // -------------------------------------------------------------
  // SUITE 1: Navigation from Header
  // -------------------------------------------------------------
  console.log('\n--- SUITE 1: Header Navigation ---');
  for (const lang of ['de', 'en']) {
    try {
      await page.goto(`${BASE_URL}/${lang}/`, { waitUntil: 'networkidle' });
      const blogNav = page.locator('.nav-links a[href*="/blog/"]');
      await blogNav.waitFor({ state: 'visible' });
      const navText = (await blogNav.textContent()).trim();
      await blogNav.click();
      await page.waitForURL(`**/${lang}/blog/`);
      const h1 = (await page.locator('.blog-index h1').textContent()).trim();
      if (h1 === 'Blog') {
        recordPass('Header Navigation', `Click "Blog" in navbar on /${lang}/ redirects to /${lang}/blog/`, `Nav text: "${navText}", H1: "${h1}"`);
      } else {
        recordFail('Header Navigation', `Click "Blog" on /${lang}/`, `Expected H1 "Blog", got "${h1}"`);
      }
    } catch (err) {
      recordFail('Header Navigation', `Navigation on /${lang}/`, err);
    }
  }

  // -------------------------------------------------------------
  // SUITE 2: Blog Pagination
  // -------------------------------------------------------------
  console.log('\n--- SUITE 2: Blog Pagination ---');
  try {
    // 1. Visit /de/blog/
    await page.goto(`${BASE_URL}/de/blog/`, { waitUntil: 'networkidle' });
    const countPage1 = await page.locator('.post-card').count();
    if (countPage1 === 10) {
      recordPass('Pagination', '/de/blog/ displays 10 posts on page 1', `Count: ${countPage1}`);
    } else {
      recordFail('Pagination', '/de/blog/ page 1 count', `Expected 10 posts, got ${countPage1}`);
    }

    // Save screenshot of DE Blog Index Page 1
    const p1Screenshot = path.join(SCREENSHOTS_DIR, '01_blog_index_de.png');
    await page.screenshot({ path: p1Screenshot, fullPage: false });

    // Click "Ältere Beiträge" -> /de/blog/2
    const nextLink = page.locator('.pagination a:has-text("Ältere")');
    await nextLink.waitFor({ state: 'visible' });
    const nextText = (await nextLink.textContent()).trim();
    await nextLink.click();
    await page.waitForURL(url => url.pathname.includes('/de/blog/2'));
    const countPage2 = await page.locator('.post-card').count();
    if (countPage2 === 3) {
      recordPass('Pagination', 'Click "Ältere Beiträge →" navigates to /de/blog/2 with 3 posts', `Link: "${nextText}", Count: ${countPage2}`);
    } else {
      recordFail('Pagination', '/de/blog/2 count', `Expected 3 posts, got ${countPage2}`);
    }

    // Save screenshot of DE Blog Page 2
    const p2Screenshot = path.join(SCREENSHOTS_DIR, '03_blog_page2_de.png');
    await page.screenshot({ path: p2Screenshot, fullPage: false });

    // Click "Neuere Beiträge" -> /de/blog
    const prevLink = page.locator('.pagination a:has-text("Neuere")');
    await prevLink.waitFor({ state: 'visible' });
    const prevText = (await prevLink.textContent()).trim();
    await prevLink.click();
    await page.waitForURL(url => url.pathname === '/de/blog' || url.pathname === '/de/blog/');
    const countBack = await page.locator('.post-card').count();
    if (countBack === 10) {
      recordPass('Pagination', 'Click "← Neuere Beiträge" navigates back to /de/blog/', `Link: "${prevText}", Count: ${countBack}`);
    } else {
      recordFail('Pagination', 'Back to /de/blog/ count', `Expected 10 posts, got ${countBack}`);
    }

    // Also test English pagination
    await page.goto(`${BASE_URL}/en/blog/`, { waitUntil: 'networkidle' });
    const enNext = page.locator('.pagination a:has-text("Older")');
    await enNext.click();
    await page.waitForURL(url => url.pathname.includes('/en/blog/2'));
    const enCount2 = await page.locator('.post-card').count();
    const enPrev = page.locator('.pagination a:has-text("Newer")');
    await enPrev.click();
    await page.waitForURL(url => url.pathname === '/en/blog' || url.pathname === '/en/blog/');
    recordPass('Pagination', 'English pagination navigation (/en/blog/ <-> /en/blog/2)', `Page 2 posts: ${enCount2}`);

    // Screenshot of EN Blog Index Page 1
    const enIndexScreenshot = path.join(SCREENSHOTS_DIR, '02_blog_index_en.png');
    await page.screenshot({ path: enIndexScreenshot, fullPage: false });

  } catch (err) {
    recordFail('Pagination', 'Blog pagination flow', err);
  }

  // -------------------------------------------------------------
  // SUITE 3: Permutations Matrix Languages x Blog Pages
  // -------------------------------------------------------------
  console.log('\n--- SUITE 3: Language Switcher Permutations ---');
  const testSwitchScenarios = [
    { start: '/de/blog/', targetLang: 'en', expectedPattern: '/en/blog' },
    { start: '/en/blog/', targetLang: 'de', expectedPattern: '/de/blog' },
    { start: '/de/blog/2/', targetLang: 'en', expectedPattern: '/en/blog/2' },
    { start: '/en/blog/2/', targetLang: 'de', expectedPattern: '/de/blog/2' },
    { start: '/de/blog/rebrand-and-public-source-code/', targetLang: 'en', expectedPattern: '/en/blog/rebrand-and-public-source-code' },
    { start: '/en/blog/rebrand-and-public-source-code/', targetLang: 'de', expectedPattern: '/de/blog/rebrand-and-public-source-code' },
    { start: '/de/blog/unblocking-apps-by-fixing-a-performance-bottleneck/', targetLang: 'en', expectedPattern: '/en/blog/unblocking-apps-by-fixing-a-performance-bottleneck' },
    { start: '/de/blog/eating-your-own-dog-food/', targetLang: 'en', expectedPattern: '/en/blog/eating-your-own-dog-food' },
  ];

  for (const s of testSwitchScenarios) {
    try {
      await page.goto(`${BASE_URL}${s.start}`, { waitUntil: 'networkidle' });
      const switcherLink = page.locator(`.lang-switch a[href*="/${s.targetLang}/"]`);
      await switcherLink.waitFor({ state: 'visible' });
      await switcherLink.click();
      await page.waitForURL(url => url.pathname.includes(s.expectedPattern));
      const current = new URL(page.url()).pathname;
      if (current.includes(s.expectedPattern)) {
        recordPass('Language Switcher', `Switch from ${s.start} to ${s.targetLang}`, `Resolved URL: ${current}`);
      } else {
        recordFail('Language Switcher', `Switch from ${s.start} to ${s.targetLang}`, `Expected ${s.expectedPattern}, got ${current}`);
      }
    } catch (err) {
      recordFail('Language Switcher', `Switch from ${s.start} to ${s.targetLang}`, err);
    }
  }

  // -------------------------------------------------------------
  // SUITE 4: Detail Pages (All 13 Articles x 2 Languages = 26 pages)
  // -------------------------------------------------------------
  console.log('\n--- SUITE 4: Detail Pages (26 Variants) ---');

  for (const item of EXPECTED_POSTS) {
    for (const lang of ['de', 'en']) {
      const urlPath = `/${lang}/blog/${item.slug}/`;
      const pageTitleTag = `[${lang.toUpperCase()}] ${item.slug}`;

      try {
        const response = await page.goto(`${BASE_URL}${urlPath}`, { waitUntil: 'networkidle' });
        if (!response || response.status() !== 200) {
          recordFail('Detail Page Load', `${pageTitleTag}`, `HTTP status: ${response ? response.status() : 'No response'}`);
          continue;
        }

        // 1. Heading check
        const h1Locator = page.locator('.post-header h1');
        const h1Exists = (await h1Locator.count()) === 1;
        const h1Text = h1Exists ? (await h1Locator.textContent()).trim() : '';
        if (h1Exists && h1Text.length > 5) {
          recordPass('Detail Page Heading', `${pageTitleTag} - H1 visible`, `"${h1Text.substring(0, 40)}..."`);
        } else {
          recordFail('Detail Page Heading', `${pageTitleTag} - H1 visible`, `H1 missing or too short: "${h1Text}"`);
        }

        // 2. Metadata check (Date, Author)
        const postMeta = page.locator('.post-meta');
        const metaText = await postMeta.textContent();
        const timeEl = page.locator('.post-meta time');
        const timeAttr = await timeEl.getAttribute('datetime');
        const hasAuthor = metaText.includes('Max von Tettenborn') || metaText.includes('von') || metaText.includes('by');
        if (timeAttr && hasAuthor) {
          recordPass('Detail Page Meta', `${pageTitleTag} - Date and Author rendered`, `Date: ${timeAttr}`);
        } else {
          recordFail('Detail Page Meta', `${pageTitleTag} - Date and Author rendered`, `Time attr: ${timeAttr}, Meta text: ${metaText}`);
        }

        // 3. Image loading check (naturalWidth > 0)
        const images = await page.locator('.post img').all();
        let allImagesOk = true;
        let imgCount = images.length;
        for (let i = 0; i < images.length; i++) {
          results.imagesChecked++;
          const img = images[i];
          const src = await img.getAttribute('src');
          await img.scrollIntoViewIfNeeded();
          await page.waitForTimeout(100);
          const isLoaded = await img.evaluate((el) => el.complete && el.naturalWidth > 0);
          if (!isLoaded) {
            allImagesOk = false;
            results.imagesFailed++;
            recordFail('Detail Page Images', `${pageTitleTag} - Image broken`, `Image src: ${src} naturalWidth <= 0`);
          }
        }
        if (imgCount > 0 && allImagesOk) {
          recordPass('Detail Page Images', `${pageTitleTag} - All ${imgCount} images loaded (naturalWidth > 0)`);
        } else if (imgCount === 0) {
          recordPass('Detail Page Images', `${pageTitleTag} - No inline/cover images (0 images)`);
        }

        // 4. AI translation notice (DE only)
        if (lang === 'de') {
          const aiNotice = page.locator('.post-notice:has-text("maschinell aus dem Englischen übersetzt")');
          const aiCount = await aiNotice.count();
          const origLink = page.locator(`.post-notice a[href="/en/blog/${item.slug}/"]`);
          const origLinkCount = await origLink.count();

          if (aiCount === 1 && origLinkCount === 1) {
            recordPass('AI Notice', `${pageTitleTag} - AI notice and original link present`, `Link: /en/blog/${item.slug}/`);
          } else {
            recordFail('AI Notice', `${pageTitleTag} - AI notice check`, `Notice count: ${aiCount}, Orig link count: ${origLinkCount}`);
          }
        } else {
          // In EN, AI notice should NOT be present
          const aiNotice = page.locator('.post-notice:has-text("machine-translated")');
          const aiCount = await aiNotice.count();
          if (aiCount === 0) {
            recordPass('AI Notice', `${pageTitleTag} - No AI notice in English version`);
          } else {
            recordFail('AI Notice', `${pageTitleTag} - Unexpected AI notice in English`, `Found ${aiCount} notices`);
          }
        }

        // 5. Pre-rebrand notice
        const preRebrandNotice = page.locator('.post-notice:has-text("vor der Umbenennung im April 2025"), .post-notice:has-text("predates the April 2025 rename")');
        const preRebrandCount = await preRebrandNotice.count();
        if (item.preRebrand) {
          if (preRebrandCount === 1) {
            recordPass('Pre-Rebrand Notice', `${pageTitleTag} - Historical Portal notice present`);
          } else {
            recordFail('Pre-Rebrand Notice', `${pageTitleTag} - Pre-rebrand notice missing`, `Expected 1, found ${preRebrandCount}`);
          }
        } else {
          if (preRebrandCount === 0) {
            recordPass('Pre-Rebrand Notice', `${pageTitleTag} - No historical notice for post-rebrand article`);
          } else {
            recordFail('Pre-Rebrand Notice', `${pageTitleTag} - Unexpected pre-rebrand notice`, `Found ${preRebrandCount}`);
          }
        }

        // 6. Content Hygiene: Check for unrendered markdown artifacts or leftover curly brace tags
        const bodyHtml = await page.locator('.post-body').innerHTML();
        const bodyText = await page.locator('.post-body').innerText();

        // Check for "{ target=" or "{:" or "{." or "## ("
        const rawTagMatches = bodyText.match(/\{\s*[:.#]?\s*target[^\}]*\}/gi) || [];
        const rawAttribMatches = bodyText.match(/\{:\s*[^}]+\}/g) || [];
        const rawMkdocsAnnotations = bodyHtml.match(/##\s*\(\d+\)!/g) || [];

        if (rawTagMatches.length > 0 || rawAttribMatches.length > 0) {
          recordWarn('Markdown Hygiene', `${pageTitleTag} - Raw markdown attribute tags found in text`, `${[...rawTagMatches, ...rawAttribMatches].join(', ')}`);
        }
        if (rawMkdocsAnnotations.length > 0) {
          recordWarn('Markdown Hygiene', `${pageTitleTag} - MkDocs annotation syntax ## (N)! rendered into HTML`, `${rawMkdocsAnnotations.join(', ')}`);
        }

        // Check for broken markdown links [Text](url) rendered as literal text
        const unrenderedMarkdownLinks = bodyText.match(/\[[^\]]+\]\((https?:\/\/[^\)]+|\/[^\)]+)\)/g);
        if (unrenderedMarkdownLinks && unrenderedMarkdownLinks.length > 0) {
          recordFail('Markdown Hygiene', `${pageTitleTag} - Unrendered markdown links detected in text`, unrenderedMarkdownLinks.join('; '));
        }

        // Semantic SEO: Ensure strictly ONE h1 on detail page
        const h1Count = await page.locator('h1').count();
        if (h1Count === 1) {
          recordPass('Semantic SEO', `${pageTitleTag} - Exactly one h1 element found`);
        } else {
          recordFail('Semantic SEO', `${pageTitleTag} - Expected 1 h1, found ${h1Count}`);
        }

        // 7. Special check for 2026er Performance Bottleneck article (Mermaid rendering)
        if (item.hasMermaid && lang === 'en') {
          console.log('\n  [Detailed Inspection] Mermaid Diagram in unblocking-apps-by-fixing-a-performance-bottleneck:');
          
          // Wait briefly for client-side mermaid rendering
          await page.waitForSelector('.mermaid-diagram svg, svg[id^="mermaid-svg"]', { timeout: 4000 }).catch(() => {});

          // Check DOM structure for code block or svg
          const mermaidContainer = await page.locator('.mermaid-diagram, svg[id^="mermaid-svg"]').first();
          const mermaidSvg = await page.locator('.mermaid-diagram svg, svg[id^="mermaid-svg"]').first();
          const hasSvg = (await mermaidSvg.count()) > 0;
          const mermaidPre = await page.locator('pre:has-text("flowchart TD")').first();
          const hasPre = (await mermaidPre.count()) > 0;

          let blockTag = hasSvg ? 'div.mermaid-diagram' : (hasPre ? 'pre' : 'unknown');
          let blockClasses = hasSvg ? 'mermaid-diagram' : (hasPre ? await mermaidPre.getAttribute('class') : '');

          results.mermaidAnalysis = {
            hasSvg,
            hasPre,
            blockTag,
            blockClasses,
            summary: hasSvg 
              ? 'Rendered as interactive/visual SVG diagram via Mermaid runtime' 
              : `Rendered as plain syntax-highlighted code block (<${blockTag} class="${blockClasses}">)`
          };

          console.log(`    -> Has SVG: ${hasSvg}`);
          console.log(`    -> Has Pre: ${hasPre}`);
          console.log(`    -> Summary: ${results.mermaidAnalysis.summary}`);

          if (hasSvg) {
            recordPass('Mermaid Diagram', 'Mermaid rendered as visual SVG');
            const mermaidShot = path.join(SCREENSHOTS_DIR, '07_mermaid_svg_rendered.png');
            await mermaidSvg.screenshot({ path: mermaidShot });
          } else {
            recordFail('Mermaid Diagram', 'Mermaid not rendered as diagram, still raw code block', results.mermaidAnalysis.summary);
            if (hasPre) {
              const mermaidShot = path.join(SCREENSHOTS_DIR, '07_mermaid_codeblock.png');
              await mermaidPre.screenshot({ path: mermaidShot });
            }
          }
        }

        // Screenshots for key articles
        if (item.slug === 'unblocking-apps-by-fixing-a-performance-bottleneck' && lang === 'de') {
          const shotPath = path.join(SCREENSHOTS_DIR, '04_post_with_cover_de.png');
          await page.screenshot({ path: shotPath, fullPage: false });
        }
        if (item.slug === 'eating-your-own-dog-food' && lang === 'de') {
          const shotPath = path.join(SCREENSHOTS_DIR, '05_pre_rebrand_post_de.png');
          await page.screenshot({ path: shotPath, fullPage: false });
        }
        if (item.slug === 'eating-your-own-dog-food' && lang === 'en') {
          const shotPath = path.join(SCREENSHOTS_DIR, '06_pre_rebrand_post_en.png');
          await page.screenshot({ path: shotPath, fullPage: false });
        }
        if (item.slug === 'shared-directories' && lang === 'de') {
          const shotPath = path.join(SCREENSHOTS_DIR, '08_post_with_inline_images.png');
          await page.screenshot({ path: shotPath, fullPage: false });
        }

      } catch (err) {
        recordFail('Detail Page', `${pageTitleTag}`, err);
      }
    }
  }

  // -------------------------------------------------------------
  // SUITE 5: RSS Feeds
  // -------------------------------------------------------------
  console.log('\n--- SUITE 5: RSS Feeds ---');
  for (const lang of ['de', 'en']) {
    const feedUrl = `${BASE_URL}/${lang}/blog/rss.xml`;
    try {
      const resp = await page.request.get(feedUrl);
      const status = resp.status();
      const contentType = resp.headers()['content-type'] || '';
      const body = await resp.text();

      const is200 = status === 200;
      const isXml = contentType.includes('xml') || body.startsWith('<?xml');
      const hasChannel = body.includes('<channel>') && body.includes('</channel>');
      const itemCount = (body.match(/<item>/g) || []).length;

      if (is200 && isXml && hasChannel && itemCount === 13) {
        recordPass('RSS Feeds', `/${lang}/blog/rss.xml valid and has 13 items`, `Status: ${status}, Items: ${itemCount}`);
      } else {
        recordFail('RSS Feeds', `/${lang}/blog/rss.xml check`, `Status: ${status}, Content-Type: ${contentType}, Items: ${itemCount}`);
      }
    } catch (err) {
      recordFail('RSS Feeds', `/${lang}/blog/rss.xml`, err);
    }
  }

  await browser.close();

  // -------------------------------------------------------------
  // SUMMARY REPORT
  // -------------------------------------------------------------
  console.log(`\n======================================================`);
  console.log(`BLOG E2E TEST RUN SUMMARY`);
  console.log(`======================================================`);
  console.log(`Total Tests Run: ${results.passed + results.failed}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Warnings: ${results.warnings}`);
  console.log(`Images Checked: ${results.imagesChecked} (Failed: ${results.imagesFailed})`);
  console.log(`Console Errors: ${results.consoleErrors.length}`);
  console.log(`Page Errors: ${results.pageErrors.length}`);
  console.log(`Network 4xx/5xx Errors: ${results.networkErrors.length}`);

  if (results.mermaidAnalysis) {
    console.log(`\nMermaid Analysis:`);
    console.log(`  ${results.mermaidAnalysis.summary}`);
  }

  if (results.issues.length > 0) {
    console.log(`\nIssues & Warnings Discovered:`);
    results.issues.forEach((iss) => console.log(`  - ${iss}`));
  }

  if (results.networkErrors.length > 0) {
    console.log(`\nNetwork Errors:`);
    results.networkErrors.forEach((ne) => console.log(`  - ${ne}`));
  }

  if (results.consoleErrors.length > 0) {
    console.log(`\nConsole Errors:`);
    results.consoleErrors.forEach((ce) => console.log(`  - ${ce}`));
  }
  } finally {
    if (browser) await browser.close().catch(() => {});
    if (serverProcess) serverProcess.kill('SIGTERM');
  }

  // Write results JSON artifact
  fs.writeFileSync(path.join(__dirname, 'e2e-blog-results.json'), JSON.stringify(results, null, 2));
  console.log(`\nFull results saved to tests/e2e-blog-results.json`);

  if (results.failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

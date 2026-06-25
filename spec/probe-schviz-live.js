const { firefox, chromium } = require('playwright');

async function probe(name, browserType, launchOptions = {}) {
  const browser = await browserType.launch({ headless: true, ...launchOptions });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });
  await page.goto('http://localhost:8081/tutorials/fundamentals/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const data = await page.evaluate(() => {
    const root = document.querySelector('.schviz');
    const texts = Array.from(root.querySelectorAll('text'));
    const interesting = texts.filter(el => [
      'alive',
      'un-staked',
      'staked',
      'chopped-up',
      'healed',
      'burned',
      'torpor',
      'intact',
      'disabled'
    ].includes((el.textContent || '').trim()) && !el.classList.contains('edge-label-halo'));
    function rect(el) {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
    }
    return {
      labels: interesting.map(el => ({
        text: (el.textContent || '').trim(),
        xAttr: el.getAttribute('x'),
        yAttr: el.getAttribute('y'),
        dominantBaseline: el.getAttribute('dominant-baseline'),
        textAnchor: el.getAttribute('text-anchor'),
        rect: rect(el)
      }))
    };
  });
  console.log('BROWSER', name);
  console.log(JSON.stringify(data, null, 2));
  await page.screenshot({ path: `/tmp/${name}-fundamentals-live.png`, fullPage: true });
  await browser.close();
}

(async() => {
  await probe('firefox', firefox);
  await probe('chromium', chromium, { args: ['--no-sandbox'] });
})().catch(err => { console.error(err); process.exit(1); });

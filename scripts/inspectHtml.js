const cheerio = require('cheerio');

(async () => {
  const res = await fetch('https://skyvipservices.com/locations');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const locations = [];

  $('img').each((i, el) => {
    const src = $(el).attr('src');
    if (src && src.includes('apple/64/')) {
        const countryDiv = $(el).closest('div');
        const countryName = countryDiv.text().trim();
        
        let container = countryDiv.parent();
        // Since we don't know exactly if it's the parent that wraps the airport list,
        // we'll look for airport links within the parent. If none, maybe it's next sibling.
        let aLinks = container.find("a[href^='/airport/']");
        
        let target = container;
        if (aLinks.length === 0) {
            target = countryDiv.next();
            aLinks = target.find("a[href^='/airport/']");
            if (aLinks.length === 0) {
                // Try siblings of parent
                target = container.next();
                aLinks = target.find("a[href^='/airport/']");
            }
        }

        const airports = [];
        aLinks.each((j, a) => {
             airports.push({
                 name: $(a).text().trim(),
                 link: 'https://skyvipservices.com' + $(a).attr('href')
             });
        });

        locations.push({ countryName, flagIcon: src, airportsCount: airports.length, airports });
    }
  });

  console.log(JSON.stringify(locations.slice(0, 3), null, 2));
})();

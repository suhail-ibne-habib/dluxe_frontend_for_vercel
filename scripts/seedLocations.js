const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cheerio = require('cheerio');
const path = require('path');

// Load environment from backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Location = require('../models/Location');
const connectDB = require('../config/db');

(async () => {
  await connectDB();
  console.log('Fetching locations from SkyVipServices...');
  const res = await fetch('https://skyvipservices.com/locations');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const locationsMap = new Map();

  $('img').each((i, el) => {
    const src = $(el).attr('src');
    if (src && src.includes('apple/64/')) {
        const countryDiv = $(el).closest('div');
        const countryName = countryDiv.text().trim();
        
        let container = countryDiv.parent();
        let aLinks = container.find("a[href^='/airport/']");
        
        let target = container;
        if (aLinks.length === 0) {
            target = countryDiv.next();
            aLinks = target.find("a[href^='/airport/']");
            if (aLinks.length === 0) {
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

        if (locationsMap.has(countryName)) {
            const loc = locationsMap.get(countryName);
            // filter duplicates just in case
            const existingLinks = new Set(loc.airports.map(x => x.link));
            airports.forEach(a => {
                if (!existingLinks.has(a.link)) {
                    loc.airports.push(a);
                    existingLinks.add(a.link);
                }
            });
        } else {
            locationsMap.set(countryName, { countryName, flagIcon: src, airports });
        }
    }
  });

  const locationsData = Array.from(locationsMap.values());
  console.log(`Found ${locationsData.length} countries. Starting database seed...`);

  try {
      await Location.deleteMany();
      await Location.insertMany(locationsData);
      console.log('Locations seeded successfully!');
      process.exit(0);
  } catch (error) {
      console.error('Error with seed:', error);
      process.exit(1);
  }
})();

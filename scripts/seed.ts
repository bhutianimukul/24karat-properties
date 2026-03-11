import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

async function seed() {
  console.log("Seeding 24 Karat Properties database...\n");

  // ── Cities ──
  const cities = [
    { id: "noida", name: "Noida", slug: "noida", state: "Uttar Pradesh", latitude: 28.5355, longitude: 77.3910 },
    { id: "dholera", name: "Dholera", slug: "dholera", state: "Gujarat", latitude: 22.2400, longitude: 72.1900 },
  ];
  const { error: cityErr } = await supabase.from("cities").upsert(cities);
  if (cityErr) throw cityErr;
  console.log("✓ Cities seeded (2)");

  // ── Areas ──
  const areas = [
    { id: "sector-150", city_id: "noida", name: "Sector 150", slug: "sector-150", latitude: 28.5678, longitude: 77.3901 },
    { id: "gaur-city", city_id: "noida", name: "Gaur City", slug: "gaur-city", latitude: 28.5900, longitude: 77.4300 },
    { id: "sector-1", city_id: "noida", name: "Sector 1", slug: "sector-1", latitude: 28.5850, longitude: 77.4250 },
    { id: "pari-chowk", city_id: "noida", name: "Pari Chowk", slug: "pari-chowk", latitude: 28.4700, longitude: 77.5000 },
    { id: "sector-16c", city_id: "noida", name: "Sector 16C", slug: "sector-16c", latitude: 28.5950, longitude: 77.4400 },
    { id: "sector-144", city_id: "noida", name: "Sector 144", slug: "sector-144", latitude: 28.5800, longitude: 77.4350 },
    { id: "greater-noida-west", city_id: "noida", name: "Greater Noida West", slug: "greater-noida-west", latitude: 28.5900, longitude: 77.4300 },
    { id: "yamuna-expressway", city_id: "noida", name: "Yamuna Expressway", slug: "yamuna-expressway", latitude: 28.4500, longitude: 77.5500 },
    { id: "sector-16", city_id: "noida", name: "Sector 16", slug: "sector-16", latitude: 28.5700, longitude: 77.3200 },
    { id: "sector-12", city_id: "noida", name: "Sector 12", slug: "sector-12", latitude: 28.5900, longitude: 77.3300 },
    { id: "dholera-sir", city_id: "dholera", name: "Dholera SIR", slug: "dholera-sir", latitude: 22.2400, longitude: 72.1900 },
    { id: "tp-40", city_id: "dholera", name: "TP-40", slug: "tp-40", latitude: 22.2500, longitude: 72.2000 },
    { id: "tp-41", city_id: "dholera", name: "TP-41", slug: "tp-41", latitude: 22.2600, longitude: 72.2100 },
    { id: "dholera-expressway", city_id: "dholera", name: "Dholera Expressway", slug: "dholera-expressway", latitude: 22.2300, longitude: 72.1800 },
    { id: "dholera-solar-park", city_id: "dholera", name: "Solar Park Zone", slug: "dholera-solar-park", latitude: 22.2200, longitude: 72.1700 },
  ];
  const { error: areaErr } = await supabase.from("areas").upsert(areas);
  if (areaErr) throw areaErr;
  console.log("✓ Areas seeded (" + areas.length + ")");

  // ── Properties ──
  const properties = [
    {
      id: "p1", city_id: "noida", area_id: "sector-150",
      title: "3BHK Premium Flat in ATS Pristine", slug: "3bhk-ats-pristine-sector-150",
      description: "Spacious 3BHK apartment in one of Sector 150's most premium societies. East-facing, fully furnished with modular kitchen. Walking distance to Botanical Garden metro.",
      property_type: "flat", transaction_type: "sell", status: "active",
      price: 9500000, price_per_sqft: 6800, area_sqft: 1400,
      bedrooms: 3, bathrooms: 2, floor_number: 12, total_floors: 25,
      facing: "East", year_built: 2019, is_featured: true,
      latitude: 28.5678, longitude: 77.3901,
      address: "ATS Pristine, Sector 150, Noida",
      amenities: ["Swimming Pool", "Gym", "Club House", "Power Backup", "24x7 Security", "Parking"],
      possession_date: "2019-06-01",
    },
    {
      id: "p2", city_id: "noida", area_id: "gaur-city",
      title: "2BHK Ready to Move in Gaur City", slug: "2bhk-gaur-city-greater-noida-west",
      description: "Well-maintained 2BHK in Gaur City 2. South-facing with balcony. Close to schools, hospital, and market. Ideal for families and first-time buyers.",
      property_type: "flat", transaction_type: "sell", status: "active",
      price: 4200000, price_per_sqft: 4200, area_sqft: 1000,
      bedrooms: 2, bathrooms: 2, floor_number: 7, total_floors: 18,
      facing: "South", year_built: 2017, is_featured: false,
      latitude: 28.5900, longitude: 77.4300,
      address: "Gaur City 2, Greater Noida West",
      amenities: ["Gym", "Park", "Power Backup", "Security", "Parking"],
      possession_date: "2017-12-01",
    },
    {
      id: "p3", city_id: "noida", area_id: "sector-1",
      title: "3BHK in Ace Divino with Club Membership", slug: "3bhk-ace-divino-sector-1",
      description: "Premium 3BHK in Ace Divino, Sector 1 Greater Noida West. Comes with club membership, reserved parking, and modular kitchen. RERA registered.",
      property_type: "flat", transaction_type: "sell", status: "active",
      price: 6500000, price_per_sqft: 5200, area_sqft: 1250,
      bedrooms: 3, bathrooms: 2, floor_number: 15, total_floors: 22,
      facing: "North-East", year_built: 2020, is_featured: true,
      latitude: 28.5850, longitude: 77.4250,
      address: "Ace Divino, Sector 1, Greater Noida West",
      amenities: ["Swimming Pool", "Gym", "Club House", "Tennis Court", "Power Backup", "24x7 Security", "CCTV", "Parking"],
      possession_date: "2020-03-01",
    },
    {
      id: "p4", city_id: "noida", area_id: "pari-chowk",
      title: "Commercial Shop in Omaxe Connaught Place", slug: "shop-omaxe-connaught-place-pari-chowk",
      description: "Prime commercial shop in Omaxe Connaught Place near Pari Chowk, Greater Noida. High footfall area. Ground floor, road facing. Currently rented at 35K/month.",
      property_type: "shop", transaction_type: "sell", status: "active",
      price: 8500000, price_per_sqft: 17000, area_sqft: 500,
      bedrooms: null, bathrooms: 1, floor_number: 0, total_floors: 3,
      facing: "Road Facing", year_built: 2015, is_featured: true,
      latitude: 28.4700, longitude: 77.5000,
      address: "Omaxe Connaught Place, Pari Chowk, Greater Noida",
      amenities: ["Power Backup", "Security", "Parking", "Elevator"],
      possession_date: "2015-01-01",
    },
    {
      id: "p5", city_id: "noida", area_id: "sector-16c",
      title: "3BHK in Mahagun Mywoods", slug: "3bhk-mahagun-mywoods-sector-16c",
      description: "Affordable 3BHK in Mahagun Mywoods Phase 2. Well-maintained society with all amenities. Near schools and hospital.",
      property_type: "flat", transaction_type: "sell", status: "active",
      price: 5200000, price_per_sqft: 4300, area_sqft: 1210,
      bedrooms: 3, bathrooms: 2, floor_number: 9, total_floors: 20,
      facing: "West", year_built: 2018, is_featured: false,
      latitude: 28.5950, longitude: 77.4400,
      address: "Mahagun Mywoods, Sector 16C, Greater Noida West",
      amenities: ["Gym", "Park", "Power Backup", "Security", "Parking", "Children Play Area"],
      possession_date: "2018-09-01",
    },
    {
      id: "p6", city_id: "noida", area_id: "sector-144",
      title: "2BHK in Gulshan Botnia", slug: "2bhk-gulshan-botnia-sector-144",
      description: "Compact 2BHK in Gulshan Botnia. Well-ventilated, north-facing. Society with good maintenance. Budget-friendly investment option.",
      property_type: "flat", transaction_type: "sell", status: "active",
      price: 3500000, price_per_sqft: 3890, area_sqft: 900,
      bedrooms: 2, bathrooms: 1, floor_number: 5, total_floors: 14,
      facing: "North", year_built: 2016, is_featured: false,
      latitude: 28.5800, longitude: 77.4350,
      address: "Gulshan Botnia, Sector 144, Greater Noida West",
      amenities: ["Park", "Power Backup", "Security", "Parking"],
      possession_date: "2016-06-01",
    },
    {
      id: "d1", city_id: "dholera", area_id: "dholera-sir",
      title: "Residential Plot near Dholera Airport", slug: "plot-dholera-sir-airport-zone",
      description: "200 sq yard residential plot in Dholera SIR near the upcoming international airport. NA/NOC clear. Road-facing plot in a planned township.",
      property_type: "plot", transaction_type: "sell", status: "active",
      price: 1800000, price_per_sqft: 1000, area_sqft: 1800,
      bedrooms: null, bathrooms: null, floor_number: null, total_floors: null,
      facing: "East", year_built: null, is_featured: true,
      latitude: 22.2400, longitude: 72.1900,
      address: "Near Airport Zone, Dholera SIR, Gujarat",
      amenities: ["Road Connectivity", "Electricity", "Water", "Boundary Wall"],
      possession_date: null,
    },
    {
      id: "d2", city_id: "dholera", area_id: "tp-40",
      title: "Commercial Plot in TP-40, Dholera", slug: "commercial-plot-tp40-dholera",
      description: "Commercial plot in TP-40 zone of Dholera SIR. Ideal for warehouse, office, or mixed-use development. Close to upcoming expressway.",
      property_type: "plot", transaction_type: "sell", status: "active",
      price: 3200000, price_per_sqft: 800, area_sqft: 4000,
      bedrooms: null, bathrooms: null, floor_number: null, total_floors: null,
      facing: "Road Facing", year_built: null, is_featured: false,
      latitude: 22.2500, longitude: 72.2000,
      address: "TP-40, Dholera SIR, Gujarat",
      amenities: ["Road Connectivity", "Electricity", "Water"],
      possession_date: null,
    },
    {
      id: "d3", city_id: "dholera", area_id: "tp-41",
      title: "Investment Plot in TP-41, Dholera SIR", slug: "investment-plot-tp41-dholera",
      description: "150 sq yard residential plot in TP-41. Government-approved layout with clear documentation. Excellent long-term investment opportunity in India's first smart city.",
      property_type: "plot", transaction_type: "sell", status: "active",
      price: 1200000, price_per_sqft: 890, area_sqft: 1350,
      bedrooms: null, bathrooms: null, floor_number: null, total_floors: null,
      facing: "North", year_built: null, is_featured: false,
      latitude: 22.2600, longitude: 72.2100,
      address: "TP-41, Dholera SIR, Gujarat",
      amenities: ["Road Connectivity", "Electricity", "Water", "Garden"],
      possession_date: null,
    },
  ];

  const { error: propErr } = await supabase.from("properties").upsert(properties);
  if (propErr) throw propErr;
  console.log("✓ Properties seeded (" + properties.length + ")");

  // ── Property Images ──
  function makeImages(propertyId: string, seeds: number[]) {
    return seeds.map((seed, i) => ({
      property_id: propertyId,
      url: `https://picsum.photos/seed/${seed}/800/500`,
      sort_order: i,
      is_primary: i === 0,
    }));
  }

  const images = [
    ...makeImages("p1", [101, 102, 103, 104, 105]),
    ...makeImages("p2", [201]),
    ...makeImages("p3", [301, 302, 303]),
    ...makeImages("p4", [401]),
    ...makeImages("p5", [501]),
    ...makeImages("p6", [601]),
    ...makeImages("d1", [701]),
    ...makeImages("d2", [801]),
    ...makeImages("d3", [901]),
  ];

  // Delete existing images first (to avoid duplicates on re-seed)
  await supabase.from("property_images").delete().neq("id", "");
  const { error: imgErr } = await supabase.from("property_images").insert(images);
  if (imgErr) throw imgErr;
  console.log("✓ Property images seeded (" + images.length + ")");

  // ── Customer Vouches ──
  const vouches = [
    { customer_name: "Rajesh Kumar", customer_location: "Noida, UP", property_name: "3BHK in Ace Divino, Sector 1", property_type: "flat", property_city: "Greater Noida West", property_area: "Sector 1", purchase_date: "2024-08-15", transaction_type: "sell", review: "Kawal ji helped us find the perfect flat for our family. He personally took us to multiple sites, explained the pros and cons of each society, and even got us a better rate than what was being offered online. The documentation was handled smoothly — from agreement to registry, he was there at every step. Highly trustworthy!", experience_rating: 5, would_recommend: true, highlights: ["Personal site visits", "Honest pricing", "Complete documentation support"], sort_order: 1 },
    { customer_name: "Priya & Ankit Sharma", customer_location: "Delhi", property_name: "Commercial Shop, Gaur City Mall", property_type: "shop", property_city: "Greater Noida West", property_area: "Gaur City", purchase_date: "2024-05-20", transaction_type: "sell", review: "We were looking for a commercial investment and had zero experience. Kawal sir not only showed us the best options but also explained the rental yield potential, maintenance costs, and resale value for each. He connected us with his lawyer for title verification and the entire process from booking to registry took just 3 weeks. Incredible service!", experience_rating: 5, would_recommend: true, highlights: ["Investment guidance", "Legal team support", "Fast registry"], sort_order: 2 },
    { customer_name: "Amit Patel", customer_location: "Ahmedabad, Gujarat", property_name: "Residential Plot in Dholera SIR", property_type: "plot", property_city: "Dholera", property_area: "Dholera SIR", purchase_date: "2025-01-10", transaction_type: "sell", review: "I was skeptical about investing in Dholera from Ahmedabad, but Kawal bhai made the entire process remote-friendly. He sent videos of the plot, shared government documents about the smart city development, and handled the registration through his local contacts. The plot has already appreciated 15% in 6 months. Very happy with the decision.", experience_rating: 5, would_recommend: true, highlights: ["Remote buying support", "Government docs shared", "Already seeing returns"], sort_order: 3 },
    { customer_name: "Dr. Sunita Verma", customer_location: "Lucknow, UP", property_name: "2BHK in Gulshan Botnia", property_type: "flat", property_city: "Greater Noida West", property_area: "Sector 144", purchase_date: "2023-11-05", transaction_type: "sell", review: "As a single woman buying my first property, I was nervous about the whole process. Kawal ji and his team were extremely patient. They helped me with bank loan processing at SBI, got me a competitive interest rate, and were present at the sub-registrar office on the day of registry. Even after the purchase, they helped me with the society transfer. This level of after-purchase care is rare.", experience_rating: 5, would_recommend: true, highlights: ["Loan assistance", "Present at registry", "After-purchase support"], sort_order: 4 },
    { customer_name: "Mohammed Faiz", customer_location: "Noida, UP", property_name: "Office Space in Stellar IT Park", property_type: "office", property_city: "Greater Noida", property_area: "Sector 62", purchase_date: "2024-03-18", transaction_type: "sell", review: "Needed a small office for my startup. Kawal bhai showed me 7 options in a single day and was upfront about which ones were overpriced. He negotiated a 12% discount from the builder directly and also introduced me to an interior designer who set up the office within budget. Real end-to-end help.", experience_rating: 5, would_recommend: true, highlights: ["Negotiated 12% discount", "Interior referral", "Honest about pricing"], sort_order: 5 },
    { customer_name: "Deepak & Meena Gupta", customer_location: "Ghaziabad, UP", property_name: "4BHK Villa in Gaur Yamuna City", property_type: "villa", property_city: "Greater Noida", property_area: "Yamuna Expressway", purchase_date: "2024-07-22", transaction_type: "sell", review: "We had been looking for a villa for over a year with no luck. Other dealers kept pushing properties that didn't match our needs. Kawal ji actually listened to what we wanted — spacious, gated community, good school nearby — and found us exactly that. His connection with the builder got us a payment plan that worked for us. The legal team did thorough due diligence. Very satisfied.", experience_rating: 5, would_recommend: true, highlights: ["Actually listened to needs", "Builder connection", "Flexible payment plan"], sort_order: 6 },
    { customer_name: "Ravi Teja K.", customer_location: "Hyderabad, Telangana", property_name: "Plot near Dholera International Airport", property_type: "plot", property_city: "Dholera", property_area: "Near Airport Zone", purchase_date: "2025-02-14", transaction_type: "sell", review: "Invested in Dholera based on Kawal's recommendation after seeing the smart city progress. He arranged a site visit, showed me the exact location on government maps, and connected me with a local lawyer for title verification. The entire thing was done in 10 days including registry. Very professional for a long-distance deal.", experience_rating: 4, would_recommend: true, highlights: ["Site visit arranged", "Title verification", "Completed in 10 days"], sort_order: 7 },
    { customer_name: "Sonal Agarwal", customer_location: "Noida, UP", property_name: "3BHK in ATS Pristine, Sector 150", property_type: "flat", property_city: "Noida", property_area: "Sector 150", purchase_date: "2023-06-30", transaction_type: "sell", review: "Second time working with Kawal ji. First was a 2BHK for rental investment, now upgraded to a bigger flat for living. Both times, the process was smooth and transparent. No hidden charges, no surprises. He even helped us find a good tenant for the old flat within a week. That's the kind of relationship you build with a good consultant.", experience_rating: 5, would_recommend: true, highlights: ["Repeat client", "Tenant finding help", "No hidden charges"], sort_order: 8 },
    { customer_name: "Harpreet Singh", customer_location: "Chandigarh, Punjab", property_name: "Shop in Omaxe Connaught Place", property_type: "shop", property_city: "Greater Noida", property_area: "Pari Chowk", purchase_date: "2024-01-08", transaction_type: "sell", review: "Bought a commercial shop as an investment from Chandigarh. Kawal ji handled everything remotely — from shortlisting to legal to registry. His lawyer verified the builder's title and NOCs. The stamp duty and registration were handled with no hassle. Post-purchase, he also helped set up a rental agreement with a tenant he found. Full package.", experience_rating: 5, would_recommend: true, highlights: ["Remote deal handling", "NOC verification", "Rental agreement setup"], sort_order: 9 },
    { customer_name: "Neha Kapoor", customer_location: "Gurugram, Haryana", property_name: "2BHK in Supertech Eco Village", property_type: "flat", property_city: "Greater Noida", property_area: "Sector 1", purchase_date: "2024-09-12", transaction_type: "sell", review: "Was looking for a budget-friendly flat as my first investment. Most agents only want to sell expensive properties, but Kawal sir genuinely helped me find something within my budget. He was transparent about the society's maintenance, builder reputation, and resale potential. Got my HDFC loan approved within 2 weeks with his bank contact's help.", experience_rating: 4, would_recommend: true, highlights: ["Budget-friendly options", "Honest builder reviews", "Loan approved in 2 weeks"], sort_order: 10 },
    { customer_name: "Vikram Joshi", customer_location: "Mumbai, Maharashtra", property_name: "5 Plots (Portfolio) in Dholera SIR", property_type: "plot", property_city: "Dholera", property_area: "TP-40 & TP-41", purchase_date: "2024-12-20", transaction_type: "sell", review: "I work with several property consultants across India. Kawal is one of the few who actually does his homework. He prepared a detailed comparison of 12 plots across different TPs in Dholera, with distances from upcoming airport, expressway access, and projected development timeline. Bought 5 plots through him. Serious investor? Work with this team.", experience_rating: 5, would_recommend: true, highlights: ["Detailed comparisons", "Serious investor support", "Portfolio building"], sort_order: 11 },
    { customer_name: "Anita & Suresh Reddy", customer_location: "Bengaluru, Karnataka", property_name: "3BHK in Mahagun Mywoods", property_type: "flat", property_city: "Greater Noida West", property_area: "Sector 16C", purchase_date: "2023-09-15", transaction_type: "sell", review: "We relocated from Bangalore and needed a home in Noida quickly. Kawal ji arranged back-to-back visits over a weekend, helped us with address proof for the loan, and even recommended a good packers & movers service. Two years later, we're settled and happy. He still checks in sometimes to see how we're doing. That personal touch means a lot.", experience_rating: 5, would_recommend: true, highlights: ["Relocation support", "Weekend site visits", "Personal follow-up"], sort_order: 12 },
  ];

  await supabase.from("customer_vouches").delete().neq("id", "");
  const { error: vouchErr } = await supabase.from("customer_vouches").insert(vouches);
  if (vouchErr) throw vouchErr;
  console.log("✓ Customer vouches seeded (" + vouches.length + ")");

  // ── City Videos ──
  const videos = [
    { city_id: "dholera", city_name: "Dholera", video_url: "https://www.youtube.com/watch?v=Y4gyMSCS-RE", title: "Dholera Smart City — India's Biggest Mega Project", description: "Watch how Dholera SIR is transforming into India's first greenfield smart city with international airport, expressway, and massive infrastructure development.", sort_order: 0 },
  ];

  await supabase.from("city_videos").delete().neq("id", "");
  const { error: vidErr } = await supabase.from("city_videos").insert(videos);
  if (vidErr) throw vidErr;
  console.log("✓ City videos seeded (" + videos.length + ")");

  console.log("\n✅ Database seeded successfully!");
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});

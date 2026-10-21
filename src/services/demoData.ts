/**
 * Demo event data for AuraPlan AI.
 * Provides pre-populated, realistic event data for evaluators to test
 * all dashboard features immediately without requiring an API key.
 *
 * @module demoData
 */

import type { EventFormInput, EventPlan } from '@/types/event';

/**
 * Returns a pre-populated EventFormInput for a Rustic Garden Wedding.
 */
export function getDemoEventInput(): EventFormInput {
  return {
    eventType: 'wedding',
    theme: 'Enchanted Rustic Garden Romance',
    guestCount: 150,
    totalBudget: 45000,
    eventDate: '2026-11-20',
    location: 'Willow Creek Vineyard & Estate, Napa Valley, CA',
    dietaryPreferences: 'Vegetarian options required (approx 25%), 5 Gluten-Free guests, Nut-free desserts',
    culturalPreferences: 'Blend of Indian & Western traditions: floral garland exchange ceremony, Mehndi station during cocktail hour',
  };
}

/**
 * Returns a complete, rich EventPlan demo object with full budget breakdown,
 * chronological milestones, smart vendor items with vetting/negotiation tips,
 * and creative idea board with hex color palettes.
 */
export function getDemoPlan(): EventPlan {
  const now = new Date().toISOString();
  return {
    id: 'demo-rustic-garden-wedding-2026',
    createdAt: now,
    updatedAt: now,
    eventInput: getDemoEventInput(),
    budget: [
      {
        category: 'Venue & Rentals',
        allocated: 13500,
        estimated: 13000,
        actual: 12800,
        notes: 'Willow Creek Estate rental includes bridal suite, tables, wooden cross-back chairs, and outdoor heaters for evening chill.',
      },
      {
        category: 'Catering & Bar',
        allocated: 11250,
        estimated: 11000,
        actual: 11500,
        notes: 'Farm-to-table dinner menu with craft cocktail bar package. Slightly exceeded initial estimate due to late addition of midnight woodfired pizza snack.',
      },
      {
        category: 'Decor & Florals',
        allocated: 6750,
        estimated: 7000,
        actual: 6900,
        notes: 'Locally sourced wild florals, eucalyptus garlands, fairy light canopy over dinner tables, custom wooden welcome signage.',
      },
      {
        category: 'Entertainment & Music',
        allocated: 6750,
        estimated: 6500,
        actual: 6200,
        notes: 'Acoustic duo for ceremony and cocktail hour; high-energy 5-piece live dance band with DJ set for reception.',
      },
      {
        category: 'Miscellaneous & Contingency',
        allocated: 6750,
        estimated: 6000,
        actual: 5800,
        notes: 'Covers day-of coordinator assistant fees, marriage license, gratuities for service staff, and guest welcome gift bags.',
      },
    ],
    timeline: [
      {
        id: 'milestone-1',
        title: 'Lock Venue & Date',
        description: 'Finalize contract and pay deposit for Willow Creek Vineyard. Ensure outdoor rain backup pavilion is included.',
        dueDate: '2026-06-01',
        status: 'completed',
        priority: 'high',
      },
      {
        id: 'milestone-2',
        title: 'Book Photographer & Videographer',
        description: 'Sign contract with editorial fine-art photographer; schedule golden hour engagement shoot.',
        dueDate: '2026-07-15',
        status: 'completed',
        priority: 'high',
      },
      {
        id: 'milestone-3',
        title: 'Catering Menu Tasting & Bar Selection',
        description: 'Taste seasonal entrees, finalize vegetarian/GF meal counts, and design signature his & hers cocktails.',
        dueDate: '2026-08-10',
        status: 'completed',
        priority: 'high',
      },
      {
        id: 'milestone-4',
        title: 'Send Formal Invitations & Launch RSVP Website',
        description: 'Mail foil-pressed botanical invitations with QR code linking to digital RSVP and dietary restriction tracker.',
        dueDate: '2026-09-01',
        status: 'in-progress',
        priority: 'medium',
      },
      {
        id: 'milestone-5',
        title: 'Floral Mock-up & Centerpiece Review',
        description: 'Review table mock-ups with florist. Ensure fragrant garden roses, ranunculus, and olive branches match color swatches.',
        dueDate: '2026-10-01',
        status: 'in-progress',
        priority: 'medium',
      },
      {
        id: 'milestone-6',
        title: 'Finalize Run-of-Show & Music Playlist',
        description: 'Confirm timeline with MC, sound engineer, and coordinator. Finalize "Must Play" and "Do Not Play" lists.',
        dueDate: '2026-10-25',
        status: 'pending',
        priority: 'high',
      },
      {
        id: 'milestone-7',
        title: 'Final Guest Count & Seating Chart',
        description: 'Lock headcount with caterer 14 days out; assemble custom calligraphy seating mirror.',
        dueDate: '2026-11-06',
        status: 'pending',
        priority: 'high',
      },
      {
        id: 'milestone-8',
        title: 'Day-Of Schedule: 10:00 AM Hair & Makeup',
        description: 'Bridal party arrives at Willow Creek bridal suite for styling and champagne brunch.',
        dueDate: '2026-11-20',
        status: 'pending',
        priority: 'medium',
      },
      {
        id: 'milestone-9',
        title: 'Day-Of Schedule: 03:30 PM Outdoor Ceremony',
        description: 'Guest seating begins with acoustic prelude; processional starts promptly at 04:00 PM.',
        dueDate: '2026-11-20',
        status: 'pending',
        priority: 'high',
      },
      {
        id: 'milestone-10',
        title: 'Day-Of Schedule: 06:30 PM Grand Entrance & Dinner',
        description: 'Dinner bell rings; sunset couple portraits wrap; farm-to-table family style meal served under string lights.',
        dueDate: '2026-11-20',
        status: 'pending',
        priority: 'medium',
      },
    ],
    vendors: [
      {
        id: 'vendor-1',
        category: 'Venue & Facilities',
        vendorName: 'Willow Creek Vineyard Estate',
        status: 'confirmed',
        estimatedCost: 13000,
        negotiationTips: [
          'Ask for complimentary access 2 hours earlier for floral and audio setup.',
          'Inquire if corkage fees can be waived if purchasing a minimum amount of venue-label wine.',
          'Negotiate package inclusion of patio heaters and ambient fire pit firewood.',
        ],
        vettingQuestions: [
          'What is the mandatory sound ordinance cutoff time for outdoor amplified music?',
          'Do you have a dedicated backup generator in case of weather outages?',
          'What are the exact cleanup responsibilities expected of outside caterers?',
        ],
        notes: 'Deposit paid; contract signed on May 15. Coordinator: Sarah Jenkins (sarah@willowcreekestate.com).',
        contactInfo: 'events@willowcreekestate.com | (707) 555-0144',
      },
      {
        id: 'vendor-2',
        category: 'Catering & Bar',
        vendorName: 'Artisan Harvest Culinary Co.',
        status: 'booked',
        estimatedCost: 11000,
        negotiationTips: [
          'Request free vendor meals for photographer, videographer, and band members.',
          'Ask for tiered pricing on children meals under 10 years old.',
          'Inquire about BYO dessert table serving fee waiver.',
        ],
        vettingQuestions: [
          'How do you manage cross-contamination for guests with severe celiac or nut allergies?',
          'What is the staff-to-guest ratio for family-style plated service?',
          'Are recycling and compost disposal handled by your culinary team?',
        ],
        notes: 'Tasting scheduled for Aug 10. Chef Marcus will create custom Indian-inspired appetizers for cocktail hour.',
        contactInfo: 'chef.marcus@artisanharvest.com | (707) 555-0182',
      },
      {
        id: 'vendor-3',
        category: 'Floral & Botanical Design',
        vendorName: 'Bloom & Wild Botanicals',
        status: 'booked',
        estimatedCost: 7000,
        negotiationTips: [
          'Repurpose ceremony arch floral installations to the reception sweetheart table.',
          'Opt for in-season local blooms (dahlias, ranunculus, olive foliage) rather than imported stems.',
          'Request reusable rented brass vessels instead of purchasing centerpieces.',
        ],
        vettingQuestions: [
          'Will you personally be on-site on the day of the event to handle floral placement and breakdown?',
          'How do you ensure delicate flowers stay hydrated in warm afternoon sun?',
          'What is your contingency plan if specific flower varietals fail market delivery?',
        ],
        notes: 'Deposit paid. Mood board approved. Delivery scheduled for 11:30 AM on wedding day.',
        contactInfo: 'elena@bloomandwildbotanicals.com | (415) 555-0199',
      },
      {
        id: 'vendor-4',
        category: 'Photography & Cinematography',
        vendorName: 'Lumiere Fine Art Imagery',
        status: 'confirmed',
        estimatedCost: 4500,
        negotiationTips: [
          'Bundle engagement session with full 8-hour wedding day coverage for a package discount.',
          'Request raw unedited video footage alongside the highlight film at no added charge.',
          'Ask for expedited 3-day sneak peek images for thank-you cards and social sharing.',
        ],
        vettingQuestions: [
          'Do you shoot with dual memory card slots for automatic real-time image redundancy?',
          'What is your backup plan if the primary photographer falls ill on event morning?',
          'Can we view a full online wedding gallery from a similar outdoor garden venue?',
        ],
        notes: 'Lead photographer: David Vance. Second shooter confirmed. Shot list provided.',
        contactInfo: 'david@lumiereimagery.com | (415) 555-0128',
      },
      {
        id: 'vendor-5',
        category: 'Music & Entertainment',
        vendorName: 'SoundWave Live Band & DJs',
        status: 'contacted',
        estimatedCost: 3500,
        negotiationTips: [
          'Ask for acoustic duo package during ceremony to be included with the 5-piece reception band.',
          'Request complimentary MC services for guest announcements and wedding party entrance.',
          'Inquire about off-peak Sunday or shoulder-month discounts.',
        ],
        vettingQuestions: [
          'Do you supply wireless microphones for officiant and toast speeches with feedback suppression?',
          'How many 15-minute breaks does the live band take, and will a DJ playlist run seamlessly during breaks?',
          'What are your electrical power and staging footprint requirements?',
        ],
        notes: 'Awaiting updated quote that includes 1 hour of Mehndi Bollywood dance party music.',
        contactInfo: 'booking@soundwaveband.com | (415) 555-0177',
      },
      {
        id: 'vendor-6',
        category: 'Event Coordination',
        vendorName: 'Ever After Planning & Design',
        status: 'booked',
        estimatedCost: 2500,
        negotiationTips: [
          'Book a "Month-of" coordination package rather than Day-of to get rehearsal direction included.',
          'Inquire if digital seating chart software access is complimentary with the contract.',
        ],
        vettingQuestions: [
          'How many weddings do you take on during the same weekend?',
          'Will you have an assistant coordinator on site with you on wedding day?',
          'What emergency kit supplies do you carry for unexpected wardrobe or decor issues?',
        ],
        notes: 'Lead planner: Rachel Torres. Master timeline handover meeting set for October 15.',
        contactInfo: 'rachel@everafterplanning.com | (707) 555-0163',
      },
    ],
    ideas: {
      themeIdeas: [
        {
          title: 'Enchanted Twilight Romance',
          description: 'Lush greenery, twinkling fairy lights, antiqued brass candelabras, and velvety jewel tones under an open vineyard canopy.',
          colorPalette: ['#2D5A27', '#E8C547', '#8E2800', '#F4EDE2', '#3E2723'],
          moodKeywords: ['Ethereal', 'Intimate', 'Warm', 'Botanical', 'Romantic'],
        },
        {
          title: 'Sun-Drenched Tuscan Vineyard',
          description: 'Terracotta ceramics, olive branch runners, warm amber glassware, and crisp linen napkins evoking the Italian countryside.',
          colorPalette: ['#C86D51', '#D4AF37', '#6B705C', '#FFE8D6', '#A5A58D'],
          moodKeywords: ['Rustic', 'Sunlit', 'Celebratory', 'Timeless', 'Abundant'],
        },
        {
          title: 'Modern Botanical Fusion',
          description: 'Crisp sage greens, clean white arches, marigold florals honoring Indian heritage, accented by brushed gold geometric lanterns.',
          colorPalette: ['#588157', '#F39C12', '#F8F9FA', '#C0392B', '#D4AC0D'],
          moodKeywords: ['Vibrant', 'Harmonious', 'Contemporary', 'Multicultural', 'Festive'],
        },
      ],
      menuSuggestions: [
        {
          category: 'Cocktail Hour Appetizers',
          items: [
            'Mini Spiced Samosa Tartlets with Mint & Tamarind Chutney',
            'Heirloom Tomato & Burrata Crostini with Basil Reduction',
            'Crispy Wild Mushroom Arancini with Truffle Aioli',
            'Grilled Tandoori Prawn Skewers with Cilantro Lime Glaze',
          ],
          dietaryNotes: 'Clear allergen signage; separate station for strict vegetarian guests.',
        },
        {
          category: 'Family-Style Main Entrees',
          items: [
            'Pan-Seared Pacific Halibut with Meyer Lemon Herb Butter',
            'Slow-Braised Short Ribs in Cabernet Reduction with Rosemary',
            'Paneer Tikka Masala Roulade over Saffron Basmati Pilaf (Vegetarian)',
            'Roasted Delicata Squash with Wild Rice, Cranberries & Pecans (Vegan/GF)',
          ],
          dietaryNotes: 'Plated individually for guests with celiac disease; all entrees nut-free.',
        },
        {
          category: 'Artisanal Desserts & Late Night',
          items: [
            'Three-Tier Naked Vanilla Bean Cake with Fig & Raspberry Preserves',
            'Cardamom Pistachio Macarons & Rosewater Panna Cotta Shooters',
            'Warm Woodfired Pizza Station (Margherita & Truffle Mushroom) at 10 PM',
          ],
          dietaryNotes: 'Dedicated GF/vegan dessert platter clearly designated on dessert display.',
        },
        {
          category: 'Signature Craft Cocktails',
          items: [
            '"The Vineyard Vow": Napa Cabernet, Spiced Pear Liqueur, Orange Twist',
            '"Napa Rose": Gin, Rosewater Essence, Fresh Grapefruit, Elderflower, Prosecco Float',
            '"Mango Sunset Mocktail": Alphonso Mango Puree, Sparkling Water, Mint & Jalapeno',
          ],
          dietaryNotes: 'High-end non-alcoholic craft mocktails available all evening.',
        },
      ],
      decorIdeas: [
        {
          area: 'Ceremony Altar & Aisle',
          suggestions: [
            'Handmade wooden octagonal pergola draped in airy chiffon fabric and cascading eucalyptus',
            'Aisle lined with potted olive trees and rustic hurricane lanterns with pillar candles',
            'Marigold flower pedal pathway for multicultural ceremony moment',
          ],
          estimatedCost: 2200,
        },
        {
          area: 'Reception Dining Pavilion',
          suggestions: [
            'Overhead canopy of warm amber fairy lights and hanging wicker pendant lights',
            'Long wooden farm tables with raw ivory linen runners and brass taper candlesticks',
            'Personalized botanical seed-paper place cards tucked into napkin folds',
          ],
          estimatedCost: 2800,
        },
        {
          area: 'Welcome Lounge & Photo Area',
          suggestions: [
            'Vintage velvet settee flanked by rattan accent chairs and kilim rugs',
            'Custom neon name sign mounted on a lush living boxwood photo backdrop wall',
            'Wooden welcome easel with hand-calligraphed schedule and beverage station',
          ],
          estimatedCost: 1200,
        },
        {
          area: 'Bar & Dance Floor',
          suggestions: [
            'Wooden barrel bar with suspended overhead floral bar rack and glass stemware',
            'Festoon string lighting surrounding the wooden parquet dance floor',
            'Basket of complimentary dancing flip-flops and warm cozy fleece wraps for evening',
          ],
          estimatedCost: 700,
        },
      ],
      entertainmentIdeas: [
        'Acoustic guitar and violin duo playing contemporary pop love songs for guest arrival and procession',
        'Interactive Mehndi artist corner during cocktail hour offering intricate henna hand designs',
        'Audio guestbook in a vintage rotary phone where loved ones record audio voicemails for the couple',
        'High-energy 5-piece dance band seamlessly alternating between 90s/00s dance classics and Bollywood beats',
        'Sparkler send-off tunnel at 11:00 PM for the couple\'s getaway departure',
      ],
    },
  };
}

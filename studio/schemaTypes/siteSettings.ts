import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'Default meta description used across the site (Rank Math style)',
    }),
    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      description: 'Canonical site URL (e.g. https://mahadevbook.com). Overrides env variable.',
    }),
    defineField({
      name: 'organizationName',
      title: 'Organization Name',
      type: 'string',
      initialValue: 'Mahadev Book',
      description: 'Used in structured data and title templates',
    }),
    defineField({
      name: 'ogImage',
      title: 'Default OG Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Default social sharing image (1200×630 recommended)',
      fields: [{name: 'alt', type: 'string', title: 'Alt text'}],
    }),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter / X Handle',
      type: 'string',
      description: 'Without @ — e.g. mahadevbook',
    }),
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics Measurement ID',
      type: 'string',
      description: 'GA4 Measurement ID, e.g. G-XXXXXXXXXX',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          return /^G-[A-Z0-9]+$/i.test(value)
            ? true
            : 'Use a valid GA4 ID like G-XXXXXXXXXX'
        }),
    }),
    defineField({
      name: 'googleSiteVerification',
      title: 'Google Search Console Verification',
      type: 'string',
      description: 'Content value from Google site verification meta tag',
    }),
    defineField({
      name: 'bingSiteVerification',
      title: 'Bing Webmaster Verification',
      type: 'string',
      description: 'Content value from Bing site verification meta tag',
    }),
    defineField({
      name: 'whatsappUrl',
      title: 'WhatsApp Link',
      type: 'url',
      description: 'Used for Login, Register, CTAs, and floating button',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Header Logo',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alt text'}],
    }),
    defineField({
      name: 'headerNav',
      title: 'Header Navigation',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          fields: [
            {name: 'label', type: 'string', title: 'Label', validation: (R: any) => R.required()},
            {name: 'href', type: 'string', title: 'URL / Hash', validation: (R: any) => R.required()},
          ],
          preview: {
            select: {title: 'label', subtitle: 'href'},
          },
        },
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        {name: 'description', type: 'text', title: 'Footer Description', rows: 3},
        {name: 'email', type: 'string', title: 'Support Email'},
        {name: 'copyright', type: 'string', title: 'Copyright Text'},
        {
          name: 'quickLinks',
          title: 'Quick Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'label', type: 'string', title: 'Label'},
                {name: 'href', type: 'string', title: 'URL / Hash'},
              ],
            },
          ],
        },
        {
          name: 'supportLinks',
          title: 'Support Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'label', type: 'string', title: 'Label'},
                {name: 'href', type: 'string', title: 'URL / Hash'},
              ],
            },
          ],
        },
        {
          name: 'socialLinks',
          title: 'Social Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'platform',
                  type: 'string',
                  title: 'Platform',
                  options: {
                    list: [
                      {title: 'Facebook', value: 'facebook'},
                      {title: 'Instagram', value: 'instagram'},
                      {title: 'Telegram', value: 'telegram'},
                      {title: 'Twitter', value: 'twitter'},
                    ],
                  },
                },
                {name: 'url', type: 'url', title: 'URL'},
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'whatsappTooltip',
      title: 'Floating WhatsApp Tooltip',
      type: 'string',
      initialValue: 'Get Instant ID On WhatsApp',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site Settings'}),
  },
})

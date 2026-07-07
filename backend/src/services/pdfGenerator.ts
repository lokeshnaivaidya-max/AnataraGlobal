import PDFDocument from 'pdfkit';

interface ResourceContent {
  title: string;
  category: string;
  description: string;
  sections: { heading: string; body: string }[];
}

const resources: Record<string, ResourceContent> = {
  'readiness-checklist': {
    title: 'Venture Readiness Checklist 2026',
    category: 'Checklist & Framework',
    description: 'A comprehensive 25-point framework covering corporate governance, financial structure, and market positioning that institutional investors analyze.',
    sections: [
      {
        heading: 'Legal & Corporate Structure',
        body: '1. Cap table is clean with all investor rights clearly documented.\n2. Corporate minutes are up to date and board resolutions properly filed.\n3. Intellectual property assignments executed for all founders and key employees.\n4. Articles of association allow for the issuance of preference shares.\n5. All material contracts have been reviewed for change-of-control provisions.',
      },
      {
        heading: 'Financial Controls & Reporting',
        body: '6. Audited financial statements for the past 2-3 fiscal years are available.\n7. Robust bookkeeping system in place with monthly management accounts.\n8. 3-5 year financial projection model with clear assumptions.\n9. Unit economics (LTV, CAC, Gross Margin) calculated and tracked.\n10. Budget vs actual variance analysis conducted quarterly.',
      },
      {
        heading: 'Product & IP Validation',
        body: '11. Core technology/product has a clear competitive moat (patents, trade secrets, or network effects).\n12. Product roadmap with milestones defined for the next 12-18 months.\n13. Technical architecture is scalable and documented.\n14. Third-party security audit or penetration test completed.\n15. Data privacy and GDPR/CCPA compliance measures in place.',
      },
      {
        heading: 'Market & Commercial Traction',
        body: '16. LTV/CAC ratio exceeds 3:1 and is improving quarter-over-quarter.\n17. Clear customer segmentation with ICP (Ideal Customer Profile) documented.\n18. Repeatable sales cycle with documented playbook.\n19. Net Revenue Retention (NRR) above 100% for SaaS or recurring models.\n20. At least 2-3 referenceable customers willing to speak with investors.',
      },
      {
        heading: 'Team & Governance',
        body: '21. Management team has relevant industry experience and a track record.\n22. Organisational chart with defined roles and reporting lines.\n23. ESOP or equity incentive plan in place for key hires.\n24. Advisory board or independent directors provide strategic oversight.\n25. Succession plan documented for key leadership roles.',
      },
    ],
  },
  'forecasting-guide': {
    title: 'Financial Forecasting Blueprint',
    category: 'Financial Modeling Guide',
    description: 'Step-by-step instructions on designing a three-statement financial projection model that highlights unit economics, margins, and capital efficiency.',
    sections: [
      {
        heading: 'Revenue Modeling',
        body: 'Choosing the right forecasting approach is critical. Bottom-up forecasting builds projections from unit-level metrics (customers, ASP, conversion rates) and is preferred by investors for its grounding in operational reality. Top-down forecasting starts with TAM/SAM/SOM and works backwards — useful for high-level narrative but less credible as a primary model. Best practice: use bottom-up as your primary, and top-down as a sanity check on market share assumptions.',
      },
      {
        heading: 'Cost Structure & Margins',
        body: 'Distinguish clearly between Cost of Goods Sold (COGS) — direct costs like hosting, payment processing, and customer support — and Operating Expenses (OpEx) — R&D, Sales & Marketing, G&A. Gross Margin should be calculated at the product line level. Track contribution margin (revenue less variable costs) to understand true unit profitability before allocated fixed costs.',
      },
      {
        heading: 'Sensitivity Analysis',
        body: 'Stress-test your projections under multiple scenarios. Base case: most likely assumptions. Downside case: churn increases 20%, conversion drops 15%, CAC rises 25%. Upside case: viral coefficient improves, enterprise deals close faster. Present all three scenarios to investors with a clear explanation of the key levers driving each case.',
      },
      {
        heading: 'Key VC Metrics Dashboard',
        body: 'Set up automatic calculations for: LTV (Average monthly revenue per customer / churn rate), CAC (total sales & marketing spend / new customers acquired), Payback Period (CAC / monthly gross margin per customer), Burn Rate (monthly OpEx less monthly revenue), Runway (cash balance / burn rate), and the SaaS Quick Ratio (new MRR / churned MRR). These metrics should flow from your core assumptions automatically.',
      },
      {
        heading: 'Capital Efficiency Planning',
        body: 'Map out how the capital raised will be deployed: hiring plan with costs and timelines, customer acquisition spend by channel, product development milestones, and working capital requirements. Investors want to see that every dollar raised has a clear path to value creation with measurable KPIs at each stage.',
      },
    ],
  },
  'msme-report': {
    title: 'The MSME Capital Growth Report',
    category: 'Market Intelligence',
    description: 'A study on alternative financing paths for MSMEs in emerging markets, detailing venture debt, revenue-based financing, and grants.',
    sections: [
      {
        heading: 'State of Alternative Lending',
        body: 'Fintech platforms are fundamentally reshaping access to capital for asset-light businesses. Alternative lending grew at a CAGR of 32% across emerging markets from 2021 to 2025, driven by digital underwriting, alternative credit scoring, and API-first banking infrastructure. Key players include KredX (India), Lulalend (South Africa), and Konfio (Mexico), each demonstrating that non-dilutive capital can be deployed at scale.',
      },
      {
        heading: 'Revenue-Based Financing (RBF)',
        body: 'RBF allows businesses to raise capital in exchange for a fixed percentage of future monthly revenue. The cost of capital typically ranges from 1.1x to 1.4x of the advance amount, with repayment periods of 3-18 months. Compared to equity dilution of 15-25% for a comparable raise, RBF can be significantly cheaper for high-margin, asset-light businesses. The key trade-off: higher monthly cash outflows vs. no loss of ownership or board control.',
      },
      {
        heading: 'Venture Debt for Tech Startups',
        body: 'Venture debt provides term loans, equipment financing, and revolving credit lines to venture-backed companies. Typically structured as a 3-4 year term with interest-only for the first 12-18 months, venture debt can extend runway by 6-12 months between equity rounds. The capital cost (12-18% APR all-in, plus warrants) is significantly cheaper than the dilution of a bridge round. Best used to finance growth CapEx, extend runway to hit a valuation milestone, or finance working capital ahead of a large deal.',
      },
      {
        heading: 'Strategic Corporate Partnerships',
        body: 'Joint ventures and strategic partnerships can fund market expansion without equity dilution. Models include: commercial agreements (minimum revenue guarantees, prepaid licenses), structured partnerships (joint venture with capital contributions from the corporate partner), and strategic investments (corporate venture capital with commercial agreements attached). MSMEs should pursue these when they need more than just capital — distribution channels, credibility, and operational expertise.',
      },
      {
        heading: 'Grant & Concessional Finance',
        body: 'Grants from development finance institutions (DFIs), impact funds, and government programmes provide non-dilutive capital for businesses addressing social or environmental goals. Typical grants range from USD 25,000 to USD 500,000 and often come with technical assistance. The application process is rigorous (3-9 months), and reporting requirements are substantial. Successful applicants demonstrate clear impact metrics, a strong theory of change, and matching funding commitments.',
      },
    ],
  },
};

export function generateResourcePdf(slug: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const resource = resources[slug];
    if (!resource) {
      reject(new Error(`Resource not found: ${slug}`));
      return;
    }

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
      info: {
        Title: resource.title,
        Author: 'Anatara Global',
        Subject: resource.category,
      },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Helper: accent color
    const ACCENT = '#008081';
    const DARK = '#1a1a1a';

    // --- Cover page ---
    doc.fontSize(10).fillColor('#666666').text('Anatara Global — Intellectual Capital', { align: 'left' });
    doc.moveDown(4);

    doc.fontSize(36).fillColor(DARK).font('Helvetica-Bold');
    doc.text(resource.title, { align: 'left' });
    doc.moveDown(0.5);

    doc.fontSize(14).fillColor(ACCENT).font('Helvetica');
    doc.text(resource.category, { align: 'left' });
    doc.moveDown(1.5);

    doc.fontSize(11).fillColor('#444444');
    doc.text(resource.description, { align: 'left', lineGap: 4 });
    doc.moveDown(2);

    // Divider line
    doc.moveTo(60, doc.y).lineTo(535, doc.y).strokeColor(ACCENT).lineWidth(1).stroke();
    doc.moveDown(0.5);
    doc.fontSize(9).fillColor('#999999').text('This document is prepared exclusively for clients and partners of Anatara Global.', { align: 'left' });

    // --- Table of Contents ---
    doc.addPage();
    doc.fontSize(20).fillColor(DARK).font('Helvetica-Bold').text('Table of Contents', { align: 'left' });
    doc.moveDown(0.5);
    doc.moveTo(60, doc.y).lineTo(330, doc.y).strokeColor(ACCENT).lineWidth(1).stroke();
    doc.moveDown(1);

    resource.sections.forEach((section, i) => {
      doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold').text(`${i + 1}.  ${section.heading}`, { lineGap: 6 });
    });

    // --- Content pages ---
    resource.sections.forEach((section, i) => {
      doc.addPage();

      // Section header
      doc.fontSize(13).fillColor(ACCENT).font('Helvetica-Bold').text(`${i + 1}. ${section.heading}`, { lineGap: 8 });

      // Decorative line
      doc.moveTo(60, doc.y).lineTo(250, doc.y).strokeColor(ACCENT).lineWidth(0.5).stroke();
      doc.moveDown(1);

      // Body text
      doc.fontSize(10).fillColor('#333333').font('Helvetica');
      const lines = section.body.split('\n');
      lines.forEach((line) => {
        // Check if it's a numbered item or heading
        if (/^\d+\./.test(line.trim())) {
          doc.font('Helvetica-Bold');
        } else {
          doc.font('Helvetica');
        }
        doc.text(line.trim(), { lineGap: 6, align: 'justify' });
      });

      // Page footer
      doc.fontSize(8).fillColor('#999999').font('Helvetica');
      doc.text(
        `${resource.title} — ${resource.category}`,
        60,
        doc.page.height - 50,
        { align: 'center', width: doc.page.width - 120 }
      );
    });

    // --- Final page ---
    doc.addPage();
    doc.fontSize(18).fillColor(DARK).font('Helvetica-Bold').text('Ready to Take the Next Step?', { align: 'left' });
    doc.moveDown(1);
    doc.fontSize(11).fillColor('#444444').font('Helvetica');
    doc.text(
      'At Anatara Global, we work with founders and enterprises to turn strategic insight into measurable outcomes. Whether you\'re preparing for your next fundraise, building a financial model, or exploring alternative capital structures, our advisors bring institutional expertise to growth-stage companies.',
      { lineGap: 6, align: 'justify' }
    );
    doc.moveDown(1.5);
    doc.fontSize(11).fillColor(ACCENT).font('Helvetica-Bold').text('Contact us: www.anataraglobal.com', { align: 'left' });
    doc.moveDown(0.5);
    doc.fontSize(9).fillColor('#999999').font('Helvetica').text('© 2026 Anatara Global. All rights reserved. This document is confidential and intended solely for the use of the recipient.', { align: 'left' });

    doc.end();
  });
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.Gemini_API_Key;

    // Comprehensive platform knowledge base for MediaHub AI assistant
    const systemInstructionText = `You are "MediaHub AI", the official intelligent support assistant and campaign advisor for MediaHub (Media Partner Hub).

--- YOUR PURPOSE ---
Your job is to answer questions about MediaHub accurately, clearly, and concisely in a friendly tone.

--- COMPREHENSIVE KNOWLEDGE BASE ---
1. ABOUT MEDIAHUB:
   - MediaHub is a full-featured Digital PR, Guest Posting, Content Marketing, and Publisher Marketplace platform.
   - It bridges the gap between Advertisers/Brands/Agencies and verified Publishers/Influencers.

2. FOR ADVERTISERS, BRANDS & AGENCIES:
   - Buy guest posts, sponsored articles, press release distribution, and backlinks.
   - Filter publishers by domain metrics: Domain Authority (DA), Domain Rating (DR), Organic Traffic, Trust Flow, Spam Score, Language, Category, and Turnaround Time (TAT).
   - Features: Real-time campaign tracking, transparent pricing, 100% money-back guarantee if articles are not published as agreed, custom content writing services, and white-label agency tools.

3. FOR PUBLISHERS & WEBSITE OWNERS:
   - Monetize traffic by listing your website, blog, or news platform.
   - Set custom prices per post/link, define editorial guidelines, and control allowed niches.
   - Enjoy fast payouts directly to bank or wallet once tasks are completed and verified.

4. FOR INFLUENCERS & CREATORS:
   - Partner with top brands for sponsored content, podcast features, social media shoutouts, and media campaigns.
   - Seamless workflow for asset delivery, task management, and payouts.

5. PRICING & GETTING STARTED:
   - Registration is free for Advertisers, Publishers, and Influencers (supports 1-Click Google Login and Email).
   - Exact guest post pricing depends on individual publisher metrics and catalog options available inside the dashboard.

6. CONTACT & SUPPORT:
   - Phone Support: +91 9490056002 (Available 24/7 Mon-Fri).
   - Live AI Support: You (MediaHub AI)!

--- RESPONSE STYLE RULES ---
- Provide helpful, clear, and nicely structured answers using markdown formatting (e.g. bold text, bullet points).
- Keep answers focused, engaging, direct, and professional.`;

    // Smart knowledge-base fallback response generator
    const getKnowledgeAnswer = (query: string): string => {
      const q = query.toLowerCase();
      if (q.includes("what is") || q.includes("about mediahub") || q.includes("who are you") || q.includes("how does it work")) {
        return "👋 **MediaHub** is a leading Digital PR, Guest Post & Publisher Marketplace! We connect Advertisers, Brands, and Agencies directly with high-authority Publishers and Influencers to publish sponsored articles, build top-tier backlinks, and scale online authority.";
      }
      if (q.includes("publisher") || q.includes("monetize") || q.includes("earn") || q.includes("website owner")) {
        return "🌐 **For Publishers & Website Owners:**\n- Monetize your website traffic by accepting sponsored guest post requests.\n- Set your own prices, guidelines, and turnaround times.\n- Track earnings with fast, guaranteed payouts upon task approval!";
      }
      if (q.includes("advertiser") || q.includes("brand") || q.includes("agency") || q.includes("guest post") || q.includes("pr") || q.includes("backlink")) {
        return "🚀 **For Advertisers, Brands & Agencies:**\n- Search and order guest posts & press releases across verified news and media sites.\n- Filter by DA, DR, Organic Traffic, Niche, and Turnaround Time.\n- Benefit from guaranteed publishing with a 100% money-back warranty and real-time order tracking!";
      }
      if (q.includes("price") || q.includes("cost") || q.includes("rate") || q.includes("fee")) {
        return "💰 **Pricing on MediaHub:**\nPricing varies depending on individual publisher metrics (DA, DR, monthly organic traffic). You can sign up for free to browse our full live marketplace catalog with transparent pricing!";
      }
      if (q.includes("contact") || q.includes("phone") || q.includes("support") || q.includes("call") || q.includes("number")) {
        return "📞 **Contact Support:**\nYou can call our campaign strategists directly at **+91 9490056002** (24/7 Mon-Fri) or ask me any question right here!";
      }
      if (q.includes("influencer") || q.includes("creator") || q.includes("podcast")) {
        return "🎙️ **For Influencers & Creators:**\nPartner with global brands for podcast placements, sponsored videos, and media shoutouts with instant task management and direct payouts.";
      }
      return "Welcome to **MediaHub**! I can help you with:\n- 🚀 **Advertisers & Agencies** (buying guest posts, Digital PR & backlinks)\n- 🌐 **Publishers** (monetizing your site traffic)\n- 🎙️ **Influencers & Creators** (brand sponsorships)\n- 📞 **Contact & Phone Support (+91 9490056002)**\n\nHow can I assist you today?";
    };

    let replyText = "";

    // If API key is available, attempt official Gemini 2.0 / 1.5 Flash models
    if (apiKey) {
      const contents: any[] = [];
      if (Array.isArray(history)) {
        history.forEach((h: { sender: string; text: string }) => {
          if (h.sender === "user") {
            contents.push({ role: "user", parts: [{ text: h.text }] });
          } else if (h.sender === "bot") {
            contents.push({ role: "model", parts: [{ text: h.text }] });
          }
        });
      }
      contents.push({ role: "user", parts: [{ text: message }] });

      const payload = {
        systemInstruction: {
          parts: [{ text: systemInstructionText }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      };

      // Valid API models in Google AI Studio (gemini-3.5-flash priority)
      const modelsToTry = [
        "gemini-3.5-flash",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash-latest"
      ];

      for (const modelName of modelsToTry) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          if (res.ok) {
            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              replyText = text;
              break;
            }
          }
        } catch (e) {
          // Ignore API fetch errors and fallback cleanly
        }
      }
    }

    // High-quality instant knowledge fallback if API key is invalid/exhausted or model list hits rate limit
    if (!replyText) {
      replyText = getKnowledgeAnswer(message);
    }

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("Error in AI support route:", error);
    return NextResponse.json({
      reply: "MediaHub is your all-in-one Digital PR and Publisher Marketplace. Feel free to call us directly at **+91 9490056002** or ask another question!",
    });
  }
}

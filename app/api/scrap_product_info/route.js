import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import cookie from "./cookie.json";
import fs from "fs";
import path from "path";
import { headers } from "next/headers";

// const fresh_cookie = await browser.cookies();

// const jsonFilePath = path.join(
//   process.cwd(),
//   "app",
//   "api",
//   "scrap_product_info",
//   "cookie.json"
// );
// fs.writeFileSync(
//   jsonFilePath,
//   JSON.stringify(fresh_cookie, null, 2),
//   "utf8"
// );

export async function POST(req, res) {
  // const headers = {
  //   "Access-Control-Allow-Origin": "*",
  //   "Content-Type": "text/event-stream;charset=utf-8",
  //   "Cache-Control": "no-cache",
  //   Connection: "keep-alive",
  // };

  // // Create a new response object for streaming
  // const response = new Response(
  //   async (readableStreamDefaultWriter) => {
  //     const writer = readableStreamDefaultWriter.getWriter();

  //     for (let i = 0; i < 5; i++) {
  //       const data = `data: Hello seq ${i}\n\n`;
  //       await writer.write(new TextEncoder().encode(data));
  //       await new Promise((resolve) => setTimeout(resolve, 1000)); // Sleep for 1 second
  //     }

  //     // Close the writer when done
  //     await writer.close();
  //   },
  //   { headers }
  // );

  // return response;
  try {
    const body = await req.json();
    const { asin } = body;

    const product_urls = asin.map(
      (asin) => `https://www.amazon.com/dp/${asin}`
    );

    const browser = await puppeteer.launch({ headless: false });

    const results = [];
    const batchSize = 3;

    for (let i = 0; i < product_urls.length; i += batchSize) {
      const batch = product_urls.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(async (url) => {
          const page = await browser.newPage();
          await page.setCookie(...cookie);
          await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
          );

          await page.goto(url, { waitUntil: "domcontentloaded" });
          const html = await page.content();
          const $ = cheerio.load(html);

          const image = $("#imgTagWrapperId").children().first().attr("src");
          const title = $("#productTitle").text().trim();
          const price = $("#corePrice_feature_div")
            .find("div span.a-offscreen")
            .first()
            .text()
            .trim();

          await page.close();

          return { url, image, title, price };
        })
      );

      results.push(...batchResults);
    }

    await browser.close();

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

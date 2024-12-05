import { json } from "@remix-run/node";

export async function action({ request }) {
  try {
    const body = await request.json();
    const { email, tag } = body;

    if (!email || !tag) {
      return json({ error: "Email and tag are required" }, { status: 400 });
    }

    const SHOPIFY_API_URL = `https://${process.env.SHOPIFY_SHOP_DOMAIN}/admin/api/2024-07/customers/search.json?query=email:${email}`;

    const response = await fetch(SHOPIFY_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_TOKEN,
      },
    });

    if (!response.ok) {
      return json({ error: "Failed to fetch customer data" }, { status: response.status });
    }

    const data = await response.json();

    if (!data.customers || data.customers.length === 0) {
      return json({ hasTag: false, message: "Customer not found" });
    }

    const customer = data.customers[0];
    const hasTag = customer.tags.split(", ").includes(tag);

    return json({ hasTag });
  } catch (error) {
    console.error("Error in processing request:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}

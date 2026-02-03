// PayPal integration - optional, only loaded if credentials are set
import { Request, Response } from "express";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

let paypalClient: any = null;
let ordersController: any = null;
let oAuthAuthorizationController: any = null;

async function initPayPal() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    console.log("PayPal credentials not found, payments will be disabled");
    return false;
  }

  try {
    const sdk = await import("@paypal/paypal-server-sdk");
    const { Client, Environment, LogLevel, OAuthAuthorizationController, OrdersController } = sdk;

    paypalClient = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: PAYPAL_CLIENT_ID,
        oAuthClientSecret: PAYPAL_CLIENT_SECRET,
      },
      timeout: 0,
      environment:
        process.env.NODE_ENV === "production"
          ? Environment.Production
          : Environment.Sandbox,
      logging: {
        logLevel: LogLevel.Info,
        logRequest: { logBody: true },
        logResponse: { logHeaders: true },
      },
    });

    ordersController = new OrdersController(paypalClient);
    oAuthAuthorizationController = new OAuthAuthorizationController(paypalClient);
    console.log("PayPal SDK initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize PayPal SDK:", error);
    return false;
  }
}

export async function getClientToken() {
  if (!oAuthAuthorizationController) {
    await initPayPal();
  }
  
  if (!oAuthAuthorizationController) {
    throw new Error("PayPal not initialized");
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const { result } = await oAuthAuthorizationController.requestToken(
    { authorization: `Basic ${auth}` },
    { intent: "sdk_init", response_type: "client_token" }
  );

  return result.accessToken;
}

export async function createPaypalOrder(req: Request, res: Response) {
  if (!ordersController) {
    await initPayPal();
  }

  if (!ordersController) {
    return res.status(503).json({ error: "PayPal not available" });
  }

  try {
    const { amount, currency, intent } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (!currency) {
      return res.status(400).json({ error: "Currency required" });
    }

    if (!intent) {
      return res.status(400).json({ error: "Intent required" });
    }

    const collect = {
      body: {
        intent: intent,
        purchaseUnits: [
          {
            amount: {
              currencyCode: currency,
              value: amount,
            },
          },
        ],
      },
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } = await ordersController.createOrder(collect);
    const jsonResponse = JSON.parse(String(body));
    res.status(httpResponse.statusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
}

export async function capturePaypalOrder(req: Request, res: Response) {
  if (!ordersController) {
    await initPayPal();
  }

  if (!ordersController) {
    return res.status(503).json({ error: "PayPal not available" });
  }

  try {
    const { orderID } = req.params;
    const collect = {
      id: orderID,
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } = await ordersController.captureOrder(collect);
    const jsonResponse = JSON.parse(String(body));
    res.status(httpResponse.statusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order" });
  }
}

export async function verifyPaypalOrder(orderId: string): Promise<{ 
  verified: boolean; 
  amount?: string; 
  currency?: string;
  status?: string;
}> {
  if (!ordersController) {
    await initPayPal();
  }

  if (!ordersController) {
    return { verified: false };
  }

  try {
    const { body } = await ordersController.getOrder({ id: orderId });
    const order = JSON.parse(String(body));
    
    if (order.status === "COMPLETED" || order.status === "APPROVED") {
      const amount = order.purchase_units?.[0]?.amount?.value;
      const currency = order.purchase_units?.[0]?.amount?.currency_code;
      return { 
        verified: true, 
        amount, 
        currency,
        status: order.status 
      };
    }
    
    return { verified: false, status: order.status };
  } catch (error) {
    console.error("Failed to verify PayPal order:", error);
    return { verified: false };
  }
}

export async function loadPaypalDefault(req: Request, res: Response) {
  try {
    const clientToken = await getClientToken();
    res.json({ clientToken });
  } catch (error) {
    console.error("Failed to get PayPal client token:", error);
    res.status(503).json({ error: "PayPal not available" });
  }
}

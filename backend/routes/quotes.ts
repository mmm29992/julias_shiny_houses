import { Router, type Request, type Response } from "express";
import crypto from "crypto";
import Quote from "../models/Quote";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// ---------- helpers ----------
function getDraftKey(req: Request) {
  return (req.header("x-draft-key") || req.query.draftKey || "").toString();
}

function canEditDraft(req: Request, quote: any) {
  const dk = getDraftKey(req);
  const isDraftOwner = dk && dk === quote.draftKey;
  const isClientOwner =
    req.user && quote.clientId && String(quote.clientId) === req.user.uid;
  return isDraftOwner || isClientOwner;
}

function isStaff(req: Request) {
  return req.user?.role === "owner" || req.user?.role === "employee";
}

// Whitelist fields that can be patched from the form
const ALLOWED_PATCH_FIELDS = new Set([
  "contact",
  "propertySnapshot",
  "propertyId",
  "frequency",
  "conditionLevel",
  "specialAreas",
  "surfaces",
  "targetWindow",
  "photos",
  "notes",
]);

function applyPatch(quote: any, body: any) {
  for (const key of Object.keys(body || {})) {
    if (ALLOWED_PATCH_FIELDS.has(key)) {
      // shallow assign is fine for our shapes
      (quote as any)[key] = body[key];
    }
  }
}

// ---------- routes ----------

/**
 * Create a draft (anonymous OK)
 * POST /quotes/draft  -> { id, draftKey }
 */
router.post("/draft", async (_req: Request, res: Response) => {
  const draftKey = crypto.randomBytes(16).toString("hex"); // 32-char
  const quote = await Quote.create({ status: "draft", draftKey });
  return res.status(201).json({ id: quote._id.toString(), draftKey });
});

/**
 * Update a draft (anonymous w/ x-draft-key OR authed owner)
 * PATCH /quotes/:id
 */
router.patch("/:id", async (req: Request, res: Response) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) return res.status(404).json({ error: "Quote not found" });
  if (quote.status !== "draft")
    return res.status(400).json({ error: "Only drafts can be edited" });

  // allow if draftKey matches OR (if logged in and owns it)
  const allowed = canEditDraft(req, quote);
  if (!allowed)
    return res.status(401).json({ error: "Not authorized to edit draft" });

  applyPatch(quote, req.body);
  await quote.save();
  return res.json({ ok: true });
});

/**
 * Claim a draft (attach to logged-in user) — requires auth + x-draft-key
 * POST /quotes/:id/claim
 */
router.post("/:id/claim", requireAuth, async (req: Request, res: Response) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) return res.status(404).json({ error: "Quote not found" });
  if (quote.status !== "draft")
    return res.status(400).json({ error: "Only drafts can be claimed" });

  const dk = getDraftKey(req);
  if (!dk || dk !== quote.draftKey)
    return res.status(401).json({ error: "Invalid draft key" });

  // attach to this user, consume draftKey (optional to keep for idempotency)
  quote.clientId = req.user!.uid as any;
  quote.draftKey = null;
  await quote.save();

  return res.json({ ok: true });
});

/**
 * Submit a quote — requires auth + ownership
 * POST /quotes/:id/submit
 * Validates required fields before submit
 */
router.post("/:id/submit", requireAuth, async (req: Request, res: Response) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) return res.status(404).json({ error: "Quote not found" });
  if (quote.status !== "draft")
    return res.status(400).json({ error: `Quote already ${quote.status}` });

  // must be owner
  if (!quote.clientId) quote.clientId = req.user!.uid as any;
  if (String(quote.clientId) !== req.user!.uid) {
    return res
      .status(401)
      .json({ error: "Not authorized to submit this quote" });
  }

  // ---- minimal required-for-submit checks ----
  const hasPhone = !!quote.contact?.phone?.trim();
  const hasProperty =
    !!quote.propertyId ||
    (!!quote.propertySnapshot?.address?.line1 &&
      !!quote.propertySnapshot?.address?.city &&
      !!quote.propertySnapshot?.address?.state &&
      !!quote.propertySnapshot?.address?.zip);

  if (!hasPhone)
    return res.status(400).json({ error: "Contact phone is required" });
  if (!hasProperty)
    return res
      .status(400)
      .json({ error: "Property is required (link or snapshot)" });

  quote.status = "submitted";
  await quote.save();

  return res.json({
    ok: true,
    quote: { id: quote._id, status: quote.status, clientId: quote.clientId },
  });
});

/**
 * Get my quote by id (client can view their own; staff can view any)
 * GET /quotes/:id
 */
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) return res.status(404).json({ error: "Not found" });

  const isOwner = quote.clientId && String(quote.clientId) === req.user!.uid;
  if (!isOwner && !isStaff(req))
    return res.status(403).json({ error: "Forbidden" });

  return res.json({ quote });
});

/**
 * List quotes
 * - clients: only their quotes
 * - staff (owner/employee): all, with optional ?status= and ?leadStatus=
 * GET /quotes
 */
router.get("/", requireAuth, async (req: Request, res: Response) => {
  const q: any = {};
  if (isStaff(req)) {
    if (req.query.status) q.status = req.query.status;
    if (req.query.leadStatus) q["admin.leadStatus"] = req.query.leadStatus;
  } else {
    q.clientId = req.user!.uid;
  }
  const quotes = await Quote.find(q).sort({ createdAt: -1 }).limit(100);
  return res.json({ quotes });
});

export default router;

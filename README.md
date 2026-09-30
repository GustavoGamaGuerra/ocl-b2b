# ONCHAIN Ramp — B2B Desktop V2

Plain HTML, CSS, and JavaScript prototype based on the [B2B Desktop V2 Figma page](https://www.figma.com/design/RQLsSgiN8wcmVLsNZLjIh8/ONCHAIN-RAMP-PRODUCTION?node-id=13797-138907).

## Run

```sh
cd /Users/gustavoguerra/Documents/ChatGPT/Portfolio/onchain-b2b
npm start
```

Open **http://127.0.0.1:4174**. Node serves the files; the application has no framework, build step, or runtime dependencies. The existing `onchain-prototype` checkout is separate.

## Explore

- Enter an example email and use confirmation code **371824**.
- Add company details, a network, and a token address. Example: `0x2c00000000000000000000000000000000004567`.
- Complete the whitepaper, payment currency, Starter plan, and simulated account verification steps.
- Explore the dashboard and transaction page. Search by wallet, order ID, or status; sort amounts; paginate; copy values; and download filtered CSV data.
- Open the account menu to visit settings. Edit project details, upload independent project and digital asset logos through the Figma preview dialog, edit the digital asset description, inspect the plan, or simulate deactivation. Image uploads support click-to-select and drag-and-drop; Save applies the preview and Cancel discards it.
- Use the bottom screen selector to preview any main screen directly. Restart resets the demo.

## Scope

The prototype implements the main sign-in, company and asset details, five-step setup, populated dashboard, transactions, and settings views. It is not an exhaustive reproduction of every duplicate, error, email-template, or billing variant on the Figma canvas. Billing includes the Figma Payment details and Transactions screens, with a network selector, copyable demo deposit address, balance, and nine sample subscription payments. Support, legal content, and external verification use simplified explanatory dialogs. The disabled Insights and Enterprise plans follow the design.

Authentication, verification, subscriptions, and account changes are simulated. No email, payment, or external account requests are made. Sample data is held in memory and clears on reload. The 120 transactions are illustrative, and the exported CSV contains those demo rows. Figma SVGs and the Inter font are local; design references are in `design/` and blocked by the local server.

## Validation

- `npm run check` validates JavaScript syntax.
- `verify.mjs` uses the bundled local Playwright installation and Chrome for interaction and layout checks. Its import path is specific to this workspace; adjust it for another machine.
- Verified incorrect/correct login codes, address validation, full onboarding, search/no-results, pagination, CSV download, project edits, all 14 main routes' image loading, browser errors, and narrow-screen overflow on representative views.

- Billing-only browser checks: `node verify.mjs --billing` (tab navigation, network persistence, payment records, logos, and responsive layout).

- Upload-flow browser checks: `node verify.mjs --upload` (preview, save/cancel, drag-and-drop, validation, independent logos, and mobile layout).

- Deactivation follows the reason → confirmation → completion modal flow. Reason submission is optional via Skip, acknowledgement is required, and Close returns to sign-in. Reactivate restores the demo session; no real deactivation or confirmation email is sent. Verify with `node verify.mjs --deactivation`.

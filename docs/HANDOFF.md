# Ownership handoff

What a new owner needs to take over the CICA website. It lists every account the site depends on, the secret names (never values), where form submissions go, and the steps to transfer. Details live in [deploy/CI.md](../deploy/CI.md) and [forms/namecheap.md](forms/namecheap.md).

## Accounts and services

| Service | What it does for the site | Where it shows up |
| --- | --- | --- |
| GitHub repo `Ramc4685/cica-website` | Source of truth, CI and deploys via Actions | `.github/workflows/namecheap.yml` |
| GitHub environments `staging`, `production`, `production-content` | Hold the deploy secrets; `production` has the required reviewer who approves go-live | [deploy/CI.md](../deploy/CI.md#activate-once) |
| Namecheap Stellar hosting, cPanel account `cicanrkn` on `server315.web-hosting.com` | Serves the site and staging, runs the PHP form handler, hosts the `organizers@cicainfo.com` mailbox | `deploy/deploy-namecheap.sh`, `deploy/install-release.sh`, `public/forms/submit.php` |
| SSH on port 21098 with a dedicated deploy key | How Actions installs releases; also how records are managed | [deploy/CI.md](../deploy/CI.md) |
| GoDaddy | Domain registration and DNS for `cicainfo.com` (A records for the site, `staging` and mail point at `192.64.118.48`) | [deploy/README.md](../deploy/README.md) |
| Pages CMS (GitHub App on the repo) | Volunteer content editor; commits to `main` as the app identity | `.pages.yml`, `lib/cms.ts`, [content-editing.md](content-editing.md) |
| Google Drive folder | Source of the bylaws and rules shown on the site | `content/site.json`, `lib/documents.ts`, [documents.md](documents.md) |
| Google Sheets (legacy) | Records of form submissions made before the PHP handler; the Apps Script endpoints are undeployed | [forms/namecheap.md](forms/namecheap.md) |
| CricClubs, Facebook, YouTube, WhatsApp | External links only, set in `content/site.json` | `content/site.json` |

No analytics, email service, database or other API keys are used. The site has no login.

## GitHub Actions secrets

The workflow reads five secrets and no repository variables. Every deploy job runs in an environment (`staging`, `production` or `production-content`), so the same five must be available to all three, either as environment secrets in each or as repository secrets:

| Secret | Meaning |
| --- | --- |
| `NAMECHEAP_SSH_HOST` | Hosting server hostname |
| `NAMECHEAP_SSH_USER` | cPanel account name |
| `NAMECHEAP_SSH_PORT` | SSH port (21098 on Namecheap shared hosting) |
| `NAMECHEAP_SSH_PRIVATE_KEY` | Private half of the dedicated deploy key |
| `NAMECHEAP_SSH_KNOWN_HOSTS` | Independently verified host-key line for host and port |

`CICA_DEPLOY_TARGET` is set by the workflow itself (`staging` or `production`), not a secret. A missing secret fails the job with `Missing required configuration: <NAME>`; see [Deploy failed: what to check](../deploy/CI.md#deploy-failed-what-to-check).

## Form submissions

Contact, updates and sponsorship forms post to `/forms/submit.php`. Each accepted request is appended to `/home/cicanrkn/.cica-forms/requests.jsonl` (staging: `/home/cicanrkn/.cica-forms-staging`), outside the web root, and a notification goes to `organizers@cicainfo.com`. Deployments never touch these files. List, export or delete production records over SSH with `scripts/forms-records.php`; see [forms/namecheap.md](forms/namecheap.md#managing-stored-records). Server backups of each deploy are in `/home/cicanrkn/.cica-backups/`.

## Rotating credentials

- **Deploy SSH key:** generate a new dedicated key without a passphrase, authorize its public key in cPanel **SSH Access**, update `NAMECHEAP_SSH_PRIVATE_KEY` in every environment, run the workflow manually to confirm staging deploys, then deauthorize and delete the old key in cPanel.
- **Host key:** if Namecheap moves the account to another server, verify the new fingerprint through Namecheap, then update `NAMECHEAP_SSH_HOST` and `NAMECHEAP_SSH_KNOWN_HOSTS`. Never disable host-key checking.
- **cPanel, Namecheap, GoDaddy and mailbox passwords:** change them in each provider and enable two-factor authentication. Nothing in the repo or workflow depends on them.
- **Pages CMS:** remove departing collaborators in Pages CMS.

## Handing over

1. Add the new owner as an admin on the GitHub repo (or transfer the repo). If the repo moves, update `CMS_BASE` in `lib/cms.ts` (and its expected URLs in `__tests__/lib/cms.test.ts`), the repo name in `docs/content-editing.md`, and the Pages CMS installation to the new `owner/name`.
2. Make the new owner a required reviewer on the `production` environment and remove anyone leaving.
3. Give the new owner access to the Namecheap account (or transfer the hosting subscription) and to cPanel.
4. Give them access to the GoDaddy account holding `cicainfo.com`, and note the domain and hosting renewal dates. Website and mail certificates expire April 23, 2027; deploys do not renew them.
5. Hand over the `organizers@cicainfo.com` mailbox credentials through a password manager, not chat or email.
6. Share the Google Drive rules folder and the legacy Sheets with the new owner.
7. Rotate the deploy SSH key and any shared passwords as above.
8. Have the new owner merge a small change to `main`, check staging, approve production and confirm the commit at https://cicainfo.com/deployment.json.
9. Confirm a test form submission on staging reaches the mailbox (see [forms/namecheap.md](forms/namecheap.md#verification-and-operation)).

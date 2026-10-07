# Hosted forms

The public forms POST JSON to `/forms/submit.php` with `type` contact, updates or sponsor. PHP 8.1+ is required; Namecheap SSH PHP8.2 was verified during setup. Deployment copies this file from public into the static export. The browser frontend remains statically hosted.

Requests must originate from https://cicainfo.com or https://www.cicainfo.com. Other origins and GET requests are rejected. A hidden website field, server validation, 16KB body limit and request limits reduce basic automated abuse. These are not a complete defense against a determined bot.

Records are stored at `/home/cicanrkn/.cica-forms/requests.jsonl`, outside public_html, with0700 directory and0600 files. The lock and rate bookkeeping are private as well. Raw IP addresses are not stored; bounded hashed buckets limit five requests per ten minutes. Storage stops accepting requests at20MiB until organizers archive records appropriately. Deployment does not overwrite this directory.

Each accepted record gets an opaque reference. An organizer notification is sent through the host mail transport to organizers@cicainfo.com, with a fixed sender and validated reply address. A notification failure does not erase the saved request or incorrectly report save failure. PHP mail acceptance does not prove inbox delivery. Review private records if notifications fail; do not publish this directory or restore it into public_html.

Updates requests are manually handled. This is not an automated newsletter service or tournament registration. The privacy page explains new hosting records and possible legacy GoogleSheet records. The scripts/apps-scripts handlers and CSV templates remain historical migration references; no frontend requests go to Google Apps Script.

## Verification and operation

`php -l public/forms/submit.php` and `php tests/forms-backend.php` check validation/private persistence/rate limits without sending mail. CI also runs browser-component/mock submission tests. A release needs HTTP runtime verification and controlled submission checks separately; never count mocks as real delivery.

For a controlled test, use clearly marked synthetic content, an owner-approved reply email, and verify each record by reference without displaying its personal fields. Verify organizer notification receipt or the host delivery log separately. Do not automatically resubmit after a timeout: the record may already exist.

Hosting administrators can inspect private records through cPanel/SSH. No browser admin or public record endpoint exists. Protect cPanel access; establish an owner-approved retention/archiving process and monitor disk usage. Do not put mailbox or hosting passwords in source or browser code.

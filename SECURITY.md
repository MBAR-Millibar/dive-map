# Security

## Reporting a vulnerability

Please don't open a public issue. Report it privately through [GitHub's vulnerability reporting](https://github.com/MBAR-Millibar/dive-map/security/advisories/new), or email [hello@millibar.io](mailto:hello@millibar.io) with "Security" in the subject.

Include what you found, how to reproduce it, and which version (tag) is affected. We'll confirm we received it, keep you updated, and credit you in the release notes unless you'd rather not be named.

## Supported versions

Only the latest release gets fixes. Projects pin a tag, so upgrade to the newest [release](https://github.com/MBAR-Millibar/dive-map/releases/latest) to get them.

## Scope

The package draws a map in the browser from data the host page passes in. Country names and community labels end up in tooltips, so a way to inject markup through them counts. For Millibar's apps and infrastructure, see [millibar.io/security](https://millibar.io/security).

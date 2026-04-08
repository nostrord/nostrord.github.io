---
layout: post
title: "Introducing Nostrord: A NIP-29 Group Chat Client for Sovereign Communities — Nostrord Blog"
post_title: "Introducing Nostrord: A NIP-29 Group Chat Client for Sovereign Communities"
subtitle: "Group chat has always been centralized. We're changing that, one relay at a time."
description: "Introducing Nostrord, a NIP-29 group chat client built with Kotlin Multiplatform and WebAssembly. Decentralized, censorship-resistant communities on Nostr."
keywords: "Nostrord, NIP-29, Nostr group chat, Kotlin Multiplatform, WebAssembly, decentralized group chat, censorship resistant, relay-managed groups"
date: 2026-03-30
author: "The Nostrord Team"
read_time: "7 min read"
tags:
  - NIP-29
  - Kotlin Multiplatform
  - WebAssembly
  - Nostr
---

## The Problem with Centralized Group Chat

Let's be honest: if you're using Discord, Telegram, or Slack for your community, you're building on someone else's land. Every group you create, every message your members send, every moderation decision you make... all of it lives on servers you don't control.

We've all seen what happens. Discord bans servers overnight. Telegram groups vanish without warning. Slack pricing forces painful migrations. One policy change, one ToS update, one government request, and years of community history can disappear. You have no recourse, because you never really owned any of it.

The root issue is simple: your identity and your infrastructure are tied together. Your "account" is just a username in someone's database. Your group exists only because a company keeps hosting it. If the platform goes away, everything goes with it.

Nostr changes the game on identity: your account is a cryptographic key pair that you generate and hold. No email, no phone number, no company that can lock you out. But until NIP-29 came along, group chat on Nostr felt incomplete. There was no formal membership, no real moderation tools, no access control. That's the gap we set out to fill.

<div class="callout">
<p><strong>Try it now:</strong> Nostrord runs in your browser today, no install required. <a href="https://web.nostrord.com/" rel="noopener noreferrer">Open the web app</a> and join or create your first NIP-29 group in under a minute.</p>
</div>

## What is NIP-29?

[NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md){:target="_blank" rel="noopener noreferrer"} is a Nostr specification for relay-managed groups. The core idea is elegant: groups aren't global objects living on a blockchain or DHT. They live on a relay, and the relay enforces the group's rules.

### Groups as relay-scoped objects

A NIP-29 group is identified by the relay URL plus a group ID, something like `groups.fiatjaf.com'general`. The same group ID on a different relay? Completely separate group. No global namespace to fight over, no registration fee, no one granting you permission to exist.

When you participate in a group, you send events to its relay. The relay checks each event against the current membership and role list before deciding to accept it. If it doesn't pass, it gets rejected. That's what "relay-enforced" means in practice: the relay is the gatekeeper, but one whose rules are transparent, auditable, and replaceable.

### Cryptographic moderation

Moderation in NIP-29 works through signed events. If an admin wants to remove a member, they publish a `kind:9001` event signed with their private key. Want to delete a message? Same idea, a signed deletion event. The relay verifies the signature and the author's role before doing anything.

Here's the part that really matters: all moderation actions are events on Nostr, which means they're publicly auditable. No hidden shadow bans, no secret admin panel. Anyone can read the full moderation history of a group from the relay's event stream. That's a level of accountability that centralized platforms simply cannot offer.

### Roles and access control

NIP-29 defines three main roles: **owners** control the group's metadata and manage admins; **admins** moderate members and messages; **members** can post. Groups can be public (open to everyone) or private (invite only), and relays can enforce read restrictions too.

### Interoperability by design

Because NIP-29 is an open standard, any compliant client can interact with any NIP-29 group. Nostrord users can chat in communities hosted by [Flotilla](https://flotilla.social){:target="_blank" rel="noopener noreferrer"}, [Chachi](https://chachi.chat){:target="_blank" rel="noopener noreferrer"}, or [0xChat](https://0xchat.com){:target="_blank" rel="noopener noreferrer"}. Same promise that makes email work: no single vendor owns the protocol.

## Why Kotlin Multiplatform + WebAssembly?

Building a truly cross-platform app is hard. The obvious approach (separate codebases for web, Android, iOS, and desktop) leads to feature drift, duplicated bugs, and a maintenance nightmare. We picked Kotlin Multiplatform (KMP) to solve this at the architecture level.

### One business logic layer, every platform

With KMP, we write our core logic once: Nostr event parsing and validation, NIP-29 group state, relay connections, key management, and cryptography. This shared code compiles to native binaries on Android, iOS, and desktop, and to WebAssembly for the browser. We're looking at over 90% code sharing across all platforms.

The real benefit goes beyond developer convenience. When we fix a bug in relay reconnection or improve NIP-44 encrypted DM handling, that fix ships everywhere at once. No more "works on Android but not on iOS" situations.

### WebAssembly for the browser

For the web, Kotlin compiles to WebAssembly via [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/){:target="_blank" rel="noopener noreferrer"}'s WASM target. This is a pretty different approach from the usual JavaScript or TypeScript web app.

WebAssembly runs at near-native speed inside a sandboxed runtime, the same one that enforces browser security. Unlike a JS bundle, a WASM binary can't be trivially inspected or modified at runtime, which shrinks the attack surface for supply chain attacks. The sandbox also means the browser's security model applies uniformly, without the quirks of JavaScript's dynamic type system.

Compose Multiplatform gives us a declarative UI that renders consistently everywhere. The same component tree that becomes native Android views also renders to a canvas-backed WASM surface in the browser. No separate HTML/CSS layer to maintain.

### The trade-off

We won't pretend KMP + WASM is free. The initial WASM bundle is bigger than a minimal JS app. The tooling is improving fast but isn't as polished as React or Vue yet. We made this trade-off on purpose: correctness, security, and long-term maintainability matter more to us than shaving a few kilobytes off the first load.

<div class="callout">
<p>Curious about the architecture? All source code is on <a href="https://github.com/nostrord/nostrord" target="_blank" rel="noopener noreferrer">GitHub</a>. Pull requests, issues, and technical discussions are welcome.</p>
</div>

## Features Available Today

The web app at [web.nostrord.com](https://web.nostrord.com/){:rel="noopener noreferrer"} is live and ready to use:

- **Multi-relay support** — connect to multiple NIP-29 relays at the same time. Switch between them or add your own whenever you want.
- **NIP-29 group chat** — create groups, send messages, browse history. Public and private groups both work.
- **Moderation basics** — delete messages and edit group metadata. Full admin operations like adding and removing members are coming soon.
- **Three sign-in methods** — generate a fresh key in the app, use a NIP-07 browser extension (like nos2x or Nostrame), or connect via NIP-46 remote signer to keep your private key off the browser.
- **Full Unicode and emoji** — no content restrictions beyond what your relay enforces, plus custom emoji support.
- **Zap display** — you can see zap events from other users in group chats. Full zap creation with Lightning integration is on the roadmap.
- **NIPs supported** — 01 (core protocol), 04 (encrypted DMs), 07 (browser extension signer), 11 (relay metadata), 19 (bech32 encoding), 27 (text note references), 29 (relay-based groups), 44 (modern encryption), 46 (remote signing), 65 (relay list metadata).
- **Interoperable** — your groups and messages show up in any NIP-29 compatible client.

## What's Coming Next

The web app is our starting point, not the finish line. Here's what we're actively working on:

- **Android and iOS apps** — native apps sharing the same KMP core. Same features as the web, with platform-native polish and background sync.
- **Desktop apps** — Windows, macOS, and Linux builds via Compose for Desktop, all sharing the same core logic.
- **Full admin operations** — UI for adding and removing members, managing roles, and banning users from groups.
- **Zap creation** — Lightning integration so you can send zaps directly from group chats, not just view them.
- **Push notifications** — opt-in notifications for group messages, mentions, and admin actions, supporting both web push and native push APIs.

<div class="callout">
<p><strong>Follow progress:</strong> Watch the <a href="https://github.com/nostrord/nostrord" target="_blank" rel="noopener noreferrer">GitHub repository</a> for updates, or open an issue to share ideas and report bugs.</p>
</div>

## How to Contribute

Nostrord is open source and we genuinely welcome contributions at every level:

- **Code** — check out [open issues on GitHub](https://github.com/nostrord/nostrord/issues){:target="_blank" rel="noopener noreferrer"} for bugs and features tagged `good first issue`. Submit a PR, or open an issue to talk through an idea first.
- **Testing and feedback** — use the [web app](https://web.nostrord.com/){:rel="noopener noreferrer"} and tell us what feels broken or confusing. Detailed bug reports with steps to reproduce are incredibly helpful, especially across different browsers, OSes, and relay setups.
- **Run a NIP-29 relay** — more relays means more resilience and more choice. If you run infrastructure, consider deploying a NIP-29 compatible relay like [khatru](https://github.com/fiatjaf/khatru){:target="_blank" rel="noopener noreferrer"} or [relay29](https://github.com/fiatjaf/relay29){:target="_blank" rel="noopener noreferrer"} and sharing it with the community.
- **Translations** — speak a language other than English? Reach out via [GitHub Discussions](https://github.com/nostrord/nostrord/issues){:target="_blank" rel="noopener noreferrer"}. i18n support is planned and translators will be credited.

<div class="callout">
<p><strong>Join the community:</strong> Chat with us on our <a href="https://web.nostrord.com/?relay=groups.0xchat.com&group=nostrord" target="_blank" rel="noopener noreferrer">Nostrord NIP-29 group</a>. Ask questions, share feedback, and connect with other users and contributors.</p>
</div>

## Try It Now

No installation, no account needed. You can generate a key right in the app and start exploring groups in under a minute. Already have a Nostr identity? Sign in with your NIP-07 extension or NIP-46 bunker.

<div style="text-align: center; margin: 2.5rem 0;">
<a href="https://web.nostrord.com/" class="btn btn-primary" style="font-size: 1rem; padding: 1rem 2rem;" rel="noopener noreferrer">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M5 12h14M12 5l7 7-7 7"/>
</svg>
Open Nostrord Web App
</a>
</div>

We're still early. The protocol is maturing, the tooling keeps getting better, and the relay ecosystem is growing. If decentralized, sovereign communities on the internet matter to you, we'd love to have you along for the ride.

Questions, feedback, ideas? All welcome on [GitHub](https://github.com/nostrord/nostrord){:target="_blank" rel="noopener noreferrer"}. See you on the relays.

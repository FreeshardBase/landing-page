---
title: "Sundial, and the Design Philosophy Behind It"
description: "Sundial, Freeshard's ground-up rewrite of the shard interface, is ready to become the default on every shard. What it adds over the old web-terminal, and the Daylight Instrument design philosophy behind how it looks and works."
pubDate: 2026-10-20
cover: ./sundial-and-the-design-philosophy-behind-it/cover.png
coverAlt: "A bright Nordic room with a desk, a teal couch and a plant; a terminal on the desk shows a calm, paper-like interface"
lang: en
author: Max von Tettenborn
draft: true
---

For as long as Freeshard has existed, the thing you actually touch every day, the web-terminal, has been showing its age. It worked, but every new feature meant fighting a foundation that had quietly outgrown its original shape, and more than that, it just looked old and stale. At some point I stopped patching it and started over.

That rewrite has a nice name: Sundial, built around a design language we're calling Daylight Instrument, more on that below. It's been running alongside the old interface on my own shard since July, I've been [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) it in the daily grind of actually using my stuff, and it's now close enough to parity, and better in enough places, that I think it's ready to become the interface on every shard.

## What it actually is

Sundial is a ground-up rewrite, lighter and simpler than the app it replaces, talking to the same shard you've always had behind the scenes. It does what the old app did: your apps, your paired devices, your public page, your settings. It also adds a few things the old one never had: a resource monitor right on the home screen so you can see at a glance what your shard is actually doing, dark mode, support for installing it like a native app on your phone, and an interface in English or German depending on how your browser is set. If you'd like another language, [tell us](mailto:contact@freeshard.net).

![Sundial's home screen, with the app grid and the resource monitor](./sundial-and-the-design-philosophy-behind-it/home.png)
*Home: your apps and your resource monitor, at a glance.*

## Why it looks the way it does

The design style we created for it has a name: Daylight Instrument. The reference point we kept coming back to was a screen on a spaceship bridge, like on [The Expanse](https://www.imdb.com/title/tt3230854/): thin bright lines, nothing drawn that doesn't mean something, function first. We then inverted it, what was dark and cinematic became light and everyday, because the thing we actually wanted the interface to feel like wasn't a cockpit, it was an instrument you'd trust: calm, precise, and happy to sit on a shelf in daylight rather than glow in the dark. The [landing page](https://freeshard.net) you are probably viewing right now adopted that same style just a few days ago, so it's no longer only Sundial's look, it's becoming Freeshard's.

![The same home screen in dark mode](./sundial-and-the-design-philosophy-behind-it/dark-home.png)
*Same screen, dark mode. Same bones, different light.*

One early viewer looked at a mockup and said it looked like IKEA, in a good way. I worked it into the brief. IKEA's own design philosophy, good design that's accessible to everyone rather than a luxury good, is close to a direct restatement of what Freeshard is trying to do: make running your own small corner of the internet something anyone can do, not just the people already comfortable with servers. The Swedish idea of *lagom*, roughly "just the right amount, no more," became a working rule: show what the owner needs right now and nothing else. An idle shard should look idle. No badges nagging you to explore a feature, no "did you know" cards, no manufactured reason to stick around.

That same instinct shows up in how choices are presented. A confirm dialog gives both buttons, proceed and cancel, the same visual weight, and spells out in plain language what happens next. Nothing is pre-checked for you. Nothing is phrased to make the prominent choice the one you'll regret. If running your own server is supposed to put you back in the driver seat, the interface asking you to make a decision shouldn't be nudging you one way or the other.

Keyboard navigation got the same care as the visuals: a first-class way to use the whole app, not an afterthought. Every part of Sundial works from the keyboard alone, arrows to move around, letter shortcuts to jump straight to a destination. The menu moved too, from a bar at the top to a dock at the bottom, closer to how macOS or GNOME do it, mostly because it's a lot easier to reach with your thumb on a phone.

## The badge that proves it's your shard

Every shard gets a small badge, the diamond logomark next to a short id, meant to live in the dock and work equally well printed on a sticker or on a box. The border around it isn't decoration, its pattern of thick and thin is computed from your shard's own id, so every shard's badge is visually unique and the same shard always draws the same border. The idea is that you learn to recognize yours at a glance the way you'd recognize a face, without reading the id at all. It's the newest piece of the design and the one we're least sure about: if it doesn't actually help you tell your shard apart from any other, [tell us that too](mailto:contact@freeshard.net).

![The badge, bottom-left in the dock, on an actual shard](./sundial-and-the-design-philosophy-behind-it/badge.png)
*This one's mine. Yours will draw a different border.*

## Where this leaves your shard

None of this changes what Freeshard does. It changes what it feels like to use it, and it quietly removes a few things that bothered me every time I used the old app myself: a menu that never worked well on a phone, confirm dialogs that didn't play fair.

A sneak peek of two things that are still coming, landing on this new foundation rather than the old one: a real redesign of the app store, and OIDC-based login, so pairing your device with your shard logs you into all your apps automatically. Saving yourself a password is the small benefit of that. The bigger one is giving a family member or a small team their own account on your shard, where you control what they're allowed to do, logging into every app through that one account instead of a separate one per app per person. That one is a big deal since it fundamentally changes the nature of a shard from a single-user product to a shareable one. But more on that later. Neither is live yet, both are close.

This is the interface now, on every shard. There's no classic version to switch back to. If something about it genuinely gets in your way, say so. [contact@freeshard.net](mailto:contact@freeshard.net) reaches me directly.

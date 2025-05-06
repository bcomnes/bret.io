---
layout: article
title: "It's time to install SteamOS 3.7"
serif: false
publishDate: "2025-04-29T23:56:07.067Z"
handlebars: false
---

I recently installed Steam OS 3.7 on my commidity AMD HTPC and it's working great.
I will write that up soon but in the meantime, here is my procedure and notes.

## Installing Steam OS 3.7

(This will go stale quick, but as of writing this works)

### Prep Tips:

- The recovery image flashes to SteamOS 3.5.
- SteamOS 3.5 has limited hardware support, so in the case of desktop hardware, enable integrated graphics and plug your monitor directly into your integrated graphics HDMI/Display Port.
- Some of the discrete GPUs I tested with SteamOS 3.5 failed to boot, I don't even recommend trying. Just use iGPUs for the initial install and switch back to discrete graphics once you are on 3.7.

### Procedure:

- Download the Steam Deck Recovery Image, detailed here: https://help.steampowered.com/en/faqs/view/1b71-edf2-eb6d-2bb3
- Flash the recovery image to a USB drive
- Boot the USB drive on your "Steam Machine" and "re-flash" your "Deck" where your "Deck" is whatever hardware manages to boot the recovery image.
- It flashes to the primary nvme drive of the system, deleting whatever is there. Careful!
- Once flashed, reboot, remove the USB drive and sign in.
- Set your update channel to **beta** in system settings. This will reboot into Steam OS 3.6.
- Once booted into Steam OS 3.6, set your update channel to **preview**. This will reboot into Steam OS 3.7
- Congrats! You are running Steam OS 3.7! Go back to your BIOS, disable integrated graphics and test your discrete GPU.
- You are now running Steam OS 3.7 on whatever hardware you like!

## Why Steam OS Now?

It's been rumored for a while now that Steam OS, the [Arch](https://archlinux.org) based Linux distro running on the Steam Deck, is progressing towards becoming a more universal Linux distro that any device can run.

![](./img/linus.webp)

I tried installing Steam OS on conventional hardware a few months ago without much success:

- It wouldn't boot outside of integrated graphics.
- It had plenty of Deck jank, like rotated console output and boot logs.
- Performance was super bad and games weren't launching right.

Of the [announcements](https://www.gamingonlinux.com/2025/05/steamos-3-7-5-preview-improves-lenovo-legion-go-s-support-and-brings-more-bug-fixes/) that have been made, all focus has been on handheld form factors similar to the Steam Deck (like the [Lenovo Go S](https://www.bestbuy.com/site/lenovo-legion-go-s-8-120hz-gaming-handheld-amd-ryzen-z1-extreme-steamos-32gb-with-1tb-ssd-nebula/6619188.p?skuId=6619188)) however it's becoming clear that the preview channel for SteamOS has much improved support for conventional hardware than it did in prior versions.

From testing in the [SteamFork](https://github.com/SteamFork) community, it's clear that running "vanilla" SteamOS is now viable for a lot of hardware (especially AMD desktop hardware).
You should totally give it a shot!

## What if I can't boot the repair image

If you can't boot the repari image, you could try flashing one of the other SteamOS images directly to your boot disk or one of the newer unreleased repair images.
If you do, please share your notes on what worked or didn't work!

- [All SteamOS ISO Images](https://steamdeck-images.steamos.cloud/steamdeck/?C=M&O=D) - All SteamOS images.
- [Steam Repair Image Current](https://help.steampowered.com/en/faqs/view/1b71-edf2-eb6d-2bb3)
- [steamdeck-repair-20250320.1000-3.8.0.img.zip](https://steamdeck-images.steamos.cloud/steamdeck/20250320.1000/?C=M&O=D) The 3.8 unstable repair image.

## Come chat

If you are running SteamOS on non Steam Deck hardware, please join the [SteamFork (RIP) Discord](https://discord.gg/5KmBn5ttCa) to chat about your adventures.

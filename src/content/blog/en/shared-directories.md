---
title: "Shared Directories"
description: "Portal apps used to store data in siloed per-app databases or directories. Shared directories let apps read and write a common filesystem area instead, the way apps do on any normal OS."
pubDate: 2022-06-28
lang: en
author: Max von Tettenborn
---

⚠️ This feature is not backward-compatible. Your current Portal must be deleted, and you need to recreate it. Write us as soon as you are ready.

Most apps that you install on your Portal need to persist data in some way. There are currently two ways they can do that: a) they request a database on the Postgres instance that is running on the Portal or b) they mount a part of the Portal's filesystem.

Both options isolate the data of each app from those of all other apps and the Portal itself. The database is exclusively used by the app and directories are mounted from an app-exclusive subdirectory. This prevents any sharing of data between apps and ironically mirrors the way SaaS products are working today - one data-silo per application. We find that pattern annoying and don't want it to be repeated on Portal.

![Directories](./shared-directories/screenshot_dirs.png)

If you look at basically any operating system, you will not find this kind of data-silos. There is a filesystem and application can use it to freely read and write files. This gives the user much more freedom and control, so with Portal we do something similar.

The feature is called "shared directories" and it is described in detail [in the documentation](https://docs.freeshard.net/developer_docs/persisting/#shared-directories). In short, we have added a few directories that are meant to be shared between apps.

An app can request access to one or more of them and Portal will mount them into the Docker container when starting the app. Changes made by one app are seen by all other apps that have the directory mounted.

This also allowed us to bring a few new apps to the store that were previously blocked by the missing feature. [Navidrome](https://www.navidrome.org/) is like a selfhosted Spotify for all your music and [Photoprism](https://photoprism.app/) lets you view and organize all the photos and videos that you make. In addition, the good old [Filebrowser](https://filebrowser.org/) can now access all shared directories, so you can use it to view and edit their file structure.

![Navidrome](./shared-directories/screenshot_navidrome.png)
![Photoprism](./shared-directories/screenshot_photoprism.png)

We are planning to release more apps that can take advantage of shared directories. Tell us if you can think of any that you would like to see.

# Pudu desktop

Official Pudu desktop downloads, published by The Orb Company.

## macOS private beta

Download the DMG matching your Mac from [Releases](https://github.com/nikgraphx/Pudu-desktop/releases/latest): arm64 for Apple Silicon, x64 for Intel. Open the DMG, drag Pudu into Applications, and launch it from Applications.

These private beta builds use a persistent Apple Development signature. They are not Developer ID signed or notarized. macOS may require approval in Privacy & Security. Do not disable Gatekeeper globally. Access to Pudu still requires an approved beta account.

Version 0.4.3 introduces automatic Mac updates. Older builds need one manual replacement. Future published updates download in the background and offer Restart to update. Pudu does not install an update during an active call.

## Windows

Download the [Windows x64 installer](https://github.com/nikgraphx/Pudu-desktop/releases/download/v0.4.7/Pudu-0.4.7-win-x64.exe). Run setup and open Pudu. This private-beta EXE is not Authenticode-signed, so Windows can show an unknown-publisher or SmartScreen warning. Do not disable Windows security globally.

Versions 0.4.6 and later support background updates with an explicit Restart to update action. Update metadata is authenticated against a public key embedded in the app, and installer checksums are verified. Existing users on 0.4.2 need one manual installer upgrade. Microsoft Store distribution is deferred.

For the first update test, install [0.4.6](https://github.com/nikgraphx/Pudu-desktop/releases/download/v0.4.6/Pudu-0.4.6-win-x64.exe), then let Pudu download 0.4.7 and choose Restart to update. Actual Windows replacement/relaunch is awaiting tester confirmation.

## Source and support

This repository contains desktop installers and update metadata. It does not contain Pudu application source or signing keys. Visit [Pudu](https://pudu.chat) for the app and beta access.

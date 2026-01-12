<script lang="ts">
        import { browser } from '$app/environment'
        import { navigating, page } from '$app/state'
        import { APP_DIALOGS_COMPONENTS } from '$lib/components/app-dialogs/dialogs.ts'
        import Button from '$lib/components/Button.svelte'
        import Icon from '$lib/components/icon/Icon.svelte'
        import MenuRenderer, { setupGlobalMenu } from '$lib/components/menu/MenuRenderer.svelte'
        import PlayerOverlay from '$lib/components/PlayerOverlay.svelte'
        import SnackbarRenderer from '$lib/components/snackbar/SnackbarRenderer.svelte'
        import { setupOverlaySnippets } from '$lib/layout-bottom-bar.svelte'
        import { MainStore } from '$lib/stores/main/store.svelte.ts'
        import { setMainStoreContext } from '$lib/stores/main/use-store.ts'
        import { PlayerStore } from '$lib/stores/player/player.svelte.ts'
        import { setPlayerStoreContext } from '$lib/stores/player/use-store.ts'
        import { onViewTransitionPrepare, setupAppViewTransitions } from '$lib/view-transitions.svelte.ts'
        import { setupAppInstallPromptListeners } from './layout/app-install-prompt.ts'
        import {
                type DirectoriesPermissionPromptSnackbarArg,
                setupDirectoriesPermissionPrompt,
        } from './layout/setup-directories-permission-prompt.svelte.ts'
        import { syncSongsFromYaml } from '$lib/library/yaml-sync'
        import * as m from '$paraglide/messages'

        let overlayContentHeight = $state(0)

        $effect(() => {
                fetch('/songs.yaml')
                        .then((r) => r.text())
                        .then((text) => syncSongsFromYaml(text))
                        .catch(console.error)
        })

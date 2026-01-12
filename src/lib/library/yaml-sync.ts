import { getDatabase } from '$lib/db/database.ts'
import { LEGACY_NO_NATIVE_DIRECTORY, UNKNOWN_ITEM } from '$lib/library/types.ts'
import yaml from 'js-yaml'

export const syncSongsFromYaml = async (yamlContent: string) => {
        const data = yaml.load(yamlContent) as Array<{
                name: string
                artist: string
                album: string
                url: string
        }>
        const db = await getDatabase()
        const tx = db.transaction(['tracks', 'albums', 'artists'], 'readwrite')

        // Get existing tracks to avoid duplicates
        const existingTracks = await tx.objectStore('tracks').getAll()
        const existingUrls = new Set(existingTracks.map(t => typeof t.file === 'string' ? t.file : ''))

        for (const song of data) {
                if (existingUrls.has(song.url)) continue

                const trackUuid = crypto.randomUUID()
                const artistUuid = crypto.randomUUID()
                const albumUuid = crypto.randomUUID()

                const trackId = Math.floor(Math.random() * 1000000000)
                const artistId = Math.floor(Math.random() * 1000000000)
                const albumId = Math.floor(Math.random() * 1000000000)

                await tx.objectStore('artists').put({
                        id: artistId,
                        uuid: artistUuid,
                        name: song.artist,
                })

                await tx.objectStore('albums').put({
                        id: albumId,
                        uuid: albumUuid,
                        name: song.album,
                        artists: [song.artist],
                })

                await tx.objectStore('tracks').put({
                        id: trackId,
                        uuid: trackUuid,
                        name: song.name,
                        album: song.album,
                        artists: [song.artist],
                        year: UNKNOWN_ITEM,
                        duration: 0,
                        genre: [],
                        trackNo: 0,
                        trackOf: 0,
                        discNo: 0,
                        discOf: 0,
                        file: song.url as any, 
                        scannedAt: Date.now(),
                        fileName: song.name,
                        directory: LEGACY_NO_NATIVE_DIRECTORY,
                })
        }

        await tx.done
}

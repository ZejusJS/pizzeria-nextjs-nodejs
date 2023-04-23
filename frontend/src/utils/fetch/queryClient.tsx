import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'

const cacheTime = 1000 * 60 * 2

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 1,
            cacheTime
        }
    }
})

const persister = createSyncStoragePersister({
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
})

persistQueryClient({
    queryClient,
    persister: persister,
    maxAge: cacheTime
})
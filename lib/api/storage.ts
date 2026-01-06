import { createClient } from "@/lib/client"

export async function uploadEventImage(file: File, path: string) {
    const supabase = createClient()

    // 1. Upload file to 'events' bucket
    const { data, error } = await supabase
        .storage
        .from('events')
        .upload(path, file, {
            cacheControl: '3600',
            upsert: true
        })

    if (error) {
        console.error('Error uploading image:', error)
        throw new Error(error.message)
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase
        .storage
        .from('events')
        .getPublicUrl(data.path)

    return publicUrl
}

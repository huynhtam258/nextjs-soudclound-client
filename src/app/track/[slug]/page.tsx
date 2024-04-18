import WaveTrack from "@/components/wave.track";
import { Container } from "@mui/material";
import { getIdBySlug, sendRequest } from "@/utils/api";
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    
    const id = getIdBySlug(params.slug)
    
    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
        method: "GET"
    })
    return {
        title: res.data?.title,
        description: res.data?.description,
        openGraph: {
            title: `Bài hát ${res.data?.title}`,
            description: 'Beyond Your Coding Skills',
            type: 'website',
            images: [],
        }
    }
}

const DetailTrackPage = async (props: any) => {
    const { params } = props;
    const id = getIdBySlug(params.slug)
    
    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
        method: "GET",
        nextOption: { 
            // cache: 'no-store',
            next: { tags: ['track-by-id'] }
        }
    })
    

    const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
            current: 1,
            pageSize: 100,
            trackId: id,
            sort: "-createdAt"
        }
    })

    const comments = (res1.data?.result || []).map((comment) => ({
        id: comment._id,
        avatar: `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/chill1.png`,
        moment: comment.moment,
        user: comment.user,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
    }))
    
    return (
        <Container>
            <div>
                <WaveTrack
                    track={res.data || null}
                    comments={comments}
                />
            </div>
        </Container>
    )
}

export default DetailTrackPage
import { fetchDefaultImages, sendRequest } from "@/utils/api"
import { useHasMounted } from "@/utils/customHook";
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from "@mui/material"
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import WaveSurfer from "wavesurfer.js";

dayjs.extend(relativeTime)

interface IProps {
    comments: any[]
    track: ITrackTop | null,
    wavesurfer: WaveSurfer
}
const CommentTrack = (props: IProps) => {
    const router = useRouter()
    const hasMounted = useHasMounted()

    const { comments, track, wavesurfer } = props
    const { data: session } = useSession()
    const [yourComment, setYourComment] = useState<string>('')

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }

    const handleJumpTrack = (moment: number) => {
        if (wavesurfer) {
            const duration = wavesurfer.getDuration()
            wavesurfer.seekTo(moment / duration)
            wavesurfer.play()
        }
    }

    const handleSubmit = async () => {
        const res = await sendRequest<IBackendRes<ITrackComment>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
            method: 'POST',
            body: {
                content: yourComment,
                moment: Math.round(wavesurfer.getCurrentTime() ?? 0),
                track: track?._id
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`
            }
        })
        if (res.data) {
            setYourComment('')
            router.refresh()
        }
    }
    return (
        <>
            <div style={{ marginTop: '50px', marginBottom: '25px' }}>
                <TextField
                    value={yourComment}
                    margin="normal"
                    fullWidth
                    label="Comment"
                    variant="standard"
                    onChange={(e) => setYourComment(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSubmit()
                        }
                    }}
                />
                <div style={{ display: 'flex', gap: 10 }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            width: 'fit-content'
                        }}>
                        <Image
                            src={`${fetchDefaultImages(track?.uploader.type || '')}`}
                            width={200}
                            height={200}
                            alt="avatar"
                        />
                        <p>{track?.uploader.name}</p>
                    </div>
                    <Grid item xs={12} md={6} style={{ width: '100%' }}>
                        <List>
                            {comments.map((comment) => {
                                return (
                                    <ListItem
                                        secondaryAction={dayjs(comment.createdAt).fromNow()}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                <Image
                                                    src={comment.avatar}
                                                    width={40}
                                                    height={40}
                                                    alt="comment"
                                                    />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleJumpTrack(comment.moment)}
                                            primary={comment.content}
                                            secondary={hasMounted && `${comment.user.name} at ${formatTime(comment.moment)}`}
                                        />
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Grid>
                </div>
            </div>

        </>

    )
}

export default CommentTrack
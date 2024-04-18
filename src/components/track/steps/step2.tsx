import { Box, Button, Grid, LinearProgress, LinearProgressProps, MenuItem, TextField, Typography } from "@mui/material"

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as React from 'react';
import styled from "@emotion/styled";
import axios from "axios";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import { useToast } from "@/utils/toast";
import Image from "next/image";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


function InputFileUpload(props: any) {
    const { info, setInfo } = props
    const { data: session } = useSession()
    const toast = useToast()
    const handleUpload = async (image: any) => {
        const formData = new FormData()
        formData.append('fileUpload', image)

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                    'target_type': 'images'
                }
            })
            setInfo({
                ...info,
                imgUrl: res.data.data.fileName
            })
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    }

    return (
        <Button
            onChange={(e) => {
                const event = e.target as HTMLInputElement
                if (event.files) {
                    handleUpload(event.files[0])
                }

            }}
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
    );
}


function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}


function LinearWithValueLabel(props: IProps) {

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={props.trackUpload.percent} />
        </Box>
    );
}

interface IProps {
    trackUpload: {
        fileName: string,
        percent: number,
        uploadedTrackName: string
    },
    setValue: (v: number) => void
}

interface INewTrack {
    title: string,
    description: string,
    trackUrl: string,
    imgUrl: string,
    category: string,
}

const Step2 = (props: IProps) => {
    const { trackUpload, setValue } = props;
    const { data: session } = useSession()
    const [info, setInfo] = React.useState<INewTrack>({
        title: '',
        description: '',
        trackUrl: '',
        imgUrl: '',
        category: ''
    })
    const toast = useToast()
    React.useEffect(() => {
        if (trackUpload && trackUpload.uploadedTrackName) {
            setInfo({
                ...info,
                trackUrl: trackUpload.uploadedTrackName
            })
        }
    }, [trackUpload])

    const category = [
        {
            value: 'CHILL',
            label: 'CHILL',
        },
        {
            value: 'WORKOUT',
            label: 'WORKOUT',
        },
        {
            value: 'PARTY',
            label: 'PARTY',
        }
    ];

    const handleSubmitForm = async () => {
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
            method: "POST",
            body: { ...info },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        })
        if (res.data) {
            setValue(0)
            toast.success("Create a new track success!")

            await sendRequest<IBackendRes<any>>({
                url: "/api/revalidate",
                method: "POST",
                queryParams: {
                    tag: 'track-by-profile',
                    secret: process.env.REVALIDATE_SECRET
                }
            })
        } else {
            toast.error(res.message)
        }
    }


    return (
        <>
            <div>
                <div>
                    {trackUpload.fileName}
                </div>
                <LinearWithValueLabel
                    trackUpload={trackUpload}
                    setValue={setValue}
                />
            </div>

            <Grid container spacing={2} mt={5}>
                <Grid item xs={6} md={4}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: "10px"
                    }}
                >
                    <div style={{ height: 250, width: 250, background: "#ccc" }}>
                        <div>
                            {info.imgUrl
                                && <Image
                                    alt="avatar"
                                    height={250}
                                    width={250}
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
                                />}
                        </div>

                    </div>
                    <div >
                        <InputFileUpload info={info} setInfo={setInfo} />
                    </div>

                </Grid>
                <Grid item xs={6} md={8}>
                    <TextField
                        value={info?.title}
                        onChange={(e) => setInfo({
                            ...info,
                            title: e.target.value
                        })}
                        label="Title"
                        variant="standard"
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        value={info?.description}
                        onChange={(e) => setInfo({
                            ...info,
                            description: e.target.value
                        })}
                        label="Description"
                        variant="standard"
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        value={info?.category}
                        onChange={(e) => setInfo({
                            ...info,
                            category: e.target.value
                        })}
                        sx={{
                            mt: 3
                        }}
                        select
                        label="Category"
                        fullWidth
                        variant="standard"
                    >
                        {category.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        variant="outlined"
                        sx={{
                            mt: 5
                        }}
                        onClick={() => handleSubmitForm()}
                    >Save</Button>
                </Grid>
            </Grid>

        </>
    )
}

export default Step2
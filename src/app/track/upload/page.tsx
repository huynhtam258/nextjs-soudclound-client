import UploadTabs from "@/components/track/upload.tabs";
import { Container } from "@mui/material";


const UploadPage = () => {
    return (
        <Container
            sx={{
                marginTop: "46px",
                border: "1px solid #ddd"
            }}
        >
            <UploadTabs></UploadTabs>
        </Container>
    )
}

export default UploadPage;
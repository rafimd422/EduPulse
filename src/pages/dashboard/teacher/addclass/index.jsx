import DashboardLayout from "@/DashboardLayout";
import {
  Button,
  Grid,
  TextField,
  TextareaAutosize,
  Toolbar,
} from "@mui/material";
import Head from "next/head";
import Title from "./../../../../components/Title/Title";
import { Container } from "@mui/material";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "@/Provider/AuthProvider";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useRouter } from "next/router";

const AddClass = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const router = useRouter()



  
  const handleClassAdding = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    
    const title = data.get("courseTitle");
    const price = data.get("price");
    const photo = data.get("image");
    const shortDesc = data.get("shortDesc");
    const courseOutline = data.get("courseOutline");
    const formData = new FormData();
    formData.append("image", photo);
    axios
      .post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res.data);

        const courseData = {
          title,
          price,
          shortDesc,
          courseOutline,
          image: res.data?.data?.display_url,
          teacher: user?.displayName,
          teacherMail: user?.email,
          userImage: user?.photoURL,
          status: "pending",
          enrollCount: 0
                };
        axiosPublic.post("/classreq", courseData).then((res) => {
          swal("Your Class has been Added!", "Please Wait For the admin response!", "success");
          router.push('/dashboard/teacher/myclass')
        });
      });
  };

  return (
    <DashboardLayout>
      <Head>
        <title>EduPulse || Add class</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toolbar />
      <Title title={"Add"} titleColor={"Class"} />

      <Container component="form" onSubmit={handleClassAdding}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="title"
              label="Course Title"
              fullWidth
              name="courseTitle"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              type="number"
              id="price"
              name="price"
              label="Course Price"
              fullWidth
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label htmlFor="image">Thumbnall</label>
            <TextField
              required
              fullWidth
              id="image"
              type="file"
              name="image"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextareaAutosize
              name="shortDesc"
              aria-label="max width"
              required
              minRows={4}
              placeholder="Short description"
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item sm={12} md={12}>
            <TextareaAutosize
              name="courseOutline"
              aria-label="max width"
              required
              minRows={4}
              placeholder="Write the course Ourline Here"
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item sm={12} md={4}>
            <Button
              type="submit"
              sx={{
                backgroundColor: "#800000",
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "gray",
                },
              }}
            >
              Submit Course
            </Button>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};
//

export default AddClass;

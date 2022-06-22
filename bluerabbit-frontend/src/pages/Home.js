import React, { useEffect, useState } from "react";
import { Paper, Typography, TextField, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { PhotoCamera } from "@mui/icons-material";

const useStyles = makeStyles({
  components: {
    TextField: {
      styleOverrides: {
        root: {
          textAlign: "center",
        },
      },
    },
  },
  sections: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 12,
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  paperRoot: {
    backgroundColor: "#FFF !important",
  },
  centerTextField: {
    textAlign: "center",
  },
});

function Home() {
  const classes = useStyles();
  const [myName, setMyName] = useState("");
  const [displayedName, setDisplayedName] = useState("");
  const [isNameUploaded, setIsNameUploaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPictureUploaded, setIsPictureUploaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:8000/myName").then((res) => res.json());
      setMyName(res.name);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setDisplayedName(e.target.value);
  };

  const uploadImage = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const submitImage = async () => {
    const formData = new FormData();
    formData.append("image", selectedImage);

    const res = await fetch("http://localhost:8000/processImage", {
      method: "POST",
      body: formData,
    });

    if (res.status === 200) setIsPictureUploaded(true);
  };

  const handleSubmit = async () => {
    const input = { name: displayedName };
    const res = await fetch("http://localhost:8000/name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    setIsNameUploaded(res.ok);
  };

  return (
    <Paper className={classes.paper} classes={{ root: classes.paperRoot }} elevation={3}>
      {!isNameUploaded && (
        <>
          <div className={classes.sections}>
            <Typography gutterBottom classes={{ root: classes.graphTitle }} variant={"h4"}>
              {`Hello, my name is ${myName}`}
            </Typography>
          </div>

          <div className={classes.sections}>
            <Typography gutterBottom classes={{ root: classes.graphTitle }} variant={"h8"}>
              <TextField
                id="standard-basic"
                placeholder="What is your name?"
                variant="standard"
                inputProps={{ style: { textAlign: "center" } }}
                sx={{ textAlign: "center" }}
                onChange={handleChange}
                value={displayedName}
              />
            </Typography>
          </div>
          <div className={classes.sections}>
            <Button onClick={handleSubmit} variant="contained">
              Submit
            </Button>
          </div>
        </>
      )}

      {isNameUploaded && (
        <div className={classes.sections}>
          <Typography gutterBottom classes={{ root: classes.graphTitle }} variant={"h4"}>
            {`Hi ${displayedName}!`}
          </Typography>
        </div>
      )}

      {isNameUploaded && !isPictureUploaded && (
        <>
          <div className={classes.sections}>
            <Typography gutterBottom style={{ marginTop: 15 }} classes={{ root: classes.graphTitle }} variant={"h6"}>
              {`Would you like to upload a picture?`}
            </Typography>
          </div>

          <div className={classes.sections}>
            <div style={{ paddingRight: 9 }}>
              <Button variant="contained" component="label">
                <span style={{ paddingRight: 2 }}>UPLOAD</span> <PhotoCamera />
                <input onChange={uploadImage} accept="image/*" type="file" hidden />
              </Button>
            </div>
            <div>
              <Button onClick={submitImage} variant="contained">
                Submit
              </Button>
            </div>
          </div>
        </>
      )}

      {isPictureUploaded && (
        <div className={classes.sections}>
          <Typography gutterBottom classes={{ root: classes.graphTitle }} variant={"h4"}>
            {`You are a beautiful person!`}
          </Typography>
        </div>
      )}
    </Paper>
  );
}

export default Home;

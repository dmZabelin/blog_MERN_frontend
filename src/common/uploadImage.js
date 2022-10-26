import axios from "../axios";

const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    return axios.post("/upload", formData);
  } catch (err) {
    console.warn(err);
    alert("Error uploading file!");
  }
};

export default uploadImage;

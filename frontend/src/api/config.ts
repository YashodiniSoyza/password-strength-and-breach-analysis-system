let user = JSON.parse(localStorage.getItem("user") || "{}");

if (localStorage.getItem("role") === "admin") {
  user = JSON.parse(localStorage.getItem("admin") || "{}");
} else if (localStorage.getItem("role") === "user") {
  user = JSON.parse(localStorage.getItem("user") || "{}");
}

const requestConfig = {
  headers: {
    Authorization: "Bearer " + user.accessToken || "",
    "Content-type": "multipart/form-data",
  },
};

export default requestConfig;

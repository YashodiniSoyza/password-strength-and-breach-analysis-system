let user = JSON.parse(localStorage.getItem("user") || "{}");

if (localStorage.getItem("role") === "admin") {
  user = JSON.parse(localStorage.getItem("admin") || "{}");
} else if (localStorage.getItem("role") === "user") {
  user = JSON.parse(localStorage.getItem("user") || "{}");
}

const requestConfigJson = {
  headers: {
    Authorization: "Bearer " + user.accessToken || "",
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

export default requestConfigJson;
